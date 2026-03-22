import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

const stats = [
  { label: "الراتب", value: "500$" },
  { label: "المصروف", value: "320$" },
  { label: "المتبقي", value: "180$" },
  { label: "الهدف", value: "شراء هاتف" },
  { label: "المدخر", value: "120$ من 300$" }
];

export function DashboardPreviewSection() {
  return (
    <SectionWrapper id="preview">
      <SectionHeading
        eyebrow="معاينة بسيطة"
        title="لوحة واضحة بدون تعقيد"
        description="هذه مجرد معاينة خفيفة لكيفية عرض المعلومات المهمة للمستخدم داخل MASSARIFY."
      />
      <div className="rounded-[2rem] border border-brand-100 bg-white p-5 shadow-card sm:p-7">
        <div className="mb-5 flex items-center justify-between rounded-[1.5rem] bg-brand-50 px-5 py-4">
          <div>
            <p className="text-sm text-slate-500">الحساب الشهري</p>
            <p className="mt-1 text-lg font-bold text-slate-950">MASSARIFY Dashboard</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-700">
            تجريبي
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[1.25rem] border border-slate-100 bg-surface p-4 text-right"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-lg font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
