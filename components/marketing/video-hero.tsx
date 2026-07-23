"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LogoPlaceholder } from "@/components/ui";

export function VideoHero() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/placeholders/video-poster.svg')] bg-cover bg-center"
      />
      {!reduceMotion && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          poster="/placeholders/video-poster.svg"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {/* Replace this placeholder path with the final optimized MP4 file. */}
          <source src="/videos/taban-hero-placeholder.mp4" type="video/mp4" />
        </video>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/55 to-navy-900/25" />
      <div className="container relative z-10 flex flex-col items-center text-center">
        <LogoPlaceholder variant="dark" className="mb-8" />
        <p className="text-sm font-bold tracking-[0.2em] text-cyan-300">آسانسور تابان نورد</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
          حرکت به سوی کیفیت، ایمنی و شکوه
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
          راهکارهای مهندسی آسانسور برای ساختمان‌هایی که شایسته بهترین‌اند.
        </p>
        <Link
          href="/company"
          className="mt-9 inline-flex items-center gap-3 rounded-button bg-gradient-to-l from-cyan-500 to-blue-600 px-7 py-4 font-bold text-white shadow-xl transition hover:shadow-cyan-500/20 focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          ورود به وب‌سایت
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        {reduceMotion && <span className="sr-only">پخش ویدیو به‌دلیل تنظیم کاهش حرکت غیرفعال است.</span>}
      </div>
    </main>
  );
}
