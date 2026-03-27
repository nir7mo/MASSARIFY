"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { SectionWrapper } from "@/components/section-wrapper";

type FixedExpense = { id: number; name: string; amount: string };
type DailyExpense = {
  id: number;
  day: string;
  title: string;
  category: string;
  amount: string;
};
type TrackerState = {
  budget: string;
  selectedDay: string;
  previousMonthSpent: string;
  fixedExpenses: FixedExpense[];
  expenses: DailyExpense[];
};
type LoginMethod = "email" | "phone";
type AuthMode = "register" | "login";
type UserAccount = {
  id: string;
  name: string;
  identifier: string;
  loginMethod: LoginMethod;
  trackerState: TrackerState;
};
type Flash = { type: "success" | "error" | "info"; text: string };

const accountsStorageKey = "massarify-user-accounts";
const sessionStorageKey = "massarify-current-account";
const categories = ["أكل", "تنقل", "تسوق", "ترفيه", "فاتورة", "أخرى"];

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

function getDefaultDay() {
  return String(new Date().getDate());
}

function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function parseAmount(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat("ar-DZ", { maximumFractionDigits: 0 }).format(value)} دج`;
}

function createDefaultTrackerState(): TrackerState {
  return {
    budget: "1400",
    selectedDay: getDefaultDay(),
    previousMonthSpent: "1180",
    fixedExpenses: defaultFixedExpenses.map((item) => ({ ...item })),
    expenses: defaultExpenses.map((item) => ({ ...item }))
  };
}

function normalizeIdentifier(value: string, method: LoginMethod) {
  const trimmed = value.trim();
  return method === "email" ? trimmed.toLowerCase() : trimmed.replace(/[^\d+]/g, "");
}

function isValidIdentifier(value: string, method: LoginMethod) {
  return method === "email"
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    : /^\+?\d{8,15}$/.test(value);
}

function loadAccounts() {
  try {
    const raw = window.localStorage.getItem(accountsStorageKey);
    const parsed = raw ? (JSON.parse(raw) as Record<string, UserAccount>) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {} as Record<string, UserAccount>;
  }
}

function saveAccounts(accounts: Record<string, UserAccount>) {
  window.localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
}

function findAccount(
  accounts: Record<string, UserAccount>,
  identifier: string,
  method: LoginMethod
) {
  return (
    Object.values(accounts).find(
      (account) =>
        account.identifier === identifier && account.loginMethod === method
    ) ?? null
  );
}

export function ExpenseTrackerSection() {
  const [tracker, setTracker] = useState<TrackerState>(createDefaultTrackerState);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [authMethod, setAuthMethod] = useState<LoginMethod>("email");
  const [authName, setAuthName] = useState("");
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState(categories[0]);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(null);
  const [savedAccountsCount, setSavedAccountsCount] = useState(0);
  const [flash, setFlash] = useState<Flash>({
    type: "info",
    text: "أنشئ حسابًا بالبريد الإلكتروني أو رقم الهاتف، وسيتم حفظ كل بياناتك ومصاريفك لهذا الحساب."
  });
  const [hydrated, setHydrated] = useState(false);

  const daysInMonth = getDaysInCurrentMonth();
  const selectedDayNumber = Math.min(Math.max(Number(tracker.selectedDay) || 1, 1), daysInMonth);

  useEffect(() => {
    const accounts = loadAccounts();
    const sessionId = window.localStorage.getItem(sessionStorageKey);
    setSavedAccountsCount(Object.keys(accounts).length);

    if (sessionId && accounts[sessionId]) {
      const account = accounts[sessionId];
      setCurrentAccount(account);
      setTracker(account.trackerState ?? createDefaultTrackerState());
      setFlash({
        type: "success",
        text: `تم فتح حساب ${account.name} واستعادة بياناته المحفوظة.`
      });
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !currentAccount) {
      return;
    }

    const accounts = loadAccounts();
    accounts[currentAccount.id] = { ...currentAccount, trackerState: tracker };
    saveAccounts(accounts);
    setSavedAccountsCount(Object.keys(accounts).length);
  }, [currentAccount?.id, hydrated, tracker]);

  const fixedTotal = tracker.fixedExpenses.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  const dailyTotal = tracker.expenses.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  const currentMonthSpent = fixedTotal + dailyTotal;
  const remainingBudget = parseAmount(tracker.budget) - currentMonthSpent;
  const previousMonthValue = parseAmount(tracker.previousMonthSpent);
  const averageDailySpend = currentMonthSpent / selectedDayNumber;
  const projectedMonthSpend = averageDailySpend * daysInMonth;
  const differenceFromLastMonth = currentMonthSpent - previousMonthValue;
  const entriesForSelectedDay = useMemo(
    () => tracker.expenses.filter((item) => Number(item.day) === selectedDayNumber),
    [selectedDayNumber, tracker.expenses]
  );
  const recentEntries = useMemo(
    () => [...tracker.expenses].sort((a, b) => Number(b.day) - Number(a.day)).slice(0, 5),
    [tracker.expenses]
  );

  function updateTracker<K extends keyof TrackerState>(field: K, value: TrackerState[K]) {
    setTracker((current) => ({ ...current, [field]: value }));
  }

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = normalizeIdentifier(authIdentifier, authMethod);

    if (authMode === "register" && !authName.trim()) {
      setFlash({ type: "error", text: "أدخل اسم المستخدم أولاً." });
      return;
    }

    if (!isValidIdentifier(identifier, authMethod)) {
      setFlash({
        type: "error",
        text: authMethod === "email" ? "أدخل بريدًا إلكترونيًا صحيحًا." : "أدخل رقم هاتف صحيحًا."
      });
      return;
    }

    const accounts = loadAccounts();
    const existingAccount = findAccount(accounts, identifier, authMethod);

    if (authMode === "register") {
      if (existingAccount) {
        setAuthMode("login");
        setFlash({ type: "error", text: "هذا الحساب موجود بالفعل. استخدم تسجيل الدخول." });
        return;
      }

      const newAccount: UserAccount = {
        id: String(createId()),
        name: authName.trim(),
        identifier,
        loginMethod: authMethod,
        trackerState: createDefaultTrackerState()
      };

      accounts[newAccount.id] = newAccount;
      saveAccounts(accounts);
      window.localStorage.setItem(sessionStorageKey, newAccount.id);
      setCurrentAccount(newAccount);
      setTracker(newAccount.trackerState);
      setSavedAccountsCount(Object.keys(accounts).length);
      setAuthName("");
      setAuthIdentifier("");
      setFlash({ type: "success", text: `تم إنشاء حساب ${newAccount.name} بنجاح.` });
      return;
    }

    if (!existingAccount) {
      setAuthMode("register");
      setFlash({ type: "error", text: "لا يوجد حساب بهذه البيانات. أنشئ حسابًا جديدًا أولاً." });
      return;
    }

    window.localStorage.setItem(sessionStorageKey, existingAccount.id);
    setCurrentAccount(existingAccount);
    setTracker(existingAccount.trackerState ?? createDefaultTrackerState());
    setAuthIdentifier("");
    setFlash({ type: "success", text: `مرحبًا بعودتك يا ${existingAccount.name}.` });
  }

  function handleLogout() {
    window.localStorage.removeItem(sessionStorageKey);
    setCurrentAccount(null);
    setTracker(createDefaultTrackerState());
    setAuthMode("login");
    setFlash({ type: "info", text: "تم تسجيل الخروج. يمكنك الدخول إلى حساب آخر الآن." });
  }

  function addFixedExpense() {
    updateTracker("fixedExpenses", [
      ...tracker.fixedExpenses,
      { id: createId(), name: "مصروف ثابت", amount: "" }
    ]);
  }

  function updateFixedExpense(id: number, field: "name" | "amount", value: string) {
    updateTracker(
      "fixedExpenses",
      tracker.fixedExpenses.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function removeFixedExpense(id: number) {
    if (tracker.fixedExpenses.length === 1) {
      setFlash({ type: "info", text: "اترك بندًا ثابتًا واحدًا على الأقل." });
      return;
    }

    updateTracker("fixedExpenses", tracker.fixedExpenses.filter((item) => item.id !== id));
  }

  function addExpense() {
    if (!expenseName.trim() || parseAmount(expenseAmount) === 0) {
      setFlash({ type: "error", text: "أدخل اسم المصروف والمبلغ قبل الإضافة." });
      return;
    }

    updateTracker("expenses", [
      ...tracker.expenses,
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
    setFlash({ type: "success", text: "تم حفظ المصروف داخل حسابك." });
  }

  function removeDailyExpense(id: number) {
    updateTracker("expenses", tracker.expenses.filter((item) => item.id !== id));
  }

  const flashClass =
    flash.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : flash.type === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-brand-200 bg-brand-50 text-brand-700";

  if (!hydrated) {
    return <SectionWrapper className="pb-14 pt-10 text-center">جارٍ تجهيز بيانات المستخدمين...</SectionWrapper>;
  }

  return (
    <SectionWrapper className="pb-14 pt-6 sm:pb-20 sm:pt-10">
      <div className="mb-6 rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-right">
            <div className="mb-3 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              نسخة الحسابات
            </div>
            <SectionHeading
              title="أنشئ حسابك ليُحفظ كل ما تسجله من أرقام ومصاريف"
              description="كل مستخدم يفتح التطبيق يمكنه التسجيل بالبريد الإلكتروني أو رقم الهاتف، وبعدها تبقى بياناته منفصلة عن بقية المستخدمين."
            />
          </div>
          <Link href="/" className="inline-flex rounded-full border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:border-brand-500">
            العودة للرئيسية
          </Link>
        </div>
      </div>

      <div className={`mb-6 rounded-[1.5rem] border px-5 py-4 text-right text-sm font-semibold ${flashClass}`}>
        {flash.text}
      </div>
      {!currentAccount ? (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <form
            onSubmit={handleAuthSubmit}
            className="rounded-[1.75rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8"
          >
            <div className="text-right">
              <h3 className="text-2xl font-bold text-slate-950">
                {authMode === "register" ? "إنشاء حساب جديد" : "تسجيل الدخول"}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {authMode === "register"
                  ? "ابدأ بحساب جديد ليتم حفظ الميزانية والمصاريف اليومية والثابتة باسمك."
                  : "استخدم البريد الإلكتروني أو رقم الهاتف نفسه للوصول إلى بياناتك السابقة."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  authMode === "register" ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"
                }`}
              >
                إنشاء حساب
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  authMode === "login" ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700"
                }`}
              >
                تسجيل الدخول
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {authMode === "register" ? (
                <label className="text-right sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    اسم المستخدم
                  </span>
                  <input
                    type="text"
                    value={authName}
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="مثال: أحمد"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                  />
                </label>
              ) : null}

              <label className="text-right">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  طريقة الدخول
                </span>
                <select
                  value={authMethod}
                  onChange={(event) => setAuthMethod(event.target.value as LoginMethod)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                >
                  <option value="email">البريد الإلكتروني</option>
                  <option value="phone">رقم الهاتف</option>
                </select>
              </label>

              <label className="text-right">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  {authMethod === "email" ? "البريد الإلكتروني" : "رقم الهاتف"}
                </span>
                <input
                  type={authMethod === "email" ? "email" : "tel"}
                  dir={authMethod === "email" ? "ltr" : "rtl"}
                  value={authIdentifier}
                  onChange={(event) => setAuthIdentifier(event.target.value)}
                  placeholder={authMethod === "email" ? "you@example.com" : "+213555000000"}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-brand-500 px-6 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              {authMode === "register" ? "إنشاء الحساب والبدء" : "الدخول إلى الحساب"}
            </button>
          </form>

          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-card sm:p-8">
              <h3 className="text-right text-xl font-bold text-slate-950">
                ماذا سيُحفظ في الحساب؟
              </h3>
              <div className="mt-5 space-y-3 text-right text-sm text-slate-600">
                <div className="rounded-[1.25rem] bg-surface px-4 py-4">
                  الميزانية الشهرية وكل الأرقام التي يحددها المستخدم.
                </div>
                <div className="rounded-[1.25rem] bg-surface px-4 py-4">
                  المصاريف الثابتة مثل الإيجار والاشتراكات.
                </div>
                <div className="rounded-[1.25rem] bg-surface px-4 py-4">
                  المصاريف اليومية حسب اليوم والتصنيف والمبلغ.
                </div>
                <div className="rounded-[1.25rem] bg-surface px-4 py-4">
                  فتح الحساب نفسه تلقائيًا عند العودة من نفس الجهاز.
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-brand-100 bg-white p-6 shadow-card sm:p-8">
              <h3 className="text-right text-xl font-bold text-slate-950">
                حالة هذه النسخة
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-brand-50 p-4 text-right">
                  <p className="text-sm text-brand-700">الحسابات المحفوظة</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">
                    {savedAccountsCount}
                  </p>
                </div>
                <div className="rounded-[1.25rem] bg-surface p-4 text-right">
                  <p className="text-sm text-slate-500">مكان التخزين الحالي</p>
                  <p className="mt-2 font-bold text-slate-950">المتصفح على هذا الجهاز</p>
                </div>
              </div>
              <p className="mt-5 text-right text-sm text-slate-500">
                إذا أردت لاحقًا أن يعمل الحساب نفسه على عدة أجهزة فسأربطه لك بقاعدة
                بيانات ونظام تحقق فعلي عبر البريد أو الرسائل القصيرة.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-right">
                <p className="text-sm font-semibold text-brand-700">الحساب الحالي</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{currentAccount.name}</h3>
                <p className="mt-2 text-sm text-slate-500" dir="ltr">
                  {currentAccount.identifier}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  يتم حفظ كل تعديل تلقائيًا داخل هذا الحساب.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:text-red-600"
              >
                تسجيل الخروج
              </button>
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
                      value={tracker.budget}
                      onChange={(event) => updateTracker("budget", event.target.value)}
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
                      value={tracker.selectedDay}
                      onChange={(event) => updateTracker("selectedDay", event.target.value)}
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
                      value={tracker.previousMonthSpent}
                      onChange={(event) =>
                        updateTracker("previousMonthSpent", event.target.value)
                      }
                      className="h-11 w-full rounded-2xl border border-slate-200 bg-surface px-4 text-right outline-none transition focus:border-brand-500"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
                <div className="mb-5 flex items-center justify-between gap-3">
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
                  {tracker.fixedExpenses.map((item) => (
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
                    كل عملية تحفظ مباشرة داخل الحساب وتظهر فورًا في التحليل.
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
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
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
                          (sum, item) => sum + parseAmount(item.amount),
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
                  {[
                    { label: "المتبقي من الميزانية", value: formatCurrency(remainingBudget), danger: remainingBudget < 0 },
                    { label: "المصروف الحالي", value: formatCurrency(currentMonthSpent), danger: false },
                    { label: "المتوسط اليومي", value: formatCurrency(averageDailySpend), danger: false },
                    { label: "التوقع لنهاية الشهر", value: formatCurrency(projectedMonthSpend), danger: false }
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-[1.25rem] border border-slate-100 bg-surface p-4 text-right"
                    >
                      <p className="text-sm text-slate-500">{card.label}</p>
                      <p className={`mt-3 text-xl font-bold ${card.danger ? "text-red-600" : "text-slate-950"}`}>
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
                    <span className={`font-bold ${differenceFromLastMonth > 0 ? "text-red-600" : "text-brand-700"}`}>
                      {differenceFromLastMonth > 0 ? "+" : ""}
                      {formatCurrency(differenceFromLastMonth)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-card">
                <h3 className="text-right text-lg font-bold text-slate-950">
                  آخر العمليات
                </h3>
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
        </>
      )}
    </SectionWrapper>
  );
}
