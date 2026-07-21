import Link from "next/link";
import {
  getSettings,
  getCategories,
  getProducts,
  getFeatures,
} from "@/lib/data";
import ProductCard from "@/components/storefront/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, categories, featured, features] = await Promise.all([
    getSettings(),
    getCategories(true),
    getProducts({ activeOnly: true, featured: true, limit: 8 }),
    getFeatures(true),
  ]);

  const heroImage = settings.heroImage || "/images/hero.jpg";
  const titleLines = (settings.heroTitle ?? "أهلاً بك").split("\n");
  const latest = await getProducts({ activeOnly: true, limit: 4 });

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
          <div className="max-w-2xl animate-fade-up">
            {settings.heroEyebrow && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {settings.heroEyebrow}
              </div>
            )}
            <h1 className="font-display text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
              {titleLines.map((line, i) => (
                <span key={i} className="block">
                  {i === titleLines.length - 1 ? (
                    <span className="gold-text">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>
            {settings.heroSubtitle && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                {settings.heroSubtitle}
              </p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={settings.heroCtaLink || "/products"}
                className="rounded-2xl bg-[var(--accent)] px-8 py-4 text-sm font-bold text-black transition hover:opacity-90"
              >
                {settings.heroCtaText || "تسوّق الآن"}
              </Link>
              <Link
                href="/products"
                className="rounded-2xl border border-white/20 px-8 py-4 text-sm font-bold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {settings.heroSecondaryCta || "اكتشف المزيد"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== الفئات ===================== */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                تسوّق حسب الفئة
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                أقسام مختارة بعناية
              </h2>
            </div>
            <Link href="/products" className="hidden text-sm text-zinc-400 hover:text-[var(--accent)] sm:block">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-white/5 text-4xl">✦</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-bold text-white">{c.name}</h3>
                  <span className="mt-1 inline-block text-xs text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                    تسوّق الآن ←
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===================== المنتجات المميزة ===================== */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              الأكثر تميّزاً
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              منتجات مختارة بعناية
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} currency={settings.currency} />
            ))}
          </div>
        </section>
      )}

      {/* ===================== برومو ===================== */}
      {settings.promoEnabled && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--accent)]/20 bg-gradient-to-l from-[#1a1505] to-[#0b0b0c]">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="p-8 sm:p-12">
                <span className="inline-block rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-black">
                  {settings.promoBadge || "عرض خاص"}
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  {settings.promoTitle}
                </h2>
                <p className="mt-3 text-zinc-300">{settings.promoText}</p>
                <Link
                  href="/products"
                  className="mt-6 inline-block rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-black transition hover:bg-[var(--accent)]"
                >
                  {settings.promoButton || "تسوّق العرض"}
                </Link>
              </div>
              {settings.promoImage && (
                <div className="relative h-64 md:h-full">
                  <img
                    src={settings.promoImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] to-transparent md:bg-gradient-to-l" />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================== المميزات ===================== */}
      {features.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {settings.featuresSubtitle}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {settings.featuresTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.id}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 text-center transition hover:border-[var(--accent)]/40"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--accent)]/10 text-2xl text-[var(--accent)]">
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white">{f.title}</h3>
                {f.description && (
                  <p className="mt-2 text-sm text-zinc-400">{f.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== عن المتجر ===================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10">
            {settings.aboutImage ? (
              <img src={settings.aboutImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-white/5 text-6xl">✦</div>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              قصتنا
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {settings.aboutTitle}
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-300">{settings.aboutContent}</p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-2xl border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              اقرأ المزيد
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== وصل حديثاً ===================== */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-3xl font-bold text-white">وصل حديثاً</h2>
            <Link href="/products" className="text-sm text-zinc-400 hover:text-[var(--accent)]">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} currency={settings.currency} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
