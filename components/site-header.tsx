import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-brand-100 bg-white/90 px-5 py-3 shadow-card backdrop-blur">
        <Link href="/" className="text-lg font-black tracking-wide text-slate-950">
          MASSARIFY
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#solution" className="transition hover:text-brand-700">
            المزايا
          </Link>
          <Link href="/#preview" className="transition hover:text-brand-700">
            المعاينة
          </Link>
          <Link href="/demo" className="transition hover:text-brand-700">
            التجربة
          </Link>
        </nav>
        <Link
          href="/demo"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          جرّب الآن
        </Link>
      </div>
    </header>
  );
}
