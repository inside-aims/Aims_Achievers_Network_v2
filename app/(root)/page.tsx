import FeatureGridBento from "@/components/home/FeatureGrid";
import OurEvents from "@/components/home/OurEvents";
import ScrollTextMarquee from "@/components/home/ScrollTextMarquee";
import StackingCardsHero from "@/components/home/StackingCards";
import TrustedPartners from "@/components/home/TrustedPartners";
import ValuePropositionSection from "@/components/home/ValuePropositionSection";

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
