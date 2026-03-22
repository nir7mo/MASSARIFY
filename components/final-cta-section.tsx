import Link from "next/link";

import { SectionWrapper } from "@/components/section-wrapper";

export function FinalCtaSection() {
  return (
    <SectionWrapper id="cta" className="pb-14 sm:pb-20">
      <div className="rounded-[2rem] bg-brand-700 px-6 py-10 text-right text-white sm:px-10">
        <p className="text-sm font-semibold text-brand-100">ابدأ من اليوم</p>
        <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          افتح صفحة التجربة وسجّل أول يوم من مصاريفك
        </h2>
        <Link
          href="/demo"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-base font-semibold text-brand-700 transition hover:bg-brand-50"
        >
          انتقل إلى التجربة
        </Link>
      </div>
    </SectionWrapper>
  );
}
