import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "MASSARIFY",
  description: "صفحة تعريفية عربية بسيطة لفكرة MASSARIFY لتنظيم المصاريف والادخار."
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
