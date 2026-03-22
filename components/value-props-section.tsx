import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

const valueProps = [
  {
    title: "تسجيل يومي بسيط",
    description: "حدّد اليوم من الشهر وأضف مصروفك في ثوانٍ بدون خطوات معقدة."
  },
  {
    title: "تحليل شهري واضح",
    description: "اعرف كم صرفت، كم بقي لك، وكم يوم تبقى حتى نهاية الشهر."
  },
  {
    title: "مقارنة ذكية",
    description: "شاهد استهلاكك مقارنة بالشهر الماضي لتعرف إن كنت تتحسن فعلًا."
  }
];

export function ValuePropsSection() {
  return (
    <SectionWrapper id="features">
      <SectionHeading
        eyebrow="لماذا MASSARIFY"
        title="فكرة بسيطة لكن نتيجتها عملية جدًا"
        description="بدل أن تبقى المصاريف مبعثرة في ذهنك أو في ملاحظات متفرقة، MASSARIFY يجمعها لك في تجربة خفيفة تعطيك قرارًا أوضح."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {valueProps.map((item, index) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-slate-100 bg-white p-6 text-right shadow-card"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-lg font-bold text-brand-700">
              {index + 1}
            </div>
            <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}
