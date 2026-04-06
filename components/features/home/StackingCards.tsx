"use client";
import { useTransform, motion, useScroll, MotionValue } from "motion/react";
import { JSX, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleArrowDown } from "lucide-react";

const cards = [
  {
    title: "Secure Voting",
    description:
      "Military-grade 256-bit encryption means every ballot is tamper-proof and permanently verified. Cast your vote with absolute confidence.",
    link: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80",
    color: "#1a2b5e",
    tag: "SECURITY",
  },
  {
    title: "Live Results",
    description:
      "Watch tallies update in real time as votes pour in. No waiting, no announcements - just a live leaderboard that moves with every vote.",
    link: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    color: "#2d1b6e",
    tag: "REAL-TIME",
  },
  {
    title: "Easy Nominations",
    description:
      "Submit nominations in minutes - fill in a profile, upload a photo, and let your nominee's story do the work. Simple, structured, powerful.",
    link: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
    color: "#0d3b5e",
    tag: "NOMINATIONS",
  },
  {
    title: "Campus Events",
    description:
      "From Best Dressed to Academic Excellence - every award category is built to celebrate the talent that lives right on your campus.",
    link: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    color: "#3d1040",
    tag: "EVENTS",
  },
  {
    title: "Partner With Us",
    description:
      "Brands that believe in student excellence belong here. Sponsor events, gain campus visibility, and become part of something students remember.",
    link: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    color: "#5c1d00",
    tag: "PARTNERSHIPS",
  },
];


export default function StackingCardsHero(): JSX.Element {
  return (
    <>
      <section className="relative h-screen w-full bg-primary text-primary-foreground flex flex-col overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

        {/* Watermark */}
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[30vw] font-serif font-bold leading-none tracking-tighter select-none text-primary-foreground/[0.04] pointer-events-none">
          AAN
        </span>

        {/* ── Flex body ── */}
        <div className="relative z-10 flex-1 flex flex-col">

          <div className="feature-no flex-1 flex items-center py-0">
            <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 xl:gap-24 items-center">

              {/* Left: Headline */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light font-serif tracking-tight leading-[0.95]"
                >
                  The awards
                  <br />
                  ceremony
                  <br />
                  starts with
                  <br />
                  <span className="text-secondary italic">your vote.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-8 text-base md:text-lg font-light text-primary-foreground/50 max-w-md leading-relaxed"
                >
                  Secure, transparent digital voting for campus award shows across Ghana.
                  Every vote counts. Every champion is chosen by the community.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="mt-9 flex flex-wrap gap-3"
                >
                  <Button size="lg" variant="secondary" className="flex-1" asChild>
                    <Link href="/events">
                      Browse Events
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
                    asChild
                  >
                    <Link href="/nominations">Nominate Someone</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right: Bordered stats panel (desktop only) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:flex flex-col gap-3"
              >
                {/* Main stat card */}
                <div className="border border-primary-foreground/10 bg-primary-foreground/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-[0.22em] text-primary-foreground/35 uppercase">
                      Total Votes Cast
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="text-6xl font-light tabular-nums text-secondary leading-none">
                    10,247
                  </div>
                  <div className="mt-3 h-px bg-primary-foreground/10" />
                  <div className="mt-3 text-[10px] font-mono text-primary-foreground/30 tracking-wider">
                    AND COUNTING ACROSS ALL ACTIVE EVENTS
                  </div>
                </div>

                {/* Two small cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-primary-foreground/30 uppercase mb-2">
                      Events
                    </div>
                    <div className="text-4xl font-light text-primary-foreground/80">
                      50+
                    </div>
                  </div>
                  <div className="border border-primary-foreground/10 bg-primary-foreground/5 p-5">
                    <div className="text-[10px] font-mono tracking-[0.2em] text-primary-foreground/30 uppercase mb-2">
                      Campuses
                    </div>
                    <div className="text-4xl font-light text-primary-foreground/80">
                      12+
                    </div>
                  </div>
                </div>

                {/* How it works link card */}
                <Link
                  href="/how-it-works"
                  className="group border border-primary-foreground/10 bg-primary-foreground/5 p-5 flex items-center justify-between hover:bg-primary-foreground/10 transition-colors duration-300"
                >
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.2em] text-primary-foreground/30 uppercase mb-1">
                      First time?
                    </div>
                    <div className="text-sm font-light text-primary-foreground/70">
                      See how voting works
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary-foreground/30 group-hover:text-primary-foreground/70 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>

            </div>
          </div>
        </div>

        {/* ── Bottom ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative z-10 border-t border-primary-foreground/10 shrink-0"
        >
          <div className="feature-no py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 sm:gap-10 overflow-hidden">
              {["10,000+ VOTES CAST", "50+ EVENTS POWERED", "99.9% UPTIME", "12+ CAMPUSES"].map(
                (item, i) => (
                  <span key={i} className="text-[10px] font-mono tracking-[0.18em] text-primary-foreground/25 shrink-0">
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <StackingSection />
    </>
  );
}

function StackingSection() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container}>
      {cards.map((card, i) => {
        const targetScale = 1 - (cards.length - 1 - i) * 0.05;
        return (
          <BenefitCard
            key={`card_${i}`}
            i={i}
            url={card.link}
            title={card.title}
            tag={card.tag}
            color={card.color}
            description={card.description}
            progress={scrollYProgress}
            range={[i / cards.length, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

interface BenefitCardProps {
  i: number;
  title: string;
  tag: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  i,
  title,
  tag,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen sticky top-0 flex items-center justify-center"
      style={{ zIndex: i + 1 }}
    >
      <motion.div
        style={{ backgroundColor: color, scale, top: `${i * 22}px` }}
        className="relative flex flex-col h-[460px] sm:h-[500px] md:h-[520px] w-[92%] sm:w-[88%] md:w-[82%] lg:w-[72%] rounded-sm p-7 sm:p-9 md:p-11 origin-top text-white overflow-hidden"
      >
        {/* Large faint number in background */}
        <span className="absolute right-6 top-4 text-[120px] md:text-[160px] font-serif font-bold leading-none text-white/[0.06] select-none pointer-events-none">
          0{i + 1}
        </span>

        {/* Tag + counter */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-white/40 uppercase">
            {tag}
          </span>
          <span className="text-[10px] font-mono text-white/20">
            0{i + 1} / 0{cards.length}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-light font-serif tracking-tight mb-5 sm:mb-7 relative z-10">
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row flex-1 gap-6 lg:gap-10 min-h-0 relative z-10">
          <div className="lg:w-[42%] flex flex-col justify-between">
            <p className="text-sm sm:text-base font-light leading-relaxed text-white/70">
              {description}
            </p>
            <Link
              href="/how-it-works"
              className="mt-5 lg:mt-0 inline-flex items-center gap-2.5 text-sm font-light text-white/50 hover:text-white hover:gap-4 transition-all duration-300"
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative flex-1 lg:w-[58%] rounded-sm overflow-hidden min-h-[100px]">
            <motion.div className="w-full h-full" style={{ scale: imageScale }}>
              <Image
                fill
                src={url}
                alt={title}
                className="object-cover opacity-50"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
