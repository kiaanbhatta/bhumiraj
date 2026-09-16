import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatFee } from "@/lib/format";
import type { PhotoFrame } from "@/lib/queries";

type Props = { frame: PhotoFrame; className?: string };

export function FrameOrderDialog({ frame, className }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  const total = Number(frame.price ?? 0) * Math.max(1, quantity);
  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.customer_name.trim()) return toast.error("Please enter your name");
    if (!form.phone.trim()) return toast.error("Please enter your phone number");
    if (!form.address.trim()) return toast.error("Please enter your delivery address");

    setSaving(true);
    const { error } = await supabase.from("frame_orders").insert({
      frame_id: frame.id,
      frame_name: frame.name,
      frame_size: frame.size ?? "",
      unit_price: Number(frame.price ?? 0),
      quantity: Math.max(1, quantity),
      total_price: total,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      note: form.note.trim(),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order placed! We will contact you soon.");
    setForm({ customer_name: "", phone: "", email: "", address: "", note: "" });
    setQuantity(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} size="sm">
          Order this frame
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order {frame.name}</DialogTitle>
          <DialogDescription>
            {frame.size ? `${frame.size} · ` : ""}
            {formatFee(frame.price)} per frame
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frame-qty">Quantity</Label>
            <Input
              id="frame-qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frame-name">Your name</Label>
            <Input id="frame-name" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frame-phone">Phone</Label>
            <Input id="frame-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frame-email">Email (optional)</Label>
            <Input id="frame-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frame-address">Delivery address</Label>
            <Textarea id="frame-address" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frame-note">Note (optional)</Label>
            <Textarea id="frame-note" rows={2} value={form.note} onChange={(e) => set("note", e.target.value)} />
          </div>
          <p className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold">Total: {formatFee(total)}</p>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Placing order..." : "Place order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
