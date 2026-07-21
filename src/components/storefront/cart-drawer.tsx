"use client";

import Link from "next/link";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";
import type { Settings } from "@/db/schema";

export default function CartDrawer({ settings }: { settings: Settings }) {
  const { items, open, setOpen, increment, decrement, removeItem, subtotal } =
    useCart();

  return (
    <>
      {/* الخلفية المعتمة */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* اللوحة */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-md flex-col border-r border-white/10 bg-[#0b0b0c] shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="font-display text-lg font-bold text-white">
            سلة التسوّق
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-300 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-3xl">🛍️</div>
            <p className="text-zinc-400">سلتك فارغة حالياً</p>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              تصفّح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3"
                >
                  <img
                    src={it.image ?? ""}
                    alt={it.name}
                    className="h-20 w-20 shrink-0 rounded-xl bg-white/5 object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white line-clamp-2">
                        {it.name}
                      </p>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-zinc-500 hover:text-red-400"
                        aria-label="حذف"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--accent)]">
                      {formatPrice(it.price, settings.currency)}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <button
                        onClick={() => decrement(it.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-zinc-300 hover:text-white"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm text-white">
                        {it.qty}
                      </span>
                      <button
                        onClick={() => increment(it.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-zinc-300 hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">الإجمالي</span>
                <span className="font-display text-xl font-bold text-white">
                  {formatPrice(subtotal, settings.currency)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  عرض السلة
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-[var(--accent)] px-4 py-3 text-center text-sm font-semibold text-black transition hover:opacity-90"
                >
                  إتمام الطلب
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
