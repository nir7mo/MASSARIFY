type SectionHeadingProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="mb-6 max-w-2xl text-right sm:mb-8">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold text-brand-600">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
