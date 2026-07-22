import Link from "next/link";
import { signOut } from "@/auth";

export function AdminNav() {
  return (
    <aside className="bg-navy-900 p-5 text-white md:min-h-screen md:w-64">
      <b className="text-lg">مدیریت تابان</b>
      <nav className="mt-8 grid gap-4">
        <Link href="/admin/dashboard" className="hover:text-cyan-300 transition">داشبورد</Link>
        <Link href="/admin/products" className="hover:text-cyan-300 transition">محصولات</Link>
        <Link href="/admin/inquiries" className="hover:text-cyan-300 transition">درخواست‌ها</Link>
        <Link href="/admin/certificates" className="hover:text-cyan-300 transition">گواهی‌نامه‌ها</Link>
        <Link href="/admin/content" className="hover:text-cyan-300 transition">محتوای شرکت</Link>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
          <button className="text-red-400 hover:text-red-300 transition">خروج</button>
        </form>
      </nav>
    </aside>
  );
}