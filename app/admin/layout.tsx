import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
export const metadata: Metadata = { title: "مدیریت", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="min-h-screen md:flex"><AdminNav /><main className="min-w-0 flex-1 p-4 md:p-10">{children}</main></div>; }
