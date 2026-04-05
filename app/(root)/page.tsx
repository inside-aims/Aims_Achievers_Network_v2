import FeatureGridBento from "@/components/features/home/FeatureGrid";
import OurEvents from "@/components/features/home/OurEvents";
import StackingCardsHero from "@/components/features/home/StackingCards";
import TrustedPartners from "@/components/features/home/TrustedPartners";
import ValuePropositionSection from "@/components/features/home/ValuePropositionSection";

export default function Home() {
  return (
    <main>
      <StackingCardsHero />
      {/* z-10 ensures this content paints above the sticky stacking cards (z-index 1–5) */}
      <div className="relative z-10 pt-20">
        <ValuePropositionSection />
        {/*<ScrollBasedVelocityDemo />*/}
        <FeatureGridBento />
        <OurEvents />
        <TrustedPartners />
      </div>
    </main>
  );
}
