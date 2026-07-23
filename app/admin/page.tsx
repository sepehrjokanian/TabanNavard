import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user || session.user.isActive === false) {
    redirect("/admin/login");
  }

  if (session.user.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/products");
  }
}
