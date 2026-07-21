import { getFeatures } from "@/lib/data";
import { createFeature, updateFeature, deleteFeature } from "@/app/actions";
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

export const dynamic = "force-dynamic";

const noticeMap: Record<string, string> = {
  created: "تمت إضافة الميزة.",
  updated: "تم تحديث الميزة.",
  deleted: "تم حذف الميزة.",
};

export default async function FeaturesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const features = await getFeatures();

  return (
    <div>
      <PageHeader
        title="بطاقات المميزات"
        desc="الأيقونات التي تظهر في قسم «لماذا تختارنا»"
      />

      {sp.status && noticeMap[sp.status] && (
        <div className="mb-5">
          <Notice kind="success">{noticeMap[sp.status]}</Notice>
        </div>
      )}

      <Card title="إضافة ميزة">
        <form action={createFeature} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="الأيقونة (إيموجي)" name="icon" defaultValue="✦" />
            <TextField label="العنوان" name="title" required />
            <TextField label="الترتيب" name="sortOrder" type="number" defaultValue="0" />
          </div>
          <TextArea label="الوصف" name="description" rows={2} />
          <Toggle name="active" label="مفعّلة" defaultChecked />
          <button type="submit" className={btnPrimary}>
            + إضافة
          </button>
        </form>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {features.map((f) => {
          const upd = updateFeature.bind(null, f.id);
          const del = deleteFeature.bind(null, f.id);
          return (
            <Card key={f.id}>
              <form action={upd} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="الأيقونة" name="icon" defaultValue={f.icon ?? "✦"} />
                  <TextField label="الترتيب" name="sortOrder" type="number" defaultValue={f.sortOrder ?? 0} />
                </div>
                <TextField label="العنوان" name="title" defaultValue={f.title} required />
                <TextArea label="الوصف" name="description" rows={2} defaultValue={f.description ?? ""} />
                <div className="flex flex-wrap items-center gap-4">
                  <Toggle name="active" label="مفعّلة" defaultChecked={f.active ?? true} />
                  <button type="submit" className={btnPrimary}>
                    حفظ
                  </button>
                </div>
              </form>
              <form action={del} className="mt-3 border-t border-white/5 pt-3">
                <button type="submit" className={btnDanger}>
                  حذف
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
