import { getOrders, getSettings } from "@/lib/data";
import { updateOrderStatus } from "@/app/actions";
import {
  PageHeader,
  Card,
  Notice,
  Badge,
  SelectField,
  btnGhost,
} from "@/components/admin/ui";
import { formatPrice, toDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statuses = [
  { value: "pending", label: "قيد الانتظار", tone: "amber" as const },
  { value: "processing", label: "قيد المعالجة", tone: "accent" as const },
  { value: "shipped", label: "تم الشحن", tone: "neutral" as const },
  { value: "delivered", label: "تم التوصيل", tone: "green" as const },
  { value: "cancelled", label: "ملغي", tone: "red" as const },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const [orders, settings] = await Promise.all([getOrders(), getSettings()]);
  const toneFor = (s: string) => statuses.find((x) => x.value === s)?.tone ?? "neutral";

  return (
    <div>
      <PageHeader title="الطلبات" desc={`${orders.length} طلب`} />

      {sp.updated && (
        <div className="mb-5">
          <Notice kind="success">تم تحديث حالة الطلب.</Notice>
        </div>
      )}

      {orders.length === 0 ? (
        <Card>
          <p className="py-12 text-center text-sm text-zinc-500">لا توجد طلبات بعد.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const upd = updateOrderStatus.bind(null, o.id);
            return (
              <Card key={o.id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-white">طلب #{o.id}</h3>
                      <Badge tone={toneFor(o.status ?? "pending")}>
                        {statuses.find((s) => s.value === o.status)?.label ?? o.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">
                      {o.customerName} • {o.email}
                      {o.phone ? ` • ${o.phone}` : ""}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {toDate(o.createdAt).toLocaleString("ar")}
                    </p>
                  </div>
                  <div className="text-left">
                    <div className="font-display text-xl font-bold text-[var(--accent)]">
                      {formatPrice(o.total, settings.currency)}
                    </div>
                  </div>
                </div>

                {/* العناصر */}
                <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="space-y-2">
                    {(o.items ?? []).map((it, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {it.image && (
                          <img src={it.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                        )}
                        <span className="flex-1 text-zinc-300">{it.name}</span>
                        <span className="text-zinc-500">×{it.qty}</span>
                        <span className="text-white">{formatPrice(it.price, settings.currency)}</span>
                      </div>
                    ))}
                  </div>
                  {o.address && (
                    <p className="mt-3 border-t border-white/5 pt-3 text-xs text-zinc-500">
                      📍 {o.address}
                      {o.city ? ` — ${o.city}` : ""}
                      {o.notes ? ` — ${o.notes}` : ""}
                    </p>
                  )}
                </div>

                {/* تحديث الحالة */}
                <form action={upd} className="mt-4 flex items-end gap-3">
                  <div className="w-48">
                    <SelectField label="تغيير الحالة" name="status" defaultValue={o.status ?? "pending"}>
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <button type="submit" className={btnGhost}>
                    تحديث
                  </button>
                </form>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
