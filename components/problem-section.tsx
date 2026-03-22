import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

const problems = [
  "لا أعرف أين يذهب راتبي",
  "لا أستطيع الادخار",
  "أؤجل مشترياتي كل شهر"
];

export function ProblemSection() {
  return (
    <SectionWrapper id="problem">
      <SectionHeading
        eyebrow="المشكلة"
        title="مشاكل مالية صغيرة تتكرر كل شهر"
        description="الكثير من الناس يعرفون أنهم يصرفون كثيرًا، لكنهم لا يملكون صورة واضحة لما يحدث فعلًا."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((problem) => (
          <article
            key={problem}
            className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-right shadow-card"
          >
            <div className="mb-4 h-11 w-11 rounded-2xl bg-brand-50" />
            <h3 className="text-lg font-semibold text-slate-900">{problem}</h3>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
