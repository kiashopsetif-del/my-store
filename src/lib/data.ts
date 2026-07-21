import { db } from "@/db";
import {
  settings,
  categories,
  products,
  features,
  orders,
} from "@/db/schema";
import { eq, desc, asc, and, sql, isNull } from "drizzle-orm";
import type { Settings } from "@/db/schema";

/** إعدادات افتراضية تُستخدم إذا لم توجد صف في قاعدة البيانات */
export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  storeName: "NOIR",
  logoText: "N",
  logoImage: null,
  tagline: "الفخامة بأسلوب جديد",
  accentColor: "#d4af37",
  currency: "ر.س",
  announcementEnabled: true,
  announcementText: "شحن مجاني لكل الطلبات فوق 500 ر.س • إرجاع خلال 14 يوم",
  heroEyebrow: "تشكيلة 2026 الحصرية",
  heroTitle: "أناقة تُلهم\nوتفاصيل تدوم",
  heroSubtitle:
    "اكتشف تشكيلة منتقاة بعناية من القطع الفاخرة التي تجمع بين الحرفية العالية والتصميم الخالد.",
  heroCtaText: "تسوّق الآن",
  heroCtaLink: "/products",
  heroSecondaryCta: "اكتشف الأقسام",
  heroImage: null,
  promoEnabled: true,
  promoBadge: "عرض خاص",
  promoTitle: "خصم يصل إلى 30% على تشكيلة مختارة",
  promoText: "لفترة محدودة، استمتع بأسعار استثنائية على أرقى القطع. الكمية محدودة.",
  promoButton: "تسوّق العرض",
  promoImage: null,
  aboutTitle: "حرفية تُروى بالتفاصيل",
  aboutContent:
    "في NOIR نؤمن أن الفخامة تكمن في التفاصيل. نختار كل قطعة بعناية فائقة من أرقى دور التصنيع حول العالم لنقدّم لك تجربة تسوّق استثنائية تجمع بين الأصالة والحداثة.",
  aboutImage: null,
  featuresTitle: "لماذا تختار NOIR؟",
  featuresSubtitle: "تجربة تسوّق مصمّمة لتليق بك",
  phone: "+966 55 000 0000",
  email: "hello@noir.store",
  address: "الرياض، المملكة العربية السعودية",
  instagram: "https://instagram.com",
  twitter: "https://twitter.com",
  facebook: "https://facebook.com",
  tiktok: "https://tiktok.com",
  whatsapp: "https://wa.me/966550000000",
  facebookPixel: null,
  tiktokPixel: null,
  googleSheetUrl: null,
  footerText:
    "وجهتك الأولى للمنتجات الفاخرة. نصنع تجربة تسوّق ترضي ذوقك الرفيع.",
  adminPassword: "admin123",
  updatedAt: new Date(),
};

export async function getSettings(): Promise<Settings> {
  try {
    const rows = await db
      .select()
      .from(settings)
      .where(eq(settings.id, 1))
      .limit(1);
    if (rows[0]) return { ...DEFAULT_SETTINGS, ...rows[0] };
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getCategories(activeOnly = false) {
  const conds = [];
  if (activeOnly) conds.push(eq(categories.active, true));
  const q = db.select().from(categories);
  const rows = conds.length
    ? await q.where(and(...conds)).orderBy(asc(categories.sortOrder), desc(categories.id))
    : await q.orderBy(asc(categories.sortOrder), desc(categories.id));
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProducts(opts: {
  activeOnly?: boolean;
  featured?: boolean;
  categoryId?: number;
  limit?: number;
} = {}) {
  const conds = [];
  if (opts.activeOnly) conds.push(eq(products.active, true));
  if (opts.featured) conds.push(eq(products.featured, true));
  if (opts.categoryId) conds.push(eq(products.categoryId, opts.categoryId));
  let q = db.select().from(products);
  if (conds.length) q = q.where(and(...conds)) as typeof q;
  q = q.orderBy(desc(products.createdAt)) as typeof q;
  if (opts.limit) q = q.limit(opts.limit) as typeof q;
  return await q;
}

export async function getProductsByCategorySlug(slug: string) {
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { category: null, items: [] };
  const items = await db
    .select()
    .from(products)
    .where(
      and(eq(products.categoryId, cat.id), eq(products.active, true))
    )
    .orderBy(desc(products.createdAt));
  return { category: cat, items };
}

export async function getProductById(id: number) {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getFeatures(activeOnly = false) {
  const conds = [];
  if (activeOnly) conds.push(eq(features.active, true));
  const q = db.select().from(features);
  const rows = conds.length
    ? await q.where(and(...conds)).orderBy(asc(features.sortOrder), desc(features.id))
    : await q.orderBy(asc(features.sortOrder), desc(features.id));
  return rows;
}

export async function getOrders(limit?: number) {
  let q = db.select().from(orders).orderBy(desc(orders.createdAt));
  if (limit) q = q.limit(limit) as typeof q;
  return await q;
}

export async function getDashboardStats() {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  const [orderCount] = await db
    .select({ count: sql<number>`count(*)::int`, revenue: sql<string>`coalesce(sum(${orders.total}),0)` })
    .from(orders);
  const [categoryCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categories);
  const lowStock = await db
    .select()
    .from(products)
    .where(sql`${products.stock} <= 5`)
    .orderBy(asc(products.stock))
    .limit(5);
  const recentOrders = await getOrders(5);
  return {
    products: productCount?.count ?? 0,
    orders: orderCount?.count ?? 0,
    revenue: orderCount?.revenue ?? "0",
    categories: categoryCount?.count ?? 0,
    lowStock,
    recentOrders,
  };
}
