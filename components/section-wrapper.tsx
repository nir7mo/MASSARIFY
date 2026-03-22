type SectionWrapperProps = Readonly<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}>;

export function SectionWrapper({
  children,
  className = "",
  id
}: SectionWrapperProps) {
  return (
    <section id={id} className={`px-4 py-10 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
