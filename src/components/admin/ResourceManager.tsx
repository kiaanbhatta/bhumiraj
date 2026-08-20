import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ImageField } from "@/components/admin/ImageField";
import { SmartImage } from "@/components/common/Media";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

type Row = Record<string, unknown>;

export type FieldType = "text" | "textarea" | "number" | "image" | "boolean" | "date" | "datetime" | "list" | "select";

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
  required?: boolean;
};

export type ResourceConfig = {
  table: string;
  title: string;
  queryKey: string;
  orderBy?: { column: string; ascending?: boolean };
  fields: FieldDef[];
  imageKey?: string;
  titleKey: string;
  subtitle?: (row: Row) => string;
  /** derive extra columns on save, e.g. slug from title */
  derive?: (values: Row) => Row;
  folder?: string;
};

function emptyValues(fields: FieldDef[]): Row {
  const out: Row = {};
  for (const f of fields) {
    out[f.name] =
      f.defaultValue ??
      (f.type === "boolean" ? false : f.type === "number" ? 0 : f.type === "list" ? "" : "");
  }
  return out;
}

function toFormValues(fields: FieldDef[], row: Row): Row {
  const out: Row = {};
  for (const f of fields) {
    const v = row[f.name];
    if (f.type === "list") out[f.name] = Array.isArray(v) ? (v as string[]).join("\n") : "";
    else if (f.type === "date" || f.type === "datetime")
      out[f.name] = typeof v === "string" ? v.slice(0, f.type === "date" ? 10 : 16) : "";
    else out[f.name] = v ?? (f.type === "boolean" ? false : "");
  }
  return out;
}

function toPayload(fields: FieldDef[], values: Row): Row {
  const out: Row = {};
  for (const f of fields) {
    const v = values[f.name];
    if (f.type === "list") {
      out[f.name] = String(v ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (f.type === "number") {
      out[f.name] = Number(v ?? 0);
    } else if (f.type === "boolean") {
      out[f.name] = Boolean(v);
    } else if (f.type === "image") {
      out[f.name] = String(v ?? "") || null;
    } else if (f.type === "date" || f.type === "datetime") {
      out[f.name] = v ? new Date(String(v)).toISOString() : null;
    } else {
      out[f.name] = String(v ?? "");
    }
  }
  return out;
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Row>(() => emptyValues(config.fields));
  const [saving, setSaving] = useState(false);

  const listKey = ["admin", config.queryKey];

  const { data, isLoading } = useQuery({
    queryKey: listKey,
    queryFn: async () => {
      const order = config.orderBy ?? { column: "created_at", ascending: false };
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from(config.table as any)
        .select("*")
        .order(order.column, { ascending: order.ascending ?? true });
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: listKey });
    void queryClient.invalidateQueries({ queryKey: [config.queryKey] });
    void queryClient.invalidateQueries();
  };

  const remove = useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase.from(config.table as any).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reset = () => {
    setEditingId(null);
    setValues(emptyValues(config.fields));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let payload = toPayload(config.fields, values);
    if (config.derive) payload = { ...payload, ...config.derive(payload) };

    const required = config.fields.filter((f) => f.required);
    for (const f of required) {
      if (!String(payload[f.name] ?? "").trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }

    setSaving(true);
    const query = editingId
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from(config.table as any).update(payload).eq("id", editingId)
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        supabase.from(config.table as any).insert(payload);
    const { error } = await query;
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editingId ? "Updated" : "Created");
    reset();
    invalidate();
  };

  const setField = (name: string, value: unknown) => setValues((prev) => ({ ...prev, [name]: value }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={handleSubmit} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">
            {editingId ? `Edit ${config.title}` : `Add ${config.title}`}
          </h3>
          {editingId ? (
            <Button type="button" size="sm" variant="ghost" onClick={reset}>
              <X className="mr-1 size-4" /> Cancel
            </Button>
          ) : null}
        </div>

        {config.fields.map((field) => {
          const id = `${config.table}-${field.name}`;
          const value = values[field.name];
          if (field.type === "image") {
            return (
              <ImageField
                key={field.name}
                id={id}
                label={field.label}
                value={String(value ?? "")}
                folder={config.folder ?? config.table}
                onChange={(url) => setField(field.name, url)}
              />
            );
          }
          if (field.type === "boolean") {
            return (
              <div key={field.name} className="flex items-center justify-between gap-3">
                <Label htmlFor={id}>{field.label}</Label>
                <Switch id={id} checked={Boolean(value)} onCheckedChange={(v) => setField(field.name, v)} />
              </div>
            );
          }
          if (field.type === "select") {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={id}>{field.label}</Label>
                <select
                  id={id}
                  value={String(value ?? "")}
                  onChange={(e) => setField(field.name, e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {(field.options ?? []).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          if (field.type === "textarea" || field.type === "list") {
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={id}>{field.label}</Label>
                <Textarea
                  id={id}
                  rows={field.rows ?? 4}
                  placeholder={field.placeholder}
                  value={String(value ?? "")}
                  onChange={(e) => setField(field.name, e.target.value)}
                />
              </div>
            );
          }
          return (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={id}>{field.label}</Label>
              <Input
                id={id}
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "date"
                      ? "date"
                      : field.type === "datetime"
                        ? "datetime-local"
                        : "text"
                }
                placeholder={field.placeholder}
                value={String(value ?? "")}
                onChange={(e) => setField(field.name, e.target.value)}
              />
            </div>
          );
        })}

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : editingId ? "Save changes" : (<><Plus className="mr-2 size-4" />Add {config.title}</>)}
        </Button>
      </form>

      <div>
        {isLoading ? (
          <ListSkeleton />
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState title={`No ${config.title} yet`} />
        ) : (
          <div className="space-y-3">
            {data?.map((row) => {
              const id = String(row.id);
              const label = String(row[config.titleKey] ?? "Untitled");
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  {config.imageKey ? (
                    <SmartImage
                      src={row[config.imageKey] as string | null}
                      alt={label}
                      className="size-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{label}</p>
                    {config.subtitle ? (
                      <p className="truncate text-xs text-muted-foreground">{config.subtitle(row)}</p>
                    ) : null}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${label}`}
                    onClick={() => {
                      setEditingId(id);
                      setValues(toFormValues(config.fields, row));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${label}`}
                    onClick={() => {
                      if (window.confirm(`Delete "${label}"?`)) remove.mutate(id);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
