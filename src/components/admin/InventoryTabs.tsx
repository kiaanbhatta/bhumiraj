import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";

import { EmptyState, ListSkeleton } from "@/components/common/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import {
  dailyBreakdown,
  formatMoney,
  inventoryTotals,
  monthlyBreakdown,
  productSalesBreakdown,
  summarizeSales,
  useAdjustStock,
  useCreateSale,
  useDeleteProduct,
  useDeleteSale,

  usePaymentMethods,
  useProcessReturn,
  useProducts,
  useSales,
  useSaveProduct,
  useStockMovements,
  type MovementType,
  type NewSaleLine,
  type Product,
  type SalePreset,
} from "@/lib/inventory";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

const emptyProduct = {
  name: "",
  sku: "",
  category: "General",
  description: "",
  purchase_price: 0,
  selling_price: 0,
  stock_quantity: 0,
  low_stock_threshold: 5,
  is_active: true,
};

/* ------------------------------- Items ------------------------------- */

export function ItemsTab() {
  const { data: products, isLoading } = useProducts();
  const save = useSaveProduct();
  const remove = useDeleteProduct();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [search, setSearch] = useState("");

  const set = (patch: Partial<typeof emptyProduct>) => setForm((prev) => ({ ...prev, ...patch }));
  const reset = () => {
    setEditingId(null);
    setForm({ ...emptyProduct });
  };

  const filtered = (products ?? []).filter((p) =>
    `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate(
            { ...form, ...(editingId ? { id: editingId } : {}) },
            { onSuccess: () => reset() },
          );
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">{editingId ? "Edit item" : "Add item"}</h3>
          {editingId ? (
            <Button type="button" size="sm" variant="ghost" onClick={reset}>
              <X className="mr-1 size-4" /> Cancel
            </Button>
          ) : null}
        </div>

        <Field label="Item name">
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Notebook" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Item code (SKU)">
            <Input value={form.sku} onChange={(e) => set({ sku: e.target.value })} placeholder="ITM-001" />
          </Field>
          <Field label="Category">
            <Input value={form.category} onChange={(e) => set({ category: e.target.value })} />
          </Field>
        </div>
        <Field label="Description">
          <Textarea rows={2} value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Purchase price">
            <Input
              type="number"
              step="0.01"
              value={form.purchase_price}
              onChange={(e) => set({ purchase_price: Number(e.target.value) })}
            />
          </Field>
          <Field label="Selling price">
            <Input
              type="number"
              step="0.01"
              value={form.selling_price}
              onChange={(e) => set({ selling_price: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={editingId ? "Stock (use Stock tab to change)" : "Opening stock"}>
            <Input
              type="number"
              disabled={Boolean(editingId)}
              value={form.stock_quantity}
              onChange={(e) => set({ stock_quantity: Number(e.target.value) })}
            />
          </Field>
          <Field label="Low stock alert at">
            <Input
              type="number"
              value={form.low_stock_threshold}
              onChange={(e) => set({ low_stock_threshold: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="item-active">Active</Label>
          <Switch id="item-active" checked={form.is_active} onCheckedChange={(v) => set({ is_active: v })} />
        </div>

        <Button type="submit" className="w-full" disabled={save.isPending}>
          {save.isPending ? "Saving..." : editingId ? "Save changes" : (<><Plus className="mr-2 size-4" />Add item</>)}
        </Button>
      </form>

      <div className="space-y-3">
        <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {isLoading ? (
          <ListSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState title="No items yet" description="Add your first institute item on the left." />
        ) : (
          filtered.map((product) => (
            <div key={product.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {product.name} <span className="text-xs text-muted-foreground">({product.sku})</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {product.category} · {formatMoney(product.selling_price)} · stock {product.stock_quantity}
                </p>
              </div>
              {product.stock_quantity === 0 ? (
                <Badge variant="destructive">Out</Badge>
              ) : product.stock_quantity <= product.low_stock_threshold ? (
                <Badge variant="secondary">Low</Badge>
              ) : null}
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Edit ${product.name}`}
                onClick={() => {
                  setEditingId(product.id);
                  setForm({
                    name: product.name,
                    sku: product.sku,
                    category: product.category,
                    description: product.description,
                    purchase_price: Number(product.purchase_price),
                    selling_price: Number(product.selling_price),
                    stock_quantity: product.stock_quantity,
                    low_stock_threshold: product.low_stock_threshold,
                    is_active: product.is_active,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Delete ${product.name}`}
                onClick={() => {
                  if (window.confirm(`Delete "${product.name}"?`)) remove.mutate(product.id);
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Stock ------------------------------- */

const MOVEMENTS: { value: MovementType; label: string }[] = [
  { value: "restock", label: "Restock (add)" },
  { value: "opening", label: "Opening stock (add)" },
  { value: "adjustment", label: "Adjustment (+/-)" },
  { value: "damage", label: "Damage (remove)" },
  { value: "loss", label: "Loss (remove)" },
];

export function StockTab() {
  const { data: products } = useProducts();
  const [productId, setProductId] = useState("");
  const [type, setType] = useState<MovementType>("restock");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const adjust = useAdjustStock();
  const { data: movements, isLoading } = useStockMovements(productId || undefined);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!productId) {
            toast.error("Select an item");
            return;
          }
          adjust.mutate({ productId, type, quantity, reason }, { onSuccess: () => setReason("") });
        }}
      >
        <h3 className="font-display text-base font-semibold">Update stock</h3>
        <Field label="Item">
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select an item</option>
            {(products ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.stock_quantity} in stock
              </option>
            ))}
          </select>
        </Field>
        <Field label="Movement type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MovementType)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {MOVEMENTS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Quantity">
          <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </Field>
        <Field label="Reason / note">
          <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="New purchase from supplier" />
        </Field>
        <Button type="submit" className="w-full" disabled={adjust.isPending}>
          {adjust.isPending ? "Updating..." : "Update stock"}
        </Button>
      </form>

      <div className="space-y-3">
        <h3 className="font-display text-base font-semibold">Stock history</h3>
        {isLoading ? (
          <ListSkeleton />
        ) : (movements?.length ?? 0) === 0 ? (
          <EmptyState title="No stock movements yet" />
        ) : (
          movements?.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-medium">{m.product_name}</p>
                <span className={m.quantity < 0 ? "font-semibold text-destructive" : "font-semibold text-primary"}>
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {m.movement_type} · balance {m.balance_after} · {formatDate(m.created_at)}
                {m.reason ? ` · ${m.reason}` : ""}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------ New sale ------------------------------ */

export function NewSaleTab() {
  const { data: products } = useProducts();
  const { data: methods } = usePaymentMethods();
  const createSale = useCreateSale();
  const [lines, setLines] = useState<NewSaleLine[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");

  const byId = useMemo(() => new Map((products ?? []).map((p) => [p.id, p])), [products]);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unit_price, 0);
  const total = Math.max(0, subtotal - discount);

  const addLine = (product: Product) => {
    setLines((prev) => {
      const existing = prev.find((line) => line.product_id === product.id);
      if (existing)
        return prev.map((line) =>
          line.product_id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      return [...prev, { product_id: product.id, quantity: 1, unit_price: Number(product.selling_price) }];
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-3">
        <h3 className="font-display text-base font-semibold">Choose items</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {(products ?? [])
            .filter((p) => p.is_active)
            .map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addLine(product)}
                disabled={product.stock_quantity === 0}
                className="rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary disabled:opacity-50"
              >
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatMoney(product.selling_price)} · {product.stock_quantity} left
                </p>
              </button>
            ))}
        </div>
      </div>

      <form
        className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          createSale.mutate(
            {
              items: lines,
              discount,
              paymentMethod,
              customerName,
              note,
              clientToken: crypto.randomUUID(),
            },
            {
              onSuccess: () => {
                setLines([]);
                setDiscount(0);
                setCustomerName("");
                setNote("");
              },
            },
          );
        }}
      >
        <h3 className="font-display text-base font-semibold">Sale summary</h3>
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items selected yet.</p>
        ) : (
          <div className="space-y-2">
            {lines.map((line) => {
              const product = byId.get(line.product_id);
              return (
                <div key={line.product_id} className="flex items-center gap-2 rounded-xl border border-border p-2">
                  <span className="min-w-0 flex-1 truncate text-sm">{product?.name ?? "Item"}</span>
                  <Input
                    className="w-16"
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) =>
                      setLines((prev) =>
                        prev.map((l) =>
                          l.product_id === line.product_id ? { ...l, quantity: Number(e.target.value) } : l,
                        ),
                      )
                    }
                  />
                  <Input
                    className="w-24"
                    type="number"
                    step="0.01"
                    value={line.unit_price}
                    onChange={(e) =>
                      setLines((prev) =>
                        prev.map((l) =>
                          l.product_id === line.product_id ? { ...l, unit_price: Number(e.target.value) } : l,
                        ),
                      )
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Remove line"
                    onClick={() => setLines((prev) => prev.filter((l) => l.product_id !== line.product_id))}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name">
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </Field>
          <Field label="Payment method">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {(methods ?? []).map((m) => (
                <option key={m.id} value={m.code}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Discount">
          <Input type="number" step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
        </Field>
        <Field label="Note">
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        <div className="rounded-xl bg-muted p-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatMoney(discount)}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={createSale.isPending || lines.length === 0}>
          {createSale.isPending ? "Recording..." : "Record sale"}
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------- Sales ------------------------------- */

const PRESETS: { value: SalePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom range" },
];

export function SalesTab() {
  const [preset, setPreset] = useState<SalePreset>("month");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { data: methods } = usePaymentMethods();
  const { data: sales, isLoading } = useSales({ preset, from, to, paymentMethod });
  const processReturn = useProcessReturn();
  const deleteSale = useDeleteSale();

  const [openId, setOpenId] = useState<string | null>(null);
  const [returnQty, setReturnQty] = useState<Record<string, number>>({});

  const summary = summarizeSales(sales ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Field label="Period">
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as SalePreset)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {preset === "custom" ? (
          <>
            <div className="w-40">
              <Field label="From">
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </Field>
            </div>
            <div className="w-40">
              <Field label="To">
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </Field>
            </div>
          </>
        ) : null}
        <div className="w-44">
          <Field label="Payment method">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All methods</option>
              {(methods ?? []).map((m) => (
                <option key={m.id} value={m.code}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sales" value={String(summary.count)} />
        <StatCard label="Revenue" value={formatMoney(summary.revenue)} />
        <StatCard label="Refunded" value={formatMoney(summary.refunded)} />
        <StatCard label="Net revenue" value={formatMoney(summary.netRevenue)} />
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : (sales?.length ?? 0) === 0 ? (
        <EmptyState title="No sales in this period" />
      ) : (
        <div className="space-y-3">
          {sales?.map((sale) => (
            <div key={sale.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {sale.invoice_no}{" "}
                    <span className="text-xs text-muted-foreground">
                      {sale.customer_name || "Walk-in"} · {formatDate(sale.sale_date)}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.sale_items.length} item(s) · {sale.payment_method}
                  </p>
                </div>
                <Badge variant={sale.status === "completed" ? "secondary" : "outline"}>{sale.status}</Badge>
                <span className="font-semibold">{formatMoney(sale.total)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setOpenId(openId === sale.id ? null : sale.id)}
                >
                  {openId === sale.id ? "Close" : "Details / return"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deleteSale.isPending}
                  aria-label={`Delete sale ${sale.invoice_no}`}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete sale ${sale.invoice_no}? Stock will be returned to inventory. This cannot be undone.`,
                      )
                    ) {
                      deleteSale.mutate(sale.id);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>


              {openId === sale.id ? (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  {sale.sale_items.map((item) => (
                    <div key={item.id} className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate">
                        {item.product_name} × {item.quantity} @ {formatMoney(item.unit_price)}
                        {item.returned_quantity ? ` · returned ${item.returned_quantity}` : ""}
                      </span>
                      <Input
                        className="w-20"
                        type="number"
                        min={0}
                        max={item.quantity - item.returned_quantity}
                        placeholder="Return"
                        value={returnQty[item.id] ?? ""}
                        onChange={(e) =>
                          setReturnQty((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                        }
                      />
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={processReturn.isPending}
                    onClick={() =>
                      processReturn.mutate(
                        {
                          saleId: sale.id,
                          items: sale.sale_items.map((item) => ({
                            sale_item_id: item.id,
                            quantity: returnQty[item.id] ?? 0,
                          })),
                          reason: "Customer return",
                        },
                        { onSuccess: () => setReturnQty({}) },
                      )
                    }
                  >
                    Process return
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-xl font-semibold">{value}</p>
    </div>
  );
}

/* ------------------------------ Reports ------------------------------ */

export function ReportsTab() {
  const [preset, setPreset] = useState<SalePreset>("month");
  const { data: sales } = useSales({ preset });
  const { data: products } = useProducts();

  const summary = summarizeSales(sales ?? []);
  const stock = inventoryTotals(products ?? []);
  const topProducts = productSalesBreakdown(sales ?? []).slice(0, 8);
  const days = dailyBreakdown(sales ?? []).slice(0, 10);
  const months = monthlyBreakdown(sales ?? []).slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="w-40">
        <Field label="Period">
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as SalePreset)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {PRESETS.filter((p) => p.value !== "custom").map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Net revenue" value={formatMoney(summary.netRevenue)} />
        <StatCard label="Items sold" value={String(summary.itemsSold)} />
        <StatCard label="Discounts given" value={formatMoney(summary.discounts)} />
        <StatCard label="Stock value (cost)" value={formatMoney(stock.costValue)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 font-display text-base font-semibold">Best selling items</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            topProducts.map((p) => (
              <div key={p.name} className="flex justify-between border-b border-border py-2 text-sm last:border-0">
                <span className="truncate">{p.name}</span>
                <span className="text-muted-foreground">
                  {p.quantity} · {formatMoney(p.revenue)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 font-display text-base font-semibold">Low / out of stock</h3>
          {stock.out.length === 0 && stock.low.length === 0 ? (
            <p className="text-sm text-muted-foreground">All items are well stocked.</p>
          ) : (
            [...stock.out, ...stock.low].map((p) => (
              <div key={p.id} className="flex justify-between border-b border-border py-2 text-sm last:border-0">
                <span className="truncate">{p.name}</span>
                <span className={p.stock_quantity === 0 ? "text-destructive" : "text-muted-foreground"}>
                  {p.stock_quantity} left
                </span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 font-display text-base font-semibold">Daily sales</h3>
          {days.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            days.map((d) => (
              <div key={d.day} className="flex justify-between border-b border-border py-2 text-sm last:border-0">
                <span>{formatDate(d.day)}</span>
                <span className="text-muted-foreground">
                  {d.count} sales · {d.items} items · {formatMoney(d.revenue)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 font-display text-base font-semibold">Monthly sales</h3>
          {months.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            months.map((m) => (
              <div key={m.month} className="flex justify-between border-b border-border py-2 text-sm last:border-0">
                <span>{m.month}</span>
                <span className="text-muted-foreground">
                  {m.count} sales · {formatMoney(m.revenue)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
