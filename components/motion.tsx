"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.6, delay, ease: "easeOut" }}>{children}</motion.div>;
}
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className="container relative" initial={reduceMotion ? false : { opacity: 0, y: 32 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>{children}</motion.div>;
}
export function FloatingMotif({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className="absolute -left-20 top-20 w-96 text-cyan-500/10" animate={reduceMotion ? undefined : { y: [0, 18, 0], rotate: [0, 2, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>{children}</motion.div>;
}
export function AnimatedStat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null); const visible = useInView(ref, { once: true, amount: 0.5 }); const reduceMotion = useReducedMotion(); const [shown, setShown] = useState(reduceMotion ? value : 0);
  useEffect(() => { if (!visible || reduceMotion) { if (reduceMotion) setShown(value); return; } const started = performance.now(); const duration = 900; let frame = 0; const update = (now: number) => { const progress = Math.min((now - started) / duration, 1); setShown(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) frame = requestAnimationFrame(update); }; frame = requestAnimationFrame(update); return () => cancelAnimationFrame(frame); }, [visible, reduceMotion, value]);
  return <motion.div ref={ref} className={cn("rounded-card border border-navy-900/10 bg-white p-6 shadow-sm")} whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ duration: 0.25 }}><b className="text-4xl text-blue-600">{shown.toLocaleString("fa-IR")}</b><p className="mt-2">{label}</p></motion.div>;
}
