import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

export function PricingSection() {
  return (
    <SectionWrapper id="pricing">
      <SectionHeading
        eyebrow="الأسعار"
        title="تسعير بسيط وواضح"
        description="ابدأ مجانًا، ثم فعّل الاشتراك البسيط عندما تريد الاستفادة الكاملة من التجربة."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-100 bg-white p-7 shadow-card">
          <p className="text-sm font-semibold text-brand-600">الخطة الأولى</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">مجاني</h3>
          <p className="mt-4 text-slate-600">مثالية لتجربة الفكرة وتتبع المصاريف الأساسية.</p>
        </article>
        <article className="rounded-[1.75rem] border border-brand-200 bg-brand-50 p-7 shadow-card">
          <p className="text-sm font-semibold text-brand-700">الخطة المدفوعة</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">اشتراك بسيط: 1$ شهرياً</h3>
          <p className="mt-4 text-slate-700">وصول سهل ودائم لتنظيم أفضل وادخار أوضح لهدفك القادم.</p>
          <Link
            href="#cta"
            className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600"
          >
            جرّب الآن
          </Link>
        </article>
      </div>
    </SectionWrapper>
  );
}
