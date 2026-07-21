"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { createOrder } from "@/app/actions";
import { formatPrice } from "@/lib/utils";

export default function CheckoutClient({ currency }: { currency: string }) {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await createOrder({
        customerName: String(fd.get("customerName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        address: String(fd.get("address") ?? ""),
        city: String(fd.get("city") ?? ""),
        notes: String(fd.get("notes") ?? ""),
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          image: i.image,
        })),
        total: String(subtotal),
      });
      if (res?.ok) {
        clear();
        setDone(res.id ?? 0);
      } else {
        setError("تعذّر إتمام الطلب، حاول مرة أخرى.");
      }
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  if (done !== null) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-green-400/15 text-4xl text-green-400">
          ✓
        </div>
        <h1 className="font-display text-3xl font-bold text-white">تم استلام طلبك!</h1>
        <p className="mt-3 text-zinc-400">
          شكراً لثقتك بنا. رقم طلبك{" "}
          <span className="font-bold text-[var(--accent)]">#{done || "—"}</span>. سنتواصل
          معك قريباً لتأكيد التوصيل.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-block rounded-2xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-black"
        >
          مواصلة التسوّق
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mb-4 text-6xl">🛍️</div>
        <h1 className="font-display text-3xl font-bold text-white">لا يمكن إتمام الطلب</h1>
        <p className="mt-2 text-zinc-400">سلتك فارغة</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-2xl bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-black"
        >
          تصفّح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 font-display text-3xl font-bold text-white">إتمام الطلب</h1>
      <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* البيانات */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">بيانات التواصل</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" name="customerName" required />
              <Field label="رقم الجوال" name="phone" required />
              <Field label="البريد الإلكتروني" name="email" type="email" required />
              <Field label="المدينة" name="city" required />
            </div>
            <div className="mt-4">
              <Field label="العنوان التفصيلي" name="address" required />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-zinc-400">ملاحظات (اختياري)</label>
              <textarea
                name="notes"
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* الملخص */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-white">طلبك</h2>
            <div className="max-h-56 space-y-3 overflow-y-auto">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3">
                  <img src={it.image ?? ""} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 text-sm">
                    <p className="line-clamp-1 text-white">{it.name}</p>
                    <p className="text-xs text-zinc-500">×{it.qty}</p>
                  </div>
                  <span className="text-sm text-zinc-300">
                    {formatPrice(Number(it.price) * it.qty, currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="my-4 h-px bg-white/10" />
            <div className="flex justify-between text-base">
              <span className="font-semibold text-white">الإجمالي</span>
              <span className="font-display text-xl font-bold text-[var(--accent)]">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 block w-full rounded-2xl bg-[var(--accent)] py-3.5 text-center text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "جارٍ المعالجة..." : "تأكيد الطلب (الدفع عند الاستلام)"}
            </button>
            <p className="mt-3 text-center text-xs text-zinc-500">
              🔒 معاملة آمنة • الدفع نقداً عند الاستلام
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
      />
    </div>
  );
}
