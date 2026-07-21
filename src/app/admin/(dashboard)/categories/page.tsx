import { getCategories } from "@/lib/data";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions";
import {
  PageHeader,
  Card,
  TextField,
  TextArea,
  Toggle,
  Notice,
  btnPrimary,
  btnDanger,
} from "@/components/admin/ui";
import ImageUploader from "@/components/admin/image-uploader";

export const dynamic = "force-dynamic";

const noticeMap: Record<string, string> = {
  created: "تمت إضافة القسم.",
  updated: "تم تحديث القسم.",
  deleted: "تم حذف القسم.",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const categories = await getCategories();

  return (
    <div>
      <PageHeader title="الأقسام" desc={`${categories.length} قسم`} />

      {sp.status && noticeMap[sp.status] && (
        <div className="mb-5">
          <Notice kind="success">{noticeMap[sp.status]}</Notice>
        </div>
      )}

      {/* إضافة */}
      <Card title="إضافة قسم جديد">
        <form action={createCategory} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="اسم القسم" name="name" required />
            <TextField label="المعرّف (slug)" name="slug" hint="إن تُرك فارغاً يُولّد تلقائياً" />
            <TextField label="ترتيب الظهور" name="sortOrder" type="number" defaultValue="0" />
          </div>
          <TextArea label="الوصف" name="description" rows={2} />
          <ImageUploader label="صورة القسم" name="image" />
          <Toggle name="active" label="مفعّل" defaultChecked />
          <button type="submit" className={btnPrimary}>
            + إضافة القسم
          </button>
        </form>
      </Card>

      {/* القائمة */}
      <div className="mt-6 space-y-4">
        {categories.map((c) => {
          const upd = updateCategory.bind(null, c.id);
          const del = deleteCategory.bind(null, c.id);
          return (
            <Card key={c.id}>
              <div className="mb-4 flex items-center gap-3">
                {c.image ? (
                  <img src={c.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/5 text-zinc-600">◈</div>
                )}
                <div>
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-xs text-zinc-500">/{c.slug}</p>
                </div>
              </div>
              <form action={upd} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextField label="الاسم" name="name" defaultValue={c.name} required />
                  <TextField label="المعرّف" name="slug" defaultValue={c.slug} />
                  <TextField label="الترتيب" name="sortOrder" type="number" defaultValue={c.sortOrder ?? 0} />
                </div>
                <TextArea label="الوصف" name="description" rows={2} defaultValue={c.description ?? ""} />
                <ImageUploader label="الصورة" name="image" defaultValue={c.image ?? ""} />
                <div className="flex flex-wrap items-center gap-4">
                  <Toggle name="active" label="مفعّل" defaultChecked={c.active ?? true} />
                  <button type="submit" className={btnPrimary}>
                    حفظ
                  </button>
                </div>
              </form>
              <form action={del} className="mt-3 border-t border-white/5 pt-3">
                <button type="submit" className={btnDanger}>
                  حذف القسم نهائياً
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
