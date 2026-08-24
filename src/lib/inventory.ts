import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Sale = Tables<"sales">;
export type SaleItem = Tables<"sale_items">;
export type SaleReturn = Tables<"sale_returns">;
export type StockMovement = Tables<"stock_movements">;
export type PaymentMethod = Tables<"payment_methods">;

export type MovementType = "opening" | "restock" | "adjustment" | "damage" | "loss";

export const INVENTORY_KEYS = {
  products: ["admin", "products"] as const,
  sales: ["admin", "sales"] as const,
  movements: ["admin", "stock_movements"] as const,
  paymentMethods: ["payment_methods"] as const,
};

export function formatMoney(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function round2(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

/** Local-day boundaries as ISO strings, used for all date filtering. */
export function dayRange(from: Date, to: Date): { start: string; end: string } {
  const start = new Date(from);
  start.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export type SalePreset = "today" | "yesterday" | "week" | "month" | "all" | "custom";

export function presetRange(preset: SalePreset, customFrom?: string, customTo?: string) {
  const now = new Date();
  switch (preset) {
    case "today":
      return dayRange(now, now);
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      return dayRange(y, y);
    }
    case "week": {
      const start = new Date(now);
      const day = (start.getDay() + 6) % 7; // Monday start
      start.setDate(start.getDate() - day);
      return dayRange(start, now);
    }
    case "month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return dayRange(start, now);
    }
    case "custom": {
      if (!customFrom || !customTo) return null;
      return dayRange(new Date(customFrom), new Date(customTo));
    }
    default:
      return null;
  }
}

export function useProducts() {
  return useQuery({
    queryKey: INVENTORY_KEYS.products,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw new Error(error.message);
      return data as Product[];
    },
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: INVENTORY_KEYS.paymentMethods,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("sort_order");
      if (error) throw new Error(error.message);
      return data as PaymentMethod[];
    },
  });
}

export type SaleWithItems = Sale & { sale_items: SaleItem[] };

export function useSales(filters: {
  preset: SalePreset;
  from?: string;
  to?: string;
  paymentMethod?: string;
  productId?: string;
}) {
  const range = presetRange(filters.preset, filters.from, filters.to);
  return useQuery({
    queryKey: [...INVENTORY_KEYS.sales, filters.preset, filters.from ?? "", filters.to ?? "", filters.paymentMethod ?? "", filters.productId ?? ""],
    queryFn: async () => {
      let query = supabase
        .from("sales")
        .select("*, sale_items(*)")
        .order("sale_date", { ascending: false })
        .limit(500);
      if (range) query = query.gte("sale_date", range.start).lte("sale_date", range.end);
      if (filters.paymentMethod) query = query.eq("payment_method", filters.paymentMethod);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      let rows = (data ?? []) as SaleWithItems[];
      if (filters.productId) {
        rows = rows.filter((sale) => sale.sale_items.some((item) => item.product_id === filters.productId));
      }
      return rows;
    },
  });
}

export function useStockMovements(productId?: string) {
  return useQuery({
    queryKey: [...INVENTORY_KEYS.movements, productId ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("stock_movements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (productId) query = query.eq("product_id", productId);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as StockMovement[];
    },
  });
}

export function useReturns() {
  return useQuery({
    queryKey: ["admin", "sale_returns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sale_returns")
        .select("*, sale_return_items(*), sales(invoice_no)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return (data ?? []) as (SaleReturn & {
        sale_return_items: Tables<"sale_return_items">[];
        sales: { invoice_no: string } | null;
      })[];
    },
  });
}

function useInvalidateInventory() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.products });
    void queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.sales });
    void queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.movements });
    void queryClient.invalidateQueries({ queryKey: ["admin", "sale_returns"] });
  };
}

export type ProductInput = {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
};

export function useSaveProduct() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const payload = {
        name: input.name.trim(),
        sku: input.sku.trim(),
        category: input.category.trim() || "General",
        description: input.description.trim(),
        purchase_price: round2(input.purchase_price),
        selling_price: round2(input.selling_price),
        low_stock_threshold: Math.max(0, Math.trunc(input.low_stock_threshold)),
        is_active: input.is_active,
      };
      if (!payload.name) throw new Error("Item name is required");
      if (!payload.sku) throw new Error("Item code (SKU) is required");
      if (payload.purchase_price < 0 || payload.selling_price < 0) throw new Error("Prices cannot be negative");

      if (input.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", input.id);
        if (error) throw new Error(error.message);
        return input.id;
      }

      const opening = Math.max(0, Math.trunc(input.stock_quantity));
      const { data, error } = await supabase
        .from("products")
        .insert({ ...payload, stock_quantity: opening })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      if (opening > 0) {
        await supabase.rpc("adjust_stock", {
          _product_id: data.id,
          _movement_type: "adjustment",
          _quantity: 0,
          _reason: "Opening stock recorded",
        });
      }
      return data.id;
    },
    onSuccess: () => {
      toast.success("Item saved");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Item deleted — past sales records are kept");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAdjustStock() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (input: { productId: string; type: MovementType; quantity: number; reason: string }) => {
      const quantity = Math.trunc(input.quantity);
      if (!quantity) throw new Error("Enter a quantity");
      const { error } = await supabase.rpc("adjust_stock", {
        _product_id: input.productId,
        _movement_type: input.type,
        _quantity: quantity,
        _reason: input.reason,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Stock updated");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export type NewSaleLine = { product_id: string; quantity: number; unit_price: number };

export function useCreateSale() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (input: {
      items: NewSaleLine[];
      discount: number;
      paymentMethod: string;
      customerName: string;
      note: string;
      clientToken: string;
    }) => {
      if (input.items.length === 0) throw new Error("Add at least one item to the sale");
      const { data, error } = await supabase.rpc("create_sale", {
        _items: input.items.map((line) => ({
          product_id: line.product_id,
          quantity: Math.trunc(line.quantity),
          unit_price: round2(line.unit_price),
        })),
        _discount: round2(input.discount),
        _payment_method: input.paymentMethod,
        _customer_name: input.customerName,
        _note: input.note,
        _client_token: input.clientToken,
      });
      if (error) throw new Error(error.message);
      return data as string;
    },
    onSuccess: () => {
      toast.success("Sale recorded and stock updated");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useProcessReturn() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (input: {
      saleId: string;
      items: { sale_item_id: string; quantity: number }[];
      reason: string;
    }) => {
      const items = input.items.filter((item) => item.quantity > 0);
      if (items.length === 0) throw new Error("Enter at least one quantity to return");
      const { error } = await supabase.rpc("process_sale_return", {
        _sale_id: input.saleId,
        _items: items,
        _reason: input.reason,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Return processed and stock restored");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteSale() {
  const invalidate = useInvalidateInventory();
  return useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await supabase.rpc("delete_sale", { _sale_id: saleId });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Sale deleted and stock restored");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });
}


/** Aggregates computed from real sale rows. */
export function summarizeSales(sales: SaleWithItems[]) {
  let revenue = 0;
  let discounts = 0;
  let refunded = 0;
  let itemsSold = 0;
  for (const sale of sales) {
    revenue += Number(sale.total);
    discounts += Number(sale.discount);
    refunded += Number(sale.refunded_total);
    for (const item of sale.sale_items) itemsSold += item.quantity - item.returned_quantity;
  }
  return {
    count: sales.length,
    revenue: round2(revenue),
    discounts: round2(discounts),
    refunded: round2(refunded),
    netRevenue: round2(revenue - refunded),
    itemsSold,
  };
}

export function productSalesBreakdown(sales: SaleWithItems[]) {
  const map = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const sale of sales) {
    for (const item of sale.sale_items) {
      const key = item.product_id ?? item.product_name;
      const netQty = item.quantity - item.returned_quantity;
      const entry = map.get(key) ?? { name: item.product_name, quantity: 0, revenue: 0 };
      entry.quantity += netQty;
      entry.revenue = round2(entry.revenue + netQty * Number(item.unit_price));
      map.set(key, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.quantity - a.quantity);
}

export function monthlyBreakdown(sales: SaleWithItems[]) {
  const map = new Map<string, { month: string; count: number; revenue: number }>();
  for (const sale of sales) {
    const date = new Date(sale.sale_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const entry = map.get(key) ?? { month: key, count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue = round2(entry.revenue + Number(sale.total) - Number(sale.refunded_total));
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => (a.month < b.month ? 1 : -1));
}

export function dailyBreakdown(sales: SaleWithItems[]) {
  const map = new Map<string, { day: string; count: number; revenue: number; items: number }>();
  for (const sale of sales) {
    const key = new Date(sale.sale_date).toISOString().slice(0, 10);
    const entry = map.get(key) ?? { day: key, count: 0, revenue: 0, items: 0 };
    entry.count += 1;
    entry.revenue = round2(entry.revenue + Number(sale.total) - Number(sale.refunded_total));
    for (const item of sale.sale_items) entry.items += item.quantity - item.returned_quantity;
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => (a.day < b.day ? 1 : -1));
}

export function inventoryTotals(products: Product[]) {
  let quantity = 0;
  let costValue = 0;
  let saleValue = 0;
  const low: Product[] = [];
  const out: Product[] = [];
  for (const product of products) {
    quantity += product.stock_quantity;
    costValue = round2(costValue + product.stock_quantity * Number(product.purchase_price));
    saleValue = round2(saleValue + product.stock_quantity * Number(product.selling_price));
    if (product.stock_quantity === 0) out.push(product);
    else if (product.stock_quantity <= product.low_stock_threshold) low.push(product);
  }
  return { quantity, costValue, saleValue, low, out, total: products.length };
}
