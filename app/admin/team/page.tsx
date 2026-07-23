import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/admin/team-management";

export const dynamic = "force-dynamic";

export default async function TeamManagementPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admin/products");
  }

  const users = await db.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">مدیریت تیم و دسترسی‌ها</h1>
          <p className="mt-2 text-ink-900/60">تعریف مدیران جدید و مدیریت سطح دسترسی اعضای تیم</p>
        </div>
      </div>

      <TeamManagement
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as "SUPER_ADMIN" | "SUB_ADMIN",
          isActive: u.isActive,
          createdAt: u.createdAt,
        }))}
        currentUserId={session.user.id}
      />
    </>
  );
}
