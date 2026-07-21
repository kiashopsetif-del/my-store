import type { Product, Category } from "@/db/schema";
import {
  TextField,
  TextArea,
  SelectField,
  Toggle,
  Card,
  btnPrimary,
  btnGhost,
} from "@/components/admin/ui";
import ImageUploader from "@/components/admin/image-uploader";

function getImageUrl(product: Product | undefined, index: number): string {
  if (!product) return "";
  const all = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  return all[index] ?? "";
}

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (fd: FormData) => void;
  categories: Category[];
  product?: Product;
}) {
  return (
    <form action={action} className="space-y-6">
      <Card title="معلومات المنتج">
        <div className="grid gap-4">
          <TextField label="اسم المنتج" name="name" defaultValue={product?.name} required />
          <TextArea
            label="الوصف"
            name="description"
            rows={4}
            defaultValue={product?.description ?? ""}
          />
        </div>
      </Card>

      <Card title="التسعير والمخزون">
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField
            label="السعر"
            name="price"
            type="number"
            step="0.01"
            defaultValue={product?.price ?? "0"}
          />
          <TextField
            label="السعر قبل الخصم"
            name="compareAtPrice"
            type="number"
            step="0.01"
            defaultValue={product?.compareAtPrice ?? ""}
          />
          <TextField
            label="المخزون"
            name="stock"
            type="number"
            defaultValue={product?.stock ?? 0}
          />
          <TextField
            label="التقييم (0-5)"
            name="rating"
            type="number"
            step="0.1"
            defaultValue={product?.rating ?? "4.8"}
          />
          <TextField label="شارة (مثال: جديد)" name="badge" defaultValue={product?.badge ?? ""} />
          <SelectField label="القسم" name="categoryId" defaultValue={product?.categoryId ?? ""}>
            <option value="">— بدون قسم —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>
      </Card>

      <Card title="الصور (5 صور كحد أقصى)">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImageUploader
            label="① الصورة الرئيسية"
            name="image1"
            defaultValue={getImageUrl(product, 0)}
          />
          <ImageUploader
            label="② صورة إضافية"
            name="image2"
            defaultValue={getImageUrl(product, 1)}
          />
          <ImageUploader
            label="③ صورة إضافية"
            name="image3"
            defaultValue={getImageUrl(product, 2)}
          />
          <ImageUploader
            label="④ صورة إضافية"
            name="image4"
            defaultValue={getImageUrl(product, 3)}
          />
          <ImageUploader
            label="⑤ صورة إضافية"
            name="image5"
            defaultValue={getImageUrl(product, 4)}
          />
        </div>
      </Card>

      <Card title="الحالة">
        <div className="flex flex-wrap gap-6">
          <Toggle name="featured" label="منتج مميز" defaultChecked={product?.featured ?? false} />
          <Toggle name="active" label="منشور (ظاهر في المتجر)" defaultChecked={product?.active ?? true} />
        </div>
      </Card>

      <div className="flex gap-3">
        <button type="submit" className={btnPrimary}>
          {product ? "حفظ التعديلات" : "إضافة المنتج"}
        </button>
        <a href="/admin/products" className={btnGhost}>
          إلغاء
        </a>
      </div>
    </form>
  );
}
