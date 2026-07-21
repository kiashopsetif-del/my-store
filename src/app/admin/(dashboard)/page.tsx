import Link from "next/link";
import { getDashboardStats, getSettings } from "@/lib/data";
import { PageHeader, StatCard, Card, Badge } from "@/components/admin/ui";
import { formatPrice, toDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusMap: Record<string, { label: string; tone: "amber" | "accent" | "green" | "red" | "neutral" }> = {
  pending: { label: "قيد الانتظار", tone: "amber" },
  processing: { label: "قيد المعالجة", tone: "accent" },
  shipped: { label: "تم الشحن", tone: "neutral" },
  delivered: { label: "تم التوصيل", tone: "green" },
  cancelled: { label: "ملغي", tone: "red" },
};

export default async function AdminOverviewPage() {
  const [stats, settings] = await Promise.all([getDashboardStats(), getSettings()]);

  return (
    <div>
      <PageHeader
        title="نظرة عامة"
        desc="ملخص أداء متجرك"
        action={
          <Link href="/admin/products/new" className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-black">
            + إضافة منتج
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="المنتجات" value={stats.products} icon="▣" />
        <StatCard label="الطلبات" value={stats.orders} icon="✉" />
        <StatCard label="الأقسام" value={stats.categories} icon="◈" />
        <StatCard label="إجمالي المبيعات" value={formatPrice(stats.revenue, settings.currency)} icon="✦" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* أحدث الطلبات */}
        <Card title="أحدث الطلبات">
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">لا توجد طلبات بعد</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((o) => {
                const s = statusMap[o.status ?? "pending"] ?? statusMap.pending;
                return (
                  <div key={o.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div>
                      <p className="text-sm font-medium text-white">#{o.id} — {o.customerName}</p>
                      <p className="text-xs text-zinc-500">{toDate(o.createdAt).toLocaleDateString("ar")}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[var(--accent)]">{formatPrice(o.total, settings.currency)}</p>
                      <Badge tone={s.tone}>{s.label}</Badge>
                    </div>
                  </div>
                );
              })}
              <Link href="/admin/orders" className="block pt-2 text-center text-sm text-zinc-400 hover:text-[var(--accent)]">
                عرض كل الطلبات ←
              </Link>
            </div>
          )}
        </Card>

        {/* مخزون منخفض */}
        <Card title="تنبيهات المخزون" desc="منتجات على وشك النفاد">
          {stats.lowStock.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">المخزون بحالة جيدة ✦</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                    <span className="text-sm text-white">{p.name}</span>
                  </div>
                  <Badge tone={Number(p.stock) === 0 ? "red" : "amber"}>
                    {p.stock} متبقي
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* اختصارات */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { href: "/admin/products", label: "إدارة المنتجات", icon: "▣" },
          { href: "/admin/categories", label: "إدارة الأقسام", icon: "◈" },
          { href: "/admin/settings", label: "تعديل محتوى المتجر", icon: "⚙" },
        ].map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-[var(--accent)]/40"
          >
            <div className="mb-2 text-2xl text-[var(--accent)]">{q.icon}</div>
            <div className="text-sm font-semibold text-white">{q.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
