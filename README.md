# MASSARIFY

واجهة عربية بسيطة لفكرة SaaS اسمها **MASSARIFY** مبنية بـ **Next.js + TypeScript + Tailwind CSS**.

الصفحة تعرض:
- قسم تعريفي رئيسي
- المشكلة
- الحل
- معاينة Dashboard بسيطة
- قالب لحساب المصاريف الشهرية مع تحديث لحظي
- الأسعار
- دعوة أخيرة للتجربة

## المتطلبات

- Node.js 18.18 أو أحدث
- npm

## التشغيل محليًا

```bash
npm install
npm run dev
```

ثم افتح:

```bash
http://localhost:3000
```

## أوامر المشروع

```bash
npm run dev
npm run build
npm start
```

## النشر على GitHub و Railway

1. ارفع المشروع إلى مستودع GitHub.
2. في Railway اختر `New Project`.
3. اربط مستودع GitHub الخاص بالمشروع.
4. Railway سيستخدم الإعدادات الموجودة في `railway.json`.
5. أمر التشغيل في الإنتاج هو:

```bash
npm start
```

## هيكل المشروع

```text
MASSARIFY/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ dashboard-preview-section.tsx
│  ├─ final-cta-section.tsx
│  ├─ hero-section.tsx
│  ├─ pricing-section.tsx
│  ├─ problem-section.tsx
│  ├─ section-heading.tsx
│  ├─ section-wrapper.tsx
│  └─ solution-section.tsx
├─ .gitignore
├─ next.config.ts
├─ next-env.d.ts
├─ package.json
├─ postcss.config.js
├─ railway.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```
