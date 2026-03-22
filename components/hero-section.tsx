import Link from "next/link";

import { SectionWrapper } from "@/components/section-wrapper";

export function HeroSection() {
  return (
    <SectionWrapper className="pt-6 sm:pt-10">
      <div className="overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
        <div className="grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="text-right">
            <div className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              MASSARIFY
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              أين تذهب أموالك كل شهر؟
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-slate-600">
              MASSARIFY يساعدك تفهم مصاريفك، تنظم راتبك، وتدخر لهدفك بسهولة.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start">
              <Link
                href="#pricing"
                className="rounded-full bg-brand-500 px-6 py-3 text-center text-base font-semibold text-white transition hover:bg-brand-600"
              >
                ابدأ الآن
              </Link>
              <Link
                href="#preview"
                className="rounded-full border border-brand-200 px-6 py-3 text-center text-base font-semibold text-brand-700 transition hover:border-brand-500 hover:text-brand-600"
              >
                شاهد الفكرة
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-surface p-5 sm:p-6">
            <div className="rounded-[1.25rem] border border-brand-100 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">ملخص هذا الشهر</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    تنظيم بسيط وواضح
                  </p>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                  سهل
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ["الراتب", "500$"],
                  ["المصروف", "320$"],
                  ["المتبقي", "180$"]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3"
                  >
                    <span className="font-medium text-slate-600">{label}</span>
                    <span className="font-bold text-brand-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
