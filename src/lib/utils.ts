/** أدوات مساعدة عامة */
export function cn(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/** تنسيق السعر مع رمز العملة */
export function formatPrice(
  value: string | number | null | undefined,
  currency = "ر.س"
): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return `0 ${currency}`;
  const formatted = n.toLocaleString("en-US", {
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  });
  return `${formatted} ${currency}`;
}

/** تحويل نص إلى slug لاتيني، مع احتياطي عند النصوص العربية */
export function slugify(text: string): string {
  const base = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `item-${Math.random().toString(36).slice(2, 8)}`;
}

/** تحويل لون hex إلى قنوات RGB مفصولة بمسافات (لاستخدامها في CSS) */
export function hexToRgbChannels(hex: string): string {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6 && clean.length !== 3) return "212 175 55";
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return "212 175 55";
  return `${r} ${g} ${b}`;
}

export function toDate(value: Date | string | null | undefined): Date {
  if (!value) return new Date(0);
  return new Date(value);
}
