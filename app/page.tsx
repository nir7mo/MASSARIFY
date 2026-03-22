import { DashboardPreviewSection } from "@/components/dashboard-preview-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";

export default function Home() {
  return (
    <main id="hero">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <DashboardPreviewSection />
      <PricingSection />
      <FinalCtaSection />
    </main>
  );
}
