"use client";

import { useState, useMemo } from "react";
import { createOrder } from "@/app/actions";
import { formatPrice } from "@/lib/utils";
import { wilayas } from "@/lib/algeria-cities";
import type { Product } from "@/db/schema";

export default function QuickOrder({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [wilayaCode, setWilayaCode] = useState("");

  const selectedWilaya = useMemo(
    () => wilayas.find((w) => w.code === wilayaCode),
    [wilayaCode]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const wilaya = String(fd.get("wilaya") ?? "").trim();
    const commune = String(fd.get("commune") ?? "").trim();
    const addressDetail = String(fd.get("addressDetail") ?? "").trim();

    if (!firstName || !lastName || !phone || !wilaya || !commune || !addressDetail) {
      setError("جميع الحقول مطلوبة");
      setLoading(false);
      return;
    }

    const fullAddress = `${wilaya} - ${commune} - ${addressDetail}`;

    try {
      const res = await createOrder({
        customerName: `${firstName} ${lastName}`,
        email: "",
        phone,
        address: fullAddress,
        city: wilaya,
        notes: `طلب سريع لـ: ${product.name}`,
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            qty: 1,
            image: product.image,
          },
        ],
        total: product.price,
      });

      if (res?.ok) {
        setDone(true);
      } else {
        setError("تعذّر إرسال الطلب");
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-500/20 text-2xl text-green-400">
          ✓
        </div>
        <h3 className="font-display text-lg font-bold text-white">تم استلام طلبك!</h3>
        <p className="mt-1 text-sm text-zinc-400">
          سنتواصل معك قريباً على الرقم المُقدّم لتأكيد الطلب.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.03] p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-white">🛒 اطلب الآن</h3>
      <p className="mb-4 text-sm text-zinc-400">
        املأ بياناتك وسنتواصل معك لتأكيد الطلب
      </p>

      <form onSubmit={onSubmit} className="space-y-3">
        {/* الاسم واللقب */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">الاسم</label>
            <input
              name="firstName"
              type="text"
              required
              placeholder="محمد"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">اللقب</label>
            <input
              name="lastName"
              type="text"
              required
              placeholder="الفلاني"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* الهاتف */}
        <div>
          <label className="mb-1 block text-xs text-zinc-400">رقم الهاتف</label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="05xxxxxxxx"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </div>

        {/* الولاية */}
        <div>
          <label className="mb-1 block text-xs text-zinc-400">الولاية</label>
          <select
            name="wilaya"
            required
            value={wilayaCode}
            onChange={(e) => setWilayaCode(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          >
            <option value="">اختر الولاية</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code} - {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* البلدية */}
        <div>
          <label className="mb-1 block text-xs text-zinc-400">البلدية</label>
          <select
            name="commune"
            required
            disabled={!selectedWilaya}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)] disabled:opacity-40"
          >
            <option value="">{selectedWilaya ? "اختر البلدية" : "اختر الولاية أولاً"}</option>
            {selectedWilaya?.communes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* العنوان التفصيلي */}
        <div>
          <label className="mb-1 block text-xs text-zinc-400">العنوان التفصيلي (الحي، الشارع، رقم المنزل)</label>
          <textarea
            name="addressDetail"
            rows={2}
            required
            placeholder="حي النصر، شارع الجزائر، عمارة 5..."
            className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[var(--accent)]"
          />
        </div>

        {/* ملخص الطلب */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="text-sm text-zinc-400">المنتج</span>
          <span className="text-sm text-white line-clamp-1">{product.name}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
          <span className="text-sm text-zinc-400">الإجمالي</span>
          <span className="font-display text-lg font-bold text-[var(--accent)]">
            {formatPrice(product.price, currency)}
          </span>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "جارٍ الإرسال..." : "✓ تأكيد الطلب (الدفع عند الاستلام)"}
        </button>

        <p className="text-center text-[10px] text-zinc-600">
          🔒 بياناتك آمنة • الدفع نقداً عند الاستلام
        </p>
      </form>
    </div>
  );
}
