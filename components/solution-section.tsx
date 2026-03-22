import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

const solutions = [
  "تسجيل سريع للمصاريف",
  "معرفة الضروري وغير الضروري",
  "خطة ادخار لهدفك القادم"
];

export function SolutionSection() {
  return (
    <SectionWrapper id="solution">
      <div className="rounded-[2rem] bg-surface px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="الحل"
          title="MASSARIFY يجعل الصورة أوضح"
          description="بدل التخمين، تحصل على خطوات بسيطة تساعدك تتابع مصروفك وتعرف ما يمكن تقليله وتبدأ الادخار بثبات."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {solutions.map((solution) => (
            <article
              key={solution}
              className="rounded-[1.5rem] border border-brand-100 bg-white p-6 text-right"
            >
              <div className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                ميزة
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{solution}</h3>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
