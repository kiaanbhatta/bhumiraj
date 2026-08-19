export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatFee(fee: number | null | undefined): string {
  if (fee === null || fee === undefined) return "—";
  if (fee === 0) return "Free";
  return `Rs. ${Number(fee).toLocaleString("en-IN")}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function levelFromXp(xp: number): { level: number; current: number; needed: number } {
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const current = xp % 500;
  return { level, current, needed: 500 };
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
