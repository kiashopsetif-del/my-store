import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import { deleteProduct } from "@/app/actions";
import { PageHeader, Card, Notice, Badge } from "@/components/admin/ui";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const noticeMap: Record<string, string> = {
  created: "تمت إضافة المنتج بنجاح.",
  updated: "تم تحديث المنتج بنجاح.",
  deleted: "تم حذف المنتج.",
};

export default async function ProductsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const catName = (id: number | null) => categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="المنتجات"
        desc={`${products.length} منتج`}
        action={
          <Link href="/admin/products/new" className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-black">
            + إضافة منتج
          </Link>
        }
      />

      {sp.status && noticeMap[sp.status] && (
        <div className="mb-5">
          <Notice kind="success">{noticeMap[sp.status]}</Notice>
        </div>
      )}

      <Card>
        {products.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            لا توجد منتجات بعد.{" "}
            <Link href="/admin/products/new" className="text-[var(--accent)]">
              أضف أول منتج
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-right text-xs text-zinc-500">
                  <th className="pb-3 font-medium">المنتج</th>
                  <th className="pb-3 font-medium">القسم</th>
                  <th className="pb-3 font-medium">السعر</th>
                  <th className="pb-3 font-medium">المخزون</th>
                  <th className="pb-3 font-medium">الحالة</th>
                  <th className="pb-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const del = deleteProduct.bind(null, p.id);
                  return (
                    <tr key={p.id} className="border-b border-white/5">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                          ) : (
                            <div className="grid h-11 w-11 place-items-center rounded-lg bg-white/5 text-zinc-600">🖼</div>
                          )}
                          <span className="font-medium text-white">{p.name}</span>
                        </div>
                      </td>
                      <td className="text-zinc-400">{catName(p.categoryId)}</td>
                      <td className="font-semibold text-[var(--accent)]">{formatPrice(p.price)}</td>
                      <td>
                        <Badge tone={Number(p.stock) === 0 ? "red" : Number(p.stock) <= 5 ? "amber" : "neutral"}>
                          {p.stock}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {p.featured && <Badge tone="accent">مميز</Badge>}
                          {p.active ? <Badge tone="green">منشور</Badge> : <Badge tone="neutral">مخفي</Badge>}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white hover:bg-white/5"
                          >
                            تعديل
                          </Link>
                          <form action={del}>
                            <button
                              type="submit"
                              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                            >
                              حذف
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
