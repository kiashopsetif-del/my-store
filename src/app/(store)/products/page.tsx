import Link from "next/link";
import { getSettings, getCategories, getProducts } from "@/lib/data";
import ProductCard from "@/components/storefront/product-card";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(true),
  ]);

  const activeCat = sp.category
    ? categories.find((c) => c.slug === sp.category)
    : null;

  const products = activeCat
    ? await getProducts({ activeOnly: true, categoryId: activeCat.id })
    : await getProducts({ activeOnly: true });

  return (
    <div>
      {/* رأس الصفحة */}
      <div className="border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            المتجر
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {activeCat ? activeCat.name : "كل المنتجات"}
          </h1>
          <p className="mt-3 text-zinc-400">
            {activeCat?.description || "اكتشف تشكيلتنا الكاملة من القطع الفاخرة المنتقاة"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* فلترة الأقسام */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className={`rounded-full border px-4 py-2 text-sm transition ${
              !activeCat
                ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                : "border-white/15 text-zinc-300 hover:border-[var(--accent)]/50"
            }`}
          >
            الكل
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeCat?.id === c.id
                  ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                  : "border-white/15 text-zinc-300 hover:border-[var(--accent)]/50"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] py-24 text-center">
            <div className="mb-3 text-5xl">🔍</div>
            <p className="text-zinc-400">لا توجد منتجات في هذا القسم حالياً</p>
            <Link href="/products" className="mt-4 inline-block text-[var(--accent)]">
              عرض كل المنتجات ←
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} currency={settings.currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
