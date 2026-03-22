import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

const stats = [
  { label: "الميزانية الشهرية", value: "1400 دج" },
  { label: "مصروف اليوم 12", value: "120 دج" },
  { label: "إجمالي المصروف", value: "860 دج" },
  { label: "المتبقي", value: "540 دج" },
  { label: "أقل من الشهر الماضي", value: "8%" }
];

export function DashboardPreviewSection() {
  return (
    <SectionWrapper id="preview">
      <SectionHeading
        eyebrow="معاينة بسيطة"
        title="لوحة شهرية مفهومة من أول نظرة"
        description="الفكرة ليست مجرد إدخال مصاريف، بل تحويلها إلى أرقام تساعدك تعرف وضعك الآن وما الذي قد يحدث حتى نهاية الشهر."
      />
      <div className="rounded-[2rem] border border-brand-100 bg-white p-5 shadow-card sm:p-7">
        <div className="mb-5 flex items-center justify-between rounded-[1.5rem] bg-brand-50 px-5 py-4">
          <div>
            <p className="text-sm text-slate-500">الحساب الشهري</p>
            <p className="mt-1 text-lg font-bold text-slate-950">MASSARIFY Dashboard</p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-700">
            لحظي
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
