import { notFound } from "next/navigation";
import { getCategories, getProductById } from "@/lib/data";
import { updateProduct } from "@/app/actions";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(Number(id)),
    getCategories(),
  ]);
  if (!product) notFound();

  const action = updateProduct.bind(null, product.id);

  return (
    <div>
      <PageHeader title="تعديل المنتج" desc={product.name} />
      <ProductForm action={action} categories={categories} product={product} />
    </div>
  );
}
