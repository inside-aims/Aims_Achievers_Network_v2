import FeatureGridBento from "@/components/home/FeatureGrid";
import ScrollTextMarquee from "@/components/home/ScrollTextMarquee";
import StackingCardsHero from "@/components/home/StackingCards";
import ValuePropositionSection from "@/components/home/ValuePropositionSection";

export default function Home() {
  return (
      <main>
        <StackingCardsHero />
        <ValuePropositionSection />
        <ScrollTextMarquee />
        <FeatureGridBento />
      </main>
  );
}
