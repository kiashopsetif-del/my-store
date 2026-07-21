import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  json,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  إعدادات المتجر — صف واحد (id = 1) يتحكم في كل أقسام الواجهة        */
/* ------------------------------------------------------------------ */
export const settings = pgTable("settings", {
  id: integer("id").primaryKey(),
  // الهوية
  storeName: text("store_name").notNull().default("NOIR"),
  logoText: text("logo_text").notNull().default("N"),
  logoImage: text("logo_image"),
  tagline: text("tagline").default("الفخامة بأسلوب جديد"),
  accentColor: text("accent_color").notNull().default("#d4af37"),
  currency: text("currency").notNull().default("ر.س"),
  // الشريط الإعلاني العلوي
  announcementEnabled: boolean("announcement_enabled").default(true),
  announcementText: text("announcement_text").default(
    "شحن مجاني لكل الطلبات فوق 500 ر.س • إرجاع خلال 14 يوم"
  ),
  // القسم الرئيسي (Hero)
  heroEyebrow: text("hero_eyebrow").default("تشكيلة 2026 الحصرية"),
  heroTitle: text("hero_title").default("أناقة تُلهم\nوتفاصيل تدوم"),
  heroSubtitle: text("hero_subtitle").default(
    "اكتشف تشكيلة منتقاة بعناية من القطع الفاخرة التي تجمع بين الحرفية العالية والتصميم الخالد."
  ),
  heroCtaText: text("hero_cta_text").default("تسوّق الآن"),
  heroCtaLink: text("hero_cta_link").default("/products"),
  heroSecondaryCta: text("hero_secondary_cta").default("اكتشف الأقسام"),
  heroImage: text("hero_image"),
  // قسم العرض الترويجي (Promo)
  promoEnabled: boolean("promo_enabled").default(true),
  promoBadge: text("promo_badge").default("عرض خاص"),
  promoTitle: text("promo_title").default("خصم يصل إلى 30% على تشكيلة مختارة"),
  promoText: text("promo_text").default(
    "لفترة محدودة، استمتع بأسعار استثنائية على أرقى القطع. الكمية محدودة."
  ),
  promoButton: text("promo_button").default("تسوّق العرض"),
  promoImage: text("promo_image"),
  // من نحن
  aboutTitle: text("about_title").default("حرفية تُروى بالتفاصيل"),
  aboutContent: text("about_content").default(
    "في NOIR نؤمن أن الفخامة تكمن في التفاصيل. نختار كل قطعة بعناية فائقة من أرقى دور التصنيع حول العالم لنقدّم لك تجربة تسوّق استثنائية تجمع بين الأصالة والحداثة."
  ),
  aboutImage: text("about_image"),
  // عنوان قسم المميزات
  featuresTitle: text("features_title").default("لماذا تختار NOIR؟"),
  featuresSubtitle: text("features_subtitle").default(
    "تجربة تسوّق مصمّمة لتليق بك"
  ),
  // التواصل
  phone: text("phone").default("+966 55 000 0000"),
  email: text("email").default("hello@noir.store"),
  address: text("address").default("الرياض، المملكة العربية السعودية"),
  instagram: text("instagram").default("https://instagram.com"),
  twitter: text("twitter").default("https://twitter.com"),
  facebook: text("facebook").default("https://facebook.com"),
  tiktok: text("tiktok").default("https://tiktok.com"),
  whatsapp: text("whatsapp").default("https://wa.me/966550000000"),
  // بيكسلات التتبع
  facebookPixel: text("facebook_pixel"),
  tiktokPixel: text("tiktok_pixel"),
  googleSheetUrl: text("google_sheet_url"),
  // التذييل
  footerText: text("footer_text").default(
    "وجهتك الأولى للمنتجات الفاخرة. نصنع تجربة تسوّق ترضي ذوقك الرفيع."
  ),
  // الأمان
  adminPassword: text("admin_password").notNull().default("admin123"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/* ------------------------------------------------------------------ */
/*  الأقسام                                                            */
/* ------------------------------------------------------------------ */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  المنتجات                                                           */
/* ------------------------------------------------------------------ */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
  image: text("image"),
  images: json("images").$type<string[]>(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  stock: integer("stock").default(0),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("4.8"),
  badge: text("badge"),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  بطاقات المميزات (قابل للتعديل من اللوحة)                           */
/* ------------------------------------------------------------------ */
export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").default("✦"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
});

/* ------------------------------------------------------------------ */
/*  الطلبات                                                            */
/* ------------------------------------------------------------------ */
export const orderItemsType: { productId: number; name: string; price: string; qty: number; image: string | null } = {
  productId: 0,
  name: "",
  price: "0",
  qty: 0,
  image: null,
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  notes: text("notes"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  items: json("items").$type<
    { productId: number; name: string; price: string; qty: number; image: string | null }[]
  >(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Settings = typeof settings.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Feature = typeof features.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = {
  productId: number;
  name: string;
  price: string;
  qty: number;
  image: string | null;
};
