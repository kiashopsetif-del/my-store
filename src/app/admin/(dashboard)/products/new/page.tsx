import { getCategories } from "@/lib/data";
import { createProduct } from "@/app/actions";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <PageHeader title="إضافة منتج جديد" desc="أدخل تفاصيل المنتج ثم اضغط إضافة" />
      <ProductForm action={createProduct} categories={categories} />
    </div>
  );
}
