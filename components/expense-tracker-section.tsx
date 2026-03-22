"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

type FixedExpense = {
  id: number;
  name: string;
  amount: string;
};

type DailyExpense = {
  id: number;
  day: string;
  title: string;
  category: string;
  amount: string;
};

type DemoState = {
  budget: string;
  selectedDay: string;
  previousMonthSpent: string;
  fixedExpenses: FixedExpense[];
  expenses: DailyExpense[];
};

const storageKey = "massarify-demo-state";

const defaultFixedExpenses: FixedExpense[] = [
  { id: 1, name: "الإيجار", amount: "450" },
  { id: 2, name: "الإنترنت", amount: "120" },
  { id: 3, name: "النقل", amount: "90" }
];

const defaultExpenses: DailyExpense[] = [
  { id: 11, day: "3", title: "فطور", category: "أكل", amount: "45" },
  { id: 12, day: "8", title: "تسوق سريع", category: "تسوق", amount: "110" },
  { id: 13, day: "12", title: "مقهى", category: "ترفيه", amount: "55" }
];

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("ar-DZ", {
    maximumFractionDigits: 0
  }).format(value)} دج`;
}

function getDefaultDay() {
  return String(new Date().getDate());
}

function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function ExpenseTrackerSection() {
  const [budget, setBudget] = useState("1400");
  const [selectedDay, setSelectedDay] = useState(getDefaultDay);
  const [previousMonthSpent, setPreviousMonthSpent] = useState("1180");
  const [fixedExpenses, setFixedExpenses] =
    useState<FixedExpense[]>(defaultFixedExpenses);
  const [expenses, setExpenses] = useState<DailyExpense[]>(defaultExpenses);
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("أكل");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const daysInMonth = getDaysInCurrentMonth();

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);

    if (stored) {
      const parsed = JSON.parse(stored) as Partial<DemoState>;

      setBudget(parsed.budget ?? "1400");
      setSelectedDay(parsed.selectedDay ?? getDefaultDay());
      setPreviousMonthSpent(parsed.previousMonthSpent ?? "1180");
      setFixedExpenses(parsed.fixedExpenses ?? defaultFixedExpenses);
      setExpenses(parsed.expenses ?? defaultExpenses);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const state: DemoState = {
      budget,
      selectedDay,
      previousMonthSpent,
      fixedExpenses,
      expenses
    };

    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [budget, selectedDay, previousMonthSpent, fixedExpenses, expenses, hydrated]);

  const fixedTotal = fixedExpenses.reduce(
    (total, item) => total + parseAmount(item.amount),
    0
  );
  const dailyTotal = expenses.reduce(
    (total, item) => total + parseAmount(item.amount),
    0
  );
  const currentMonthSpent = fixedTotal + dailyTotal;
  const budgetValue = parseAmount(budget);
  const remainingBudget = budgetValue - currentMonthSpent;
  const selectedDayNumber = Math.min(Math.max(Number(selectedDay) || 1, 1), daysInMonth);
  const remainingDays = Math.max(daysInMonth - selectedDayNumber, 0);
  const previousMonthValue = parseAmount(previousMonthSpent);
  const averageDailySpend = currentMonthSpent / selectedDayNumber;
  const projectedMonthSpend = averageDailySpend * daysInMonth;
  const dailyAllowance =
    remainingDays > 0 ? Math.max(remainingBudget, 0) / remainingDays : Math.max(remainingBudget, 0);
  const differenceFromLastMonth = currentMonthSpent - previousMonthValue;
  const changeVsLastMonth =
    previousMonthValue > 0 ? (differenceFromLastMonth / previousMonthValue) * 100 : 0;

  const entriesForSelectedDay = useMemo(
    () => expenses.filter((item) => Number(item.day) === selectedDayNumber),
    [expenses, selectedDayNumber]
  );

  const recentEntries = useMemo(
    () => [...expenses].sort((a, b) => Number(b.day) - Number(a.day)).slice(0, 6),
    [expenses]
  );

  function addExpense() {
    if (!expenseName.trim() || parseAmount(expenseAmount) === 0) {
      return;
    }

    setExpenses((current) => [
      ...current,
      {
        id: createId(),
        day: String(selectedDayNumber),
        title: expenseName.trim(),
        category: expenseCategory,
        amount: expenseAmount
      }
    ]);

    setExpenseName("");
    setExpenseAmount("");
  }

  function updateFixedExpense(id: number, field: "name" | "amount", value: string) {
    setFixedExpenses((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function removeFixedExpense(id: number) {
    setFixedExpenses((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current
    );
  }

  function removeDailyExpense(id: number) {
    setExpenses((current) => current.filter((item) => item.id !== id));
  }

  function addFixedExpense() {
    setFixedExpenses((current) => [
      ...current,
      { id: createId(), name: "مصروف ثابت", amount: "" }
    ]);
  }

  const summaryCards = [
    {
      label: "المتبقي من الميزانية",
      value: formatCurrency(remainingBudget),
      highlight: remainingBudget < 0
    },
    {
      label: "المتبقي من الأيام",
      value: `${remainingDays} يوم`
    },
    {
      label: "المصروف الحالي هذا الشهر",
      value: formatCurrency(currentMonthSpent)
    },
    {
      label: "المتوسط اليومي",
      value: formatCurrency(averageDailySpend)
    },
    {
      label: "التوقع حتى نهاية الشهر",
      value: formatCurrency(projectedMonthSpend)
    },
    {
      label: "المتاح يوميًا لبقية الشهر",
      value: formatCurrency(dailyAllowance)
    }
  ];

  return (
    <SectionWrapper className="pb-14 pt-6 sm:pb-20 sm:pt-10">
      <div className="mb-6 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-right">
            <div className="mb-3 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              صفحة التجربة
            </div>
            <SectionHeading
              title="سجّل مصروف يومك وشاهد أثره على الشهر كاملًا"
              description="اختَر يومًا من الشهر، أضف مصاريفك لذلك اليوم، وسنحسب لك مباشرة الميزانية المتبقية، الأيام المتبقية، والتغير مقارنة بالشهر الماضي."
            />
          </div>
          <Link
            href="/"
            className="inline-flex rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-500"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-card">
            <h3 className="text-right text-lg font-bold text-slate-950">إعدادات الشهر</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <label className="text-right">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  الميزانية الشهرية
                </span>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                />
              </label>
              <label className="text-right">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  اليوم من الشهر
                </span>
                <input
                  type="number"
                  min="1"
                  max={daysInMonth}
                  value={selectedDay}
                  onChange={(event) => setSelectedDay(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                />
              </label>
              <label className="text-right">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  مصروف الشهر الماضي
                </span>
                <input
                  type="number"
                  min="0"
                  value={previousMonthSpent}
                  onChange={(event) => setPreviousMonthSpent(event.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-right">
                <h3 className="text-lg font-bold text-slate-950">المصاريف الثابتة</h3>
                <p className="mt-1 text-sm text-slate-500">
                  بنود تتكرر كل شهر مثل الإيجار والاشتراكات.
                </p>
              </div>
              <button
                type="button"
                onClick={addFixedExpense}
                className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700"
              >
                إضافة مصروف ثابت
              </button>
            </div>
            <div className="space-y-3">
              {fixedExpenses.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-[1.25rem] bg-surface p-4 sm:grid-cols-[1fr_140px_90px]"
                >
                  <input
                    type="text"
                    value={item.name}
                    onChange={(event) =>
                      updateFixedExpense(item.id, "name", event.target.value)
                    }
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-right outline-none transition focus:border-brand-500"
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.amount}
                    onChange={(event) =>
                      updateFixedExpense(item.id, "amount", event.target.value)
                    }
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-right outline-none transition focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFixedExpense(item.id)}
                    className="h-11 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
            <div className="text-right">
              <h3 className="text-lg font-bold text-slate-950">
                تسجيل مصروف لليوم {selectedDayNumber}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                كل إضافة تنعكس مباشرة في التحليل الشهري على يمين الصفحة.
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <input
                type="text"
                value={expenseName}
                onChange={(event) => setExpenseName(event.target.value)}
                placeholder="مثال: غداء"
                className="h-11 rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
              />
              <select
                value={expenseCategory}
                onChange={(event) => setExpenseCategory(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
              >
                <option value="أكل">أكل</option>
                <option value="تنقل">تنقل</option>
                <option value="تسوق">تسوق</option>
                <option value="ترفيه">ترفيه</option>
                <option value="فاتورة">فاتورة</option>
                <option value="أخرى">أخرى</option>
              </select>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  value={expenseAmount}
                  onChange={(event) => setExpenseAmount(event.target.value)}
                  placeholder="المبلغ"
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addExpense}
                  className="h-11 shrink-0 rounded-2xl bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
                >
                  إضافة
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">
                  مصاريف اليوم {selectedDayNumber}
                </p>
                <p className="text-sm text-slate-500">
                  {formatCurrency(
                    entriesForSelectedDay.reduce(
                      (total, item) => total + parseAmount(item.amount),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="space-y-2">
                {entriesForSelectedDay.length > 0 ? (
                  entriesForSelectedDay.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"
                    >
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-700">
                          {formatCurrency(parseAmount(item.amount))}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDailyExpense(item.id)}
                          className="text-sm font-semibold text-slate-400 transition hover:text-red-600"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-white px-4 py-5 text-right text-sm text-slate-500">
                    لا توجد مصاريف مسجلة لهذا اليوم بعد.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-card">
            <div className="rounded-[1.5rem] bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-700">التحليل اللحظي</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                كيف يبدو هذا الشهر حتى الآن؟
              </h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.25rem] border border-slate-100 bg-surface p-4 text-right"
                >
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p
                    className={`mt-3 text-xl font-bold ${
                      card.highlight ? "text-red-600" : "text-slate-950"
                    }`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="text-right text-lg font-bold text-slate-950">
              مقارنة بالشهر الماضي
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
                <span className="text-sm font-medium text-slate-600">مصروف الشهر الماضي</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(previousMonthValue)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
                <span className="text-sm font-medium text-slate-600">الفرق الحالي</span>
                <span
                  className={`font-bold ${
                    differenceFromLastMonth > 0 ? "text-red-600" : "text-brand-700"
                  }`}
                >
                  {differenceFromLastMonth > 0 ? "+" : ""}
                  {formatCurrency(differenceFromLastMonth)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
                <span className="text-sm font-medium text-slate-600">نسبة التغير</span>
                <span
                  className={`font-bold ${
                    changeVsLastMonth > 0 ? "text-red-600" : "text-brand-700"
                  }`}
                >
                  {changeVsLastMonth > 0 ? "+" : ""}
                  {changeVsLastMonth.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
            <h3 className="text-right text-lg font-bold text-slate-950">آخر العمليات في الشهر</h3>
            <div className="mt-4 space-y-2">
              {recentEntries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3"
                >
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">
                      اليوم {item.day} · {item.category}
                    </p>
                  </div>
                  <span className="font-bold text-brand-700">
                    {formatCurrency(parseAmount(item.amount))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
