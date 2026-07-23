import type { Metadata } from "next";
import { VideoHero } from "@/components/marketing/video-hero";

export const metadata: Metadata = {
  title: "آسانسور تابان نورد",
  description: "ورود به وب‌سایت آسانسور تابان نورد؛ مهندسی ایمن برای حرکت رو به بالا.",
  alternates: { canonical: "/" },
};

export default function VideoHomePage() {
  return <VideoHero />;
}
