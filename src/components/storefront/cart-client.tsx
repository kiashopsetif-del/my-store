"use client";

import Link from "next/link";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";

export default function CartClient({ currency }: { currency: string }) {
  const { items, increment, decrement, removeItem, subtotal, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mb-4 text-6xl">🛍️</div>
        <h1 className="font-display text-3xl font-bold text-white">سلتك فارغة</h1>
        <p className="mt-2 text-zinc-400">لم تقم بإضافة أي منتجات بعد</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-2xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-black"
        >
          ابدأ التسوّق
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white">سلة التسوّق</h1>
        <button
          onClick={clear}
          className="text-sm text-zinc-500 hover:text-red-400"
        >
          تفريغ السلة
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* العناصر */}
        <div className="space-y-3 lg:col-span-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <img
                src={it.image ?? ""}
                alt={it.name}
                className="h-24 w-24 shrink-0 rounded-xl bg-white/5 object-cover"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${it.id}`}
                    className="font-medium text-white hover:text-[var(--accent)]"
                  >
                    {it.name}
                  </Link>
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <p className="text-sm text-[var(--accent)]">
                  {formatPrice(it.price, currency)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 p-1">
                    <button onClick={() => decrement(it.id)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-300 hover:bg-white/5">−</button>
                    <span className="w-6 text-center text-white">{it.qty}</span>
                    <button onClick={() => increment(it.id)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-300 hover:bg-white/5">+</button>
                  </div>
                  <span className="font-semibold text-white">
                    {formatPrice(Number(it.price) * it.qty, currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* الملخص */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-lg font-bold text-white">ملخص الطلب</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>المجموع الفرعي</span>
                <span className="text-white">{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>الشحن</span>
                <span className="text-green-400">مجاني</span>
              </div>
              <div className="my-3 h-px bg-white/10" />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-white">الإجمالي</span>
                <span className="font-display text-xl font-bold text-[var(--accent)]">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-2xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-black transition hover:opacity-90"
            >
              متابعة الدفع
            </Link>
            <Link
              href="/products"
              className="mt-3 block rounded-2xl border border-white/15 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/5"
            >
              مواصلة التسوّق
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
