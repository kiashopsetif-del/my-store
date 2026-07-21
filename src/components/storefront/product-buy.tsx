"use client";

import { useState } from "react";
import { useCart } from "@/context/cart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/db/schema";

export default function ProductBuy({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}) {
  const { addItem, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const out = Number(product.stock) <= 0;

  const add = () => {
    if (out) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      qty
    );
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-10 w-10 place-items-center rounded-xl text-xl text-zinc-300 hover:bg-white/5"
          >
            −
          </button>
          <span className="w-8 text-center text-lg font-semibold text-white">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="grid h-10 w-10 place-items-center rounded-xl text-xl text-zinc-300 hover:bg-white/5"
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {out ? (
            <span className="text-red-400">غير متوفر حالياً</span>
          ) : (
            <span className="text-green-400">متوفر • {product.stock} قطعة</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={add}
          disabled={out}
          className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition ${
            added
              ? "bg-green-400 text-black"
              : "bg-[var(--accent)] text-black hover:opacity-90"
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {added ? "✓ تمت الإضافة للسلة" : out ? "نفد المخزون" : "أضف إلى السلة"}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-400">
        <div className="flex items-center gap-2 text-white">
          <span className="text-[var(--accent)]">✦</span>
          السعر يشمل الضريبة • شحن سريع وآمن
        </div>
      </div>
    </div>
  );
}
