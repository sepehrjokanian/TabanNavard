import Link from "next/link";
import { Card, Placeholder, Badge } from "./ui";
import { money } from "@/lib/utils";

export function ProductCard({ p }: { p: any }) {
  return (
    <Card variant="accent" className="flex flex-col justify-between">
      <div>
        <Placeholder label={`تصویر ${p.title}`} />
        <div className="mt-5">
          <Badge>{p.category === "ELEVATOR" ? "آسانسور" : "قطعه"}</Badge>
          <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cyan-100/90">{p.shortDesc}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
        <b className="text-lg font-extrabold text-white">{money(p.price)}</b>
        <Link className="rounded-button bg-white px-3.5 py-1.5 text-xs font-bold text-navy-900 shadow-sm transition hover:bg-cyan-100" href={`/products/${p.slug}`}>
          مشاهده ←
        </Link>
      </div>
    </Card>
  );
}