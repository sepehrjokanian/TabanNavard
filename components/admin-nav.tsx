import Link from "next/link";
import { auth, signOut } from "@/auth";
import { ShieldCheck, UserCheck } from "lucide-react";

async function adminSignOut() {
  "use server";
  await signOut({ redirectTo: "/admin/login" });
}

export async function AdminNav() {
  const session = await auth();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const user = session?.user;

  return (
    <aside className="bg-navy-900 p-5 text-white md:min-h-screen md:w-64 flex flex-col justify-between">
      <div>
        <div className="border-b border-white/10 pb-4">
          <b className="text-lg block">مدیریت تابان</b>
          {user && (
            <div className="mt-2 text-xs text-cyan-300/80 flex items-center gap-1.5">
              {isSuperAdmin ? (
                <ShieldCheck className="h-4 w-4 text-gold-400 shrink-0" />
              ) : (
                <UserCheck className="h-4 w-4 text-cyan-400 shrink-0" />
              )}
              <span className="truncate">{user.name || user.email}</span>
              <span className="ms-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                {isSuperAdmin ? "ارشد" : "پشتیبان"}
              </span>
            </div>
          )}
        </div>

        <nav className="mt-6 grid gap-3 text-sm font-medium">
          {isSuperAdmin && (
            <Link href="/admin/dashboard" className="hover:text-cyan-300 transition py-1">
              داشبورد
            </Link>
          )}
          <Link href="/admin/products" className="hover:text-cyan-300 transition py-1">
            محصولات
          </Link>
          <Link href="/admin/inquiries" className="hover:text-cyan-300 transition py-1">
            درخواست‌ها
          </Link>
          {isSuperAdmin && (
            <>
              <Link href="/admin/certificates" className="hover:text-cyan-300 transition py-1">
                گواهی‌نامه‌ها
              </Link>
              <Link href="/admin/content" className="hover:text-cyan-300 transition py-1">
                محتوای شرکت
              </Link>
              <Link href="/admin/team" className="hover:text-cyan-300 transition py-1">
                مدیریت تیم
              </Link>
              <Link href="/admin/logs" className="hover:text-cyan-300 transition py-1">
                سوابق تغییرات
              </Link>
            </>
          )}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10 mt-6">
        <form action={adminSignOut}>
          <button type="submit" className="text-red-400 hover:text-red-300 transition text-sm font-medium">
            خروج از حساب
          </button>
        </form>
      </div>
    </aside>
  );
}