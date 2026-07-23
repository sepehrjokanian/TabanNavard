import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { VideoHero } from "@/components/marketing/video-hero";
import { Nav, Footer, Section, Button, Card, Placeholder, BrandMotif } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { ContactForm } from "@/components/contact-form";
import { AnimatedStat, FloatingMotif, HeroMotion, Reveal } from "@/components/motion";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "آسانسور تابان نورد",
  description: "طراحی، نصب و تأمین آسانسور و قطعات با استانداردهای حرفه‌ای و پشتیبانی متعهدانه.",
  alternates: { canonical: "/" },
};

const milestones = [
  { year: 1385, title: "آغاز فعالیت تخصصی", text: "شروع مسیر با تمرکز بر ایمنی، نصب دقیق و خدمات مسئولانه." },
  { year: 1392, title: "توسعه خدمات مهندسی", text: "گسترش تیم فنی و ورود به پروژه‌های مسکونی و تجاری بزرگ‌تر." },
  { year: 1399, title: "راهکارهای کم‌مصرف", text: "افزودن سامانه‌های گیرلس و کنترل هوشمند به سبد محصولات." },
  { year: 1404, title: "پشتیبانی یکپارچه", text: "تقویت خدمات پس از فروش و تأمین قطعات تخصصی پروژه‌ها." },
];

export default async function Home() {
  const [products, content, stats, certs] = await Promise.all([
    db.product.findMany({ where: { isActive: true, isFeatured: true }, take: 4 }),
    db.companyContent.findUnique({ where: { id: "singleton" } }),
    db.companyStat.findMany({ orderBy: { order: "asc" } }),
    db.certificate.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <VideoHero />
      <div id="company-content">
        <Nav />
        <main id="main-content">
          <section className="relative grid min-h-[90vh] place-items-center overflow-hidden bg-gradient-to-bl from-navy-900 via-navy-700 to-blue-600 text-white">
            <FloatingMotif><BrandMotif className="w-full" /></FloatingMotif>
            <div aria-hidden className="absolute inset-0 opacity-10 [background-image:linear-gradient(#7FD1F2_1px,transparent_1px),linear-gradient(90deg,#7FD1F2_1px,transparent_1px)] [background-size:48px_48px]" />
            <HeroMotion>
              <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <p className="mb-4 text-cyan-300">دقت مهندسی، اعتماد ماندگار</p>
                <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">حرکتی ایمن و باشکوه برای سازه‌های ممتاز</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">طراحی، نصب و تأمین آسانسور و قطعات با استانداردهای حرفه‌ای و پشتیبانی متعهدانه.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link href="/products"><Button>مشاهده محصولات</Button></Link>
                  <Link href="#contact" className="rounded-button border border-cyan-300 px-6 py-3 transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-300">درخواست مشاوره</Link>
                </div>
              </div>
            </HeroMotion>
          </section>

          <Section id="about">
            <Reveal><h2 className="text-3xl font-extrabold md:text-4xl">سابقه‌ای رو به اوج</h2><p className="mt-6 max-w-4xl leading-8">{content?.historyText}</p></Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">{stats.map((stat) => <AnimatedStat key={stat.id} value={stat.value} label={stat.label} />)}</div>
            <Reveal className="mt-16">
              <h3 className="text-2xl font-bold">مسیر رشد تابان نورد</h3>
              <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-4 before:absolute before:bottom-auto before:start-[1.25rem] before:top-0 before:h-full before:w-px before:bg-cyan-500/40 md:before:start-0 md:before:top-5 md:before:h-px md:before:w-full">
                {milestones.map((item, index) => (
                  <li key={item.year} className="relative ps-14 md:ps-0 md:pt-12">
                    <span className="absolute start-2 top-0 grid h-10 w-10 place-items-center rounded-full border-4 border-paper-50 bg-cyan-500 text-xs font-bold text-white md:start-1/2 md:-translate-x-1/2">{index + 1}</span>
                    <b className="text-xl text-blue-600">{item.year.toLocaleString("fa-IR")}</b>
                    <h4 className="mt-2 font-bold">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-ink-900/70">{item.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Section>

          <Section className="bg-white"><Reveal className="grid items-center gap-10 md:grid-cols-2"><Placeholder label="تصویر بنیان‌گذار" /><div><p className="text-sm font-bold text-cyan-500">بنیان‌گذار</p><h2 className="mt-2 text-3xl font-extrabold md:text-4xl">{content?.founderName}</h2><p className="mt-2 text-gold-500">{content?.founderTitle}</p><blockquote className="mt-6 border-s-2 border-gold-500 ps-5 text-xl leading-9">«{content?.founderBio}»</blockquote></div></Reveal></Section>

          <Section><Reveal><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="text-3xl font-extrabold md:text-4xl">محصولات منتخب</h2><Link className="font-bold text-blue-600" href="/products">همه محصولات ←</Link></div></Reveal><div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{products.map((product, index) => <Reveal key={product.id} delay={index * 0.08}><ProductCard p={product} /></Reveal>)}</div></Section>

          <Section id="certificates" className="bg-white"><Reveal><h2 className="text-3xl font-extrabold md:text-4xl">گواهینامه‌ها و افتخارات</h2></Reveal><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{certs.map((certificate, index) => <Reveal key={certificate.id} delay={index * 0.08}><Card variant="accent" className="border-gold-500/40"><Placeholder label={certificate.title} /><h3 className="mt-4 font-bold text-white text-center">{certificate.title}</h3></Card></Reveal>)}</div></Section>


          <Section id="contact"><Reveal className="grid gap-10 md:grid-cols-2"><div><p className="text-sm font-bold text-cyan-500">گفت‌وگو با کارشناسان</p><h2 className="mt-2 text-3xl font-extrabold md:text-4xl">تماس با ما</h2><p className="mt-5 leading-8">{content?.address}<br />{content?.phone}<br />{content?.email}</p></div><Card variant="accent"><ContactForm /></Card></Reveal></Section>

        </main>
        <Footer />
      </div>
    </>
  );
}
