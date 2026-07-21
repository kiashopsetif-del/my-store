"use server";

import { db } from "@/db";
import {
  settings,
  categories,
  products,
  features,
  orders,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth";
import type { OrderItem } from "@/db/schema";

const revalidateAll = () => revalidatePath("/", "layout");
const toBool = (v: FormDataEntryValue | null) =>
  v === "on" || v === "true" || v === "1";
const num = (v: FormDataEntryValue | null, fallback = "0") => {
  const n = Number((v as string) ?? "");
  return Number.isFinite(n) ? String(n) : fallback;
};

/* ============================= المصادقة ============================= */
export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const row = await db
    .select()
    .from(settings)
    .where(eq(settings.id, 1))
    .limit(1);
  const correct = row[0]?.adminPassword ?? "admin123";
  if (password && password === correct) {
    const store = await cookies();
    store.set(ADMIN_COOKIE, "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ============================= الإعدادات ============================= */
export async function saveSettings(formData: FormData) {
  const data = {
    storeName: String(formData.get("storeName") ?? "NOIR"),
    logoText: String(formData.get("logoText") ?? "N"),
    logoImage: String(formData.get("logoImage") ?? "") || null,
    tagline: String(formData.get("tagline") ?? ""),
    accentColor: String(formData.get("accentColor") ?? "#d4af37"),
    currency: String(formData.get("currency") ?? "ر.س"),
    announcementEnabled: toBool(formData.get("announcementEnabled")),
    announcementText: String(formData.get("announcementText") ?? ""),
    heroEyebrow: String(formData.get("heroEyebrow") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    heroCtaText: String(formData.get("heroCtaText") ?? ""),
    heroCtaLink: String(formData.get("heroCtaLink") ?? "/products"),
    heroSecondaryCta: String(formData.get("heroSecondaryCta") ?? ""),
    heroImage: String(formData.get("heroImage") ?? "") || null,
    promoEnabled: toBool(formData.get("promoEnabled")),
    promoBadge: String(formData.get("promoBadge") ?? ""),
    promoTitle: String(formData.get("promoTitle") ?? ""),
    promoText: String(formData.get("promoText") ?? ""),
    promoButton: String(formData.get("promoButton") ?? ""),
    promoImage: String(formData.get("promoImage") ?? "") || null,
    aboutTitle: String(formData.get("aboutTitle") ?? ""),
    aboutContent: String(formData.get("aboutContent") ?? ""),
    aboutImage: String(formData.get("aboutImage") ?? "") || null,
    featuresTitle: String(formData.get("featuresTitle") ?? ""),
    featuresSubtitle: String(formData.get("featuresSubtitle") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    instagram: String(formData.get("instagram") ?? ""),
    twitter: String(formData.get("twitter") ?? ""),
    facebook: String(formData.get("facebook") ?? ""),
    tiktok: String(formData.get("tiktok") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? ""),
    footerText: String(formData.get("footerText") ?? ""),
    facebookPixel: String(formData.get("facebookPixel") ?? "") || null,
    tiktokPixel: String(formData.get("tiktokPixel") ?? "") || null,
    googleSheetUrl: String(formData.get("googleSheetUrl") ?? "") || null,
  };
  await db.update(settings).set(data).where(eq(settings.id, 1));
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

export async function changeAdminPassword(formData: FormData) {
  const pwd = String(formData.get("adminPassword") ?? "admin123");
  await db.update(settings).set({ adminPassword: pwd }).where(eq(settings.id, 1));
  revalidateAll();
  redirect("/admin/settings?saved=1");
}

/* ============================= المنتجات ============================= */
function collectImages(formData: FormData): { image: string | null; images: string[] | null } {
  const urls = [
    String(formData.get("image1") ?? "").trim(),
    String(formData.get("image2") ?? "").trim(),
    String(formData.get("image3") ?? "").trim(),
    String(formData.get("image4") ?? "").trim(),
    String(formData.get("image5") ?? "").trim(),
  ].filter(Boolean);
  return {
    image: urls[0] ?? null,
    images: urls.length > 1 ? urls.slice(1) : null,
  };
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/products/new?error=1");
  const { image, images } = collectImages(formData);
  await db.insert(products).values({
    name,
    slug: `p-${Date.now()}`,
    description: String(formData.get("description") ?? ""),
    price: num(formData.get("price"), "0"),
    compareAtPrice: num(formData.get("compareAtPrice"), "0") || null,
    image,
    images,
    categoryId: Number(formData.get("categoryId")) || null,
    stock: Number(formData.get("stock")) || 0,
    rating: num(formData.get("rating"), "4.8"),
    badge: String(formData.get("badge") ?? "") || null,
    featured: toBool(formData.get("featured")),
    active: toBool(formData.get("active")),
  });
  revalidateAll();
  redirect("/admin/products?created=1");
}

export async function updateProduct(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect(`/admin/products/${id}/edit?error=1`);
  const { image, images } = collectImages(formData);
  await db
    .update(products)
    .set({
      name,
      description: String(formData.get("description") ?? ""),
      price: num(formData.get("price"), "0"),
      compareAtPrice: num(formData.get("compareAtPrice"), "0") || null,
      image,
      images,
      categoryId: Number(formData.get("categoryId")) || null,
      stock: Number(formData.get("stock")) || 0,
      rating: num(formData.get("rating"), "4.8"),
      badge: String(formData.get("badge") ?? "") || null,
      featured: toBool(formData.get("featured")),
      active: toBool(formData.get("active")),
    })
    .where(eq(products.id, id));
  revalidateAll();
  redirect("/admin/products?updated=1");
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidateAll();
  redirect("/admin/products?deleted=1");
}

/* ============================= الأقسام ============================= */
export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/categories?error=1");
  const slug =
    String(formData.get("slug") ?? "").trim() || `c-${Date.now()}`;
  await db.insert(categories).values({
    name,
    slug,
    description: String(formData.get("description") ?? ""),
    image: String(formData.get("image") ?? "") || null,
    sortOrder: Number(formData.get("sortOrder")) || 0,
    active: toBool(formData.get("active")),
  });
  revalidateAll();
  redirect("/admin/categories?created=1");
}

export async function updateCategory(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect(`/admin/categories?error=1`);
  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  const slug =
    String(formData.get("slug") ?? "").trim() ||
    existing[0]?.slug ||
    `c-${id}`;
  await db
    .update(categories)
    .set({
      name,
      slug,
      description: String(formData.get("description") ?? ""),
      image: String(formData.get("image") ?? "") || null,
      sortOrder: Number(formData.get("sortOrder")) || 0,
      active: toBool(formData.get("active")),
    })
    .where(eq(categories.id, id));
  revalidateAll();
  redirect("/admin/categories?updated=1");
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidateAll();
  redirect("/admin/categories?deleted=1");
}

/* ============================= المميزات ============================= */
export async function createFeature(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/features?error=1");
  await db.insert(features).values({
    title,
    description: String(formData.get("description") ?? ""),
    icon: String(formData.get("icon") ?? "✦") || "✦",
    sortOrder: Number(formData.get("sortOrder")) || 0,
    active: toBool(formData.get("active")),
  });
  revalidateAll();
  redirect("/admin/features?created=1");
}

export async function updateFeature(id: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/admin/features?error=1");
  await db
    .update(features)
    .set({
      title,
      description: String(formData.get("description") ?? ""),
      icon: String(formData.get("icon") ?? "✦") || "✦",
      sortOrder: Number(formData.get("sortOrder")) || 0,
      active: toBool(formData.get("active")),
    })
    .where(eq(features.id, id));
  revalidateAll();
  redirect("/admin/features?updated=1");
}

export async function deleteFeature(id: number) {
  await db.delete(features).where(eq(features.id, id));
  revalidateAll();
  redirect("/admin/features?deleted=1");
}

/* ============================= الطلبات ============================= */
export async function createOrder(input: {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  items: OrderItem[];
  total: string;
}) {
  const [row] = await db
    .insert(orders)
    .values({
      customerName: input.customerName,
      email: input.email,
      phone: input.phone || null,
      address: input.address || null,
      city: input.city || null,
      notes: input.notes || null,
      items: input.items,
      total: String(input.total),
      status: "pending",
    })
    .returning({ id: orders.id });

  // إرسال إلى Google Sheets
  try {
    const settingsRow = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    const sheetUrl = settingsRow[0]?.googleSheetUrl;
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: row?.id,
          customerName: input.customerName,
          email: input.email,
          phone: input.phone,
          address: input.address,
          city: input.city,
          total: input.total,
          items: input.items.map((i) => `${i.name} x${i.qty}`).join(", "),
          notes: input.notes,
          date: new Date().toISOString(),
        }),
      });
    }
  } catch {
    // لا نريد إيقاف الطلب إذا فشل الإرسال إلى Sheets
  }

  revalidatePath("/admin", "layout");
  return { ok: true, id: row?.id ?? null };
}

export async function updateOrderStatus(id: number, formData: FormData) {
  const status = String(formData.get("status") ?? "pending");
  await db.update(orders).set({ status }).where(eq(orders.id, id));
  revalidateAll();
  redirect("/admin/orders?updated=1");
}
