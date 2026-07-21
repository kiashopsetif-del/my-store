import Link from "next/link";
import { notFound } from "next/navigation";
import { getSettings, getProductById, getProducts, getCategories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/storefront/product-card";
import ProductBuy from "@/components/storefront/product-buy";
import ProductGallery from "@/components/storefront/product-gallery";
import QuickOrder from "@/components/storefront/quick-order";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  const [settings, categories, related] = await Promise.all([
    getSettings(),
    getCategories(true),
    getProducts({ activeOnly: true, categoryId: product.categoryId ?? undefined, limit: 5 }),
  ]);

  const cat = categories.find((c) => c.id === product.categoryId);
  const gallery = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const discount =
    product.compareAtPrice &&
    Number(product.compareAtPrice) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(product.compareAtPrice)) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* مسار التنقل */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-[var(--accent)]">الرئيسية</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[var(--accent)]">المنتجات</Link>
        {cat && (
          <>
            <span>/</span>
            <Link href={`/category/${cat.slug}`} className="hover:text-[var(--accent)]">
              {cat.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* المعرض المتحرك */}
        <ProductGallery images={gallery} discount={discount} />

        {/* التفاصيل + نموذج الطلب السريع */}
        <div className="space-y-6">
          {/* معلومات المنتج */}
          <div>
            {cat && (
              <Link
                href={`/category/${cat.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]"
              >
                {cat.name}
              </Link>
            )}
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1 text-[var(--accent)]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill={i <= Math.round(Number(product.rating) || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.7 21.2 7 14.2 2 9.4l7-.9z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-zinc-400">{product.rating} / 5</span>
            </div>

            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-[var(--accent)]">
                {formatPrice(product.price, settings.currency)}
              </span>
              {product.compareAtPrice &&
                Number(product.compareAtPrice) > Number(product.price) && (
                  <span className="mb-1 text-lg text-zinc-600 line-through">
                    {formatPrice(product.compareAtPrice, settings.currency)}
                  </span>
                )}
            </div>

            {product.description && (
              <p className="mt-5 leading-relaxed text-zinc-300">{product.description}</p>
            )}
          </div>

          {/* مزايا سريعة */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🚚", t: "شحن سريع" },
              { icon: "↩", t: "إرجاع 14 يوم" },
              { icon: "🔒", t: "دفع آمن" },
            ].map((b) => (
              <div key={b.t} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-center">
                <div className="text-xl">{b.icon}</div>
                <div className="mt-1 text-xs text-zinc-400">{b.t}</div>
              </div>
            ))}
          </div>

          {/* كارت طلب سريع */}
          <QuickOrder product={product} currency={settings.currency} />
        </div>
      </div>

      {/* منتجات ذات صلة */}
      {related.filter((p) => p.id !== product.id).length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl font-bold text-white">منتجات ذات صلة</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {related
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} currency={settings.currency} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
