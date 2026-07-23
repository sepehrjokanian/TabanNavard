import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await auth();
  if (session?.user?.role === "SUB_ADMIN") {
    redirect("/admin/products");
  }

  return (
    <>
      <Link href="/admin/products" className="font-bold text-blue-600">
        → بازگشت به محصولات
      </Link>
      <div className="mt-6 rounded-card bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">افزودن محصول</h1>
        <ProductForm />
      </div>
    </>
  );
}
