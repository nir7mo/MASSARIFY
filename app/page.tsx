import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { ProblemSection } from "@/components/problem-section";
import { SiteHeader } from "@/components/site-header";
import { SolutionSection } from "@/components/solution-section";
import { ValuePropsSection } from "@/components/value-props-section";

export default function Home() {
  return (
    <main id="hero">
      <SiteHeader />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ValuePropsSection />
      <DashboardPreviewSection />
      <PricingSection />
      <FinalCtaSection />
    </main>
  );
}
