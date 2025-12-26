import FeatureGridBento from "@/components/features/home/FeatureGrid";
import OurEvents from "@/components/features/home/OurEvents";
import ScrollTextMarquee from "@/components/features/home/ScrollTextMarquee";
import StackingCardsHero from "@/components/features/home/StackingCards";
import TrustedPartners from "@/components/features/home/TrustedPartners";
import ValuePropositionSection from "@/components/features/home/ValuePropositionSection";

export default function Home() {
  return (
    <main>
      <StackingCardsHero />
      <ValuePropositionSection />
      <ScrollTextMarquee />
      <FeatureGridBento />
      <OurEvents/>
      <TrustedPartners/>
    </main>
  );
}
