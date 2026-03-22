"use client";

import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

type ExpenseItem = {
  id: number;
  name: string;
  amount: string;
};

const initialFixedExpenses: ExpenseItem[] = [
  { id: 1, name: "الإيجار", amount: "120" },
  { id: 2, name: "الإنترنت", amount: "25" },
  { id: 3, name: "النقل", amount: "40" }
];

const initialVariableExpenses: ExpenseItem[] = [
  { id: 4, name: "الأكل", amount: "80" },
  { id: 5, name: "التسوق", amount: "35" }
];

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function sumExpenses(items: ExpenseItem[]) {
  return items.reduce((total, item) => total + parseAmount(item.amount), 0);
}

function formatCurrency(value: number) {
  return `${value.toFixed(0)}$`;
}

type ExpenseListProps = {
  items: ExpenseItem[];
  title: string;
  hint: string;
  accentClassName: string;
  onAdd: () => void;
  onChange: (id: number, field: "name" | "amount", value: string) => void;
  onRemove: (id: number) => void;
};

function ExpenseList({
  items,
  title,
  hint,
  accentClassName,
  onAdd,
  onChange,
  onRemove
}: ExpenseListProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-right">
          <h3 className="text-lg font-bold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{hint}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${accentClassName}`}
        >
          إضافة بند
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid gap-3 rounded-[1.25rem] bg-surface p-4 sm:grid-cols-[1fr_140px_90px]"
          >
            <input
              type="text"
              value={item.name}
              onChange={(event) => onChange(item.id, "name", event.target.value)}
              placeholder="اسم المصروف"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-right outline-none transition focus:border-brand-500"
            />
            <input
              type="number"
              min="0"
              step="1"
              value={item.amount}
              onChange={(event) => onChange(item.id, "amount", event.target.value)}
              placeholder="0"
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-right outline-none transition focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="h-11 rounded-2xl border border-transparent bg-white px-4 text-sm font-semibold text-slate-500 transition hover:border-slate-200 hover:text-slate-700"
            >
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExpenseTrackerSection() {
  const [salary, setSalary] = useState("500");
  const [fixedExpenses, setFixedExpenses] =
    useState<ExpenseItem[]>(initialFixedExpenses);
  const [variableExpenses, setVariableExpenses] =
    useState<ExpenseItem[]>(initialVariableExpenses);

  const nextId = useMemo(() => {
    const ids = [...fixedExpenses, ...variableExpenses].map((item) => item.id);
    return (Math.max(0, ...ids) || 0) + 1;
  }, [fixedExpenses, variableExpenses]);

  const fixedTotal = sumExpenses(fixedExpenses);
  const variableTotal = sumExpenses(variableExpenses);
  const monthlyTotal = fixedTotal + variableTotal;
  const remaining = parseAmount(salary) - monthlyTotal;
  const spendingRate =
    parseAmount(salary) > 0 ? Math.min((monthlyTotal / parseAmount(salary)) * 100, 100) : 0;

  const updateItems = (
    items: ExpenseItem[],
    id: number,
    field: "name" | "amount",
    value: string
  ) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item));

  return (
    <SectionWrapper id="calculator">
      <div className="rounded-[2rem] bg-surface px-6 py-8 sm:px-8">
        <SectionHeading
          eyebrow="قالب الحساب الشهري"
          title="حددي مصاريفك وسيتم الحساب مباشرة"
          description="هذا قالب بسيط لتسجيل المصاريف الشهرية مع تحديث لحظي للإجمالي والمتبقي، ويشمل المصاريف الثابتة مثل الإيجار."
        />

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-card">
              <label className="mb-3 block text-right text-sm font-semibold text-slate-700">
                الراتب الشهري
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={salary}
                onChange={(event) => setSalary(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right text-lg font-semibold outline-none transition focus:border-brand-500"
              />
              <p className="mt-3 text-sm text-slate-500">
                يتم تحديث النتائج لحظيًا بمجرد تعديل الراتب أو أي مصروف.
              </p>
            </div>

            <ExpenseList
              items={fixedExpenses}
              title="المصاريف الثابتة"
              hint="مثل الإيجار، الإنترنت، النقل أو أي بند يتكرر كل شهر."
              accentClassName="bg-brand-50 text-brand-700"
              onAdd={() =>
                setFixedExpenses((current) => [
                  ...current,
                  { id: nextId, name: "مصروف ثابت", amount: "" }
                ])
              }
              onChange={(id, field, value) =>
                setFixedExpenses((current) => updateItems(current, id, field, value))
              }
              onRemove={(id) =>
                setFixedExpenses((current) =>
                  current.length > 1 ? current.filter((item) => item.id !== id) : current
                )
              }
            />

            <ExpenseList
              items={variableExpenses}
              title="المصاريف المتغيرة"
              hint="مثل الأكل، التسوق، الخروج أو أي مصروف يتغير من شهر إلى آخر."
              accentClassName="bg-white text-brand-700 ring-1 ring-inset ring-brand-200"
              onAdd={() =>
                setVariableExpenses((current) => [
                  ...current,
                  { id: nextId, name: "مصروف متغير", amount: "" }
                ])
              }
              onChange={(id, field, value) =>
                setVariableExpenses((current) => updateItems(current, id, field, value))
              }
              onRemove={(id) =>
                setVariableExpenses((current) =>
                  current.length > 1 ? current.filter((item) => item.id !== id) : current
                )
              }
            />
          </div>

          <div className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-card">
            <div className="rounded-[1.5rem] bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">ملخص الشهر الحالي</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                صورة واضحة لمصاريفك
              </h3>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ["إجمالي المصاريف الثابتة", formatCurrency(fixedTotal)],
                ["إجمالي المصاريف المتغيرة", formatCurrency(variableTotal)],
                ["إجمالي المصروف الشهري", formatCurrency(monthlyTotal)],
                ["المتبقي من الراتب", formatCurrency(remaining)],
                ["نسبة الإنفاق", `${spendingRate.toFixed(0)}%`]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-surface px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-600">{label}</span>
                  <span
                    className={`text-base font-bold ${
                      label === "المتبقي من الراتب" && remaining < 0
                        ? "text-red-600"
                        : "text-slate-900"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-dashed border-brand-200 p-4 text-right">
              <p className="text-sm font-semibold text-slate-800">ملاحظة سريعة</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                إذا صار المتبقي بالسالب، فهذا يعني أن مجموع المصاريف أعلى من الراتب الشهري
                وتحتاجين تقليل بعض البنود أو رفع هدف الادخار لاحقًا.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
