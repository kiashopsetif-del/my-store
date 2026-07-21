import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, getProductsByCategorySlug } from "@/lib/data";
import ProductCard from "@/components/storefront/product-card";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const settings = await getSettings();
  const { category, items } = await getProductsByCategorySlug(slug);
  if (!category) notFound();

  return (
    <div>
      <div className="relative overflow-hidden border-b border-white/10">
        {category.image && (
          <div className="absolute inset-0">
            <img src={category.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/70" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            القسم
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-xl mx-auto text-zinc-300">{category.description}</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] py-24 text-center text-zinc-400">
            لا توجد منتجات في هذا القسم حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} currency={settings.currency} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/products" className="text-sm text-zinc-400 hover:text-[var(--accent)]">
            ← العودة لكل المنتجات
          </Link>
        </div>
      </div>
    </div>
  );
}
