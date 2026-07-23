import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const isSubAdmin = session?.user?.role === "SUB_ADMIN";

  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!product) notFound();

  const mainImage = product.images?.[0]?.url ?? "";

  return (
    <>
      <Link href="/admin/products" className="font-bold text-blue-600">
        → بازگشت به محصولات
      </Link>
      <div className="mt-6 rounded-card bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">ویرایش محصول</h1>
        <p className="mb-6 text-ink-900/60">{product.title}</p>
        <ProductForm
          isSubAdmin={isSubAdmin}
          product={{
            ...product,
            price: product.price?.toString(),
            specs: product.specs as Record<string, unknown>,
            imageUrl: mainImage,
          }}
        />
      </div>
    </>
  );
}
