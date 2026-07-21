import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const font = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazirmatn", display: "swap" });
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B2A4A" };
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "آسانسور تابان نورد", template: "%s | آسانسور تابان نورد" },
  description: "طراحی، نصب و تأمین آسانسور و قطعات با مهندسی دقیق و خدمات مطمئن",
  applicationName: "آسانسور تابان نورد",
  keywords: ["آسانسور", "قطعات آسانسور", "تابان نورد", "نصب آسانسور", "آسانسور مشهد"],
  authors: [{ name: "آسانسور تابان نورد" }],
  openGraph: { type: "website", locale: "fa_IR", siteName: "آسانسور تابان نورد", title: "آسانسور تابان نورد", description: "مهندسی ایمن برای حرکت رو به بالا" },
  twitter: { card: "summary_large_image", title: "آسانسور تابان نورد", description: "مهندسی ایمن برای حرکت رو به بالا" },
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fa" dir="rtl"><body className={font.variable}><a href="#main-content" className="skip-link">پرش به محتوای اصلی</a><div id="main-content">{children}</div></body></html>;
}
