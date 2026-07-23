"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Award, Settings, Headphones } from "lucide-react";

const mottos = [
  { id: 1, text: "ایمنی در هر طبقه، اطمینان در هر سفر", Icon: ShieldCheck },
  { id: 2, text: "تکنولوژی پیشرفته، بیش از دو دهه تجربه", Icon: Award },
  { id: 3, text: "مهندسی دقیق، خدمات پایدار", Icon: Settings },
  { id: 4, text: "پشتیبانی دائمی، آسودگی خاطر همیشگی", Icon: Headphones },
];

export function VideoHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-700 to-blue-600 py-8 text-white sm:py-12">
      {/* Ambient background poster layer */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('/placeholders/video-poster.svg')] bg-cover bg-center opacity-15"
      />
      {/* Blueprint grid pattern layer */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-10 [background-image:linear-gradient(#7FD1F2_1px,transparent_1px),linear-gradient(90deg,#7FD1F2_1px,transparent_1px)] [background-size:48px_48px]"
      />
      {/* Dark gradient vignette overlay */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/50" />

      <div className="container relative z-10 w-full max-w-[92rem] px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Side Column 1 (Right in RTL layout) - 2 stacked motto cards */}
          <div className="hidden flex-col gap-6 lg:col-span-2 lg:flex">
            {mottos.slice(0, 2).map((motto, idx) => (
              <motion.div
                key={motto.id}
                animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.8,
                }}
                className="motto-card-animated-border shadow-xl shadow-cyan-500/10"
              >
                <div className="flex h-full min-h-[135px] flex-col items-center justify-center rounded-[14px] bg-navy-900/90 p-6 text-center backdrop-blur-md xl:min-h-[150px] xl:p-7">
                  <motto.Icon className="mb-3 h-6 w-6 text-cyan-300 stroke-[1.75]" aria-hidden />
                  <p className="text-base font-bold leading-relaxed text-cyan-300 xl:text-lg xl:leading-loose">
                    {motto.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Enlarged Video Frame (~66.7% width on desktop) */}
          <div className="relative w-full lg:col-span-8">
            {/* Soft radial cyan glow behind video frame */}
            <div
              aria-hidden
              className="absolute -inset-6 rounded-card bg-cyan-500/25 blur-3xl opacity-80"
            />
            <div className="relative overflow-hidden rounded-card border border-cyan-500/30 bg-navy-900/80 p-2.5 sm:p-3.5 shadow-2xl shadow-cyan-500/15 backdrop-blur-md ring-1 ring-white/10">
              <div className="relative aspect-video w-full overflow-hidden rounded-[12px]">
                {!reduceMotion && (
                  <video
                    aria-hidden
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/placeholders/video-poster.svg"
                    className="h-full w-full object-cover"
                  >
                    <source src="/hero-video/hero-video.webm" type="video/webm" />
                  </video>
                )}
                {reduceMotion && (
                  <div
                    aria-hidden
                    className="h-full w-full bg-[url('/placeholders/video-poster.svg')] bg-cover bg-center"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Side Column 2 (Left in RTL layout) - 2 stacked motto cards */}
          <div className="hidden flex-col gap-6 lg:col-span-2 lg:flex">
            {mottos.slice(2, 4).map((motto, idx) => (
              <motion.div
                key={motto.id}
                animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (idx + 2) * 0.8,
                }}
                className="motto-card-animated-border shadow-xl shadow-cyan-500/10"
              >
                <div className="flex h-full min-h-[135px] flex-col items-center justify-center rounded-[14px] bg-navy-900/90 p-6 text-center backdrop-blur-md xl:min-h-[150px] xl:p-7">
                  <motto.Icon className="mb-3 h-6 w-6 text-cyan-300 stroke-[1.75]" aria-hidden />
                  <p className="text-base font-bold leading-relaxed text-cyan-300 xl:text-lg xl:leading-loose">
                    {motto.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile & Tablet Motto Grid (below video frame on < lg screens) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {mottos.map((motto, idx) => (
              <motion.div
                key={motto.id}
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.6,
                }}
                className="motto-card-animated-border shadow-md shadow-cyan-500/10"
              >
                <div className="flex h-full min-h-[105px] flex-col items-center justify-center rounded-[14px] bg-navy-900/90 p-5 text-center backdrop-blur-md">
                  <motto.Icon className="mb-2 h-5 w-5 text-cyan-300 stroke-[1.75]" aria-hidden />
                  <p className="text-sm font-bold leading-relaxed text-cyan-300 sm:text-base">
                    {motto.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}





