"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";

function Stars({ rating }: { rating: string }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5 text-[var(--accent)]">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-3.5 w-3.5" fill={i <= Math.round(r) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.7 21.2 7 14.2 2 9.4l7-.9z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const onAdd = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price)
      ? Math.round(
          (1 - Number(product.price) / Number(product.compareAtPrice)) * 100
        )
      : 0;

  return (
    <div className="group card-hover relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0f]">
      {/* الصورة */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-white/5 text-4xl text-zinc-700">
            🖼️
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

        {/* الشارات */}
        <div className="absolute right-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-black">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* التفاصيل */}
      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <Stars rating={product.rating ?? "0"} />
          {Number(product.stock) <= 0 ? (
            <span className="text-[10px] text-red-400">نفد المخزون</span>
          ) : Number(product.stock) <= 5 ? (
            <span className="text-[10px] text-amber-400">كمية محدودة</span>
          ) : null}
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-1 text-[15px] font-semibold text-white transition group-hover:text-[var(--accent)]">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
            {product.description}
          </p>
        )}

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-xs text-zinc-600 line-through">
                {formatPrice(product.compareAtPrice, currency)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-[var(--accent)]">
              {formatPrice(product.price, currency)}
            </span>
          </div>
          <button
            onClick={onAdd}
            disabled={Number(product.stock) <= 0}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
              added
                ? "border-green-400 bg-green-400 text-black"
                : "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="أضف إلى السلة"
          >
            {added ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
