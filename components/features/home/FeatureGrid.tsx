"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Zap,
  Smartphone,
  BarChart3,
  Users,
  Layers,
  SlidersHorizontal,
  CreditCard,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Voting",
    description:
      "Military-grade encryption and tamper-proof systems ensure every vote is protected and verified. Your data security is our top priority.",
    size: "large",
    stat: "256-bit",
    statLabel: "Encryption",
  },
  {
    icon: Zap,
    title: "Real-Time Results",
    description:
      "Watch votes come in live with instant updates and beautiful visualizations.",
    size: "medium",
    stat: "<1s",
    statLabel: "Update Time",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Optimized experience on any device. Vote from anywhere, anytime.",
    size: "small",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Comprehensive insights into voting patterns, engagement rates, and participant demographics.",
    size: "medium",
    stat: "50+",
    statLabel: "Metrics",
  },
  {
    icon: Users,
    title: "Nominee Management",
    description: "Streamlined candidate registration and profile management.",
    size: "small",
  },
  {
    icon: Layers,
    title: "Category Organization",
    description: "Flexible award categories and custom voting rules.",
    size: "small",
  },
  {
    icon: SlidersHorizontal,
    title: "Admin Controls",
    description:
      "Powerful dashboard with granular control over every aspect of your voting event.",
    size: "medium",
  },
  {
    icon: CreditCard,
    title: "Payment Integration",
    description: "Seamless payment processing for premium features and event fees.",
    size: "small",
  },
];

function Icon({ icon: IconComponent, className }: { icon: LucideIcon; className: string }) {
  return <IconComponent className={className} strokeWidth={1.5} />;
}

const FeatureGridBento = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      setTimeout(() => {
        if (!card) return;
        card.style.transition =
          "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 80 + 200);
    });
  }, [isVisible]);

  const cardBase =
    "group relative border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 transition-all duration-500 cursor-pointer";

  const iconSm = "w-10 h-10 sm:w-12 sm:h-12 text-foreground/60 group-hover:text-foreground transition-colors duration-500 mb-4";
  const iconMd = "w-10 h-10 sm:w-12 sm:h-12 text-foreground/60 group-hover:text-foreground transition-colors duration-500 mb-6";
  const iconLg = "w-12 h-12 sm:w-16 sm:h-16 text-foreground/60 group-hover:text-foreground transition-colors duration-500 mb-8";
  const underline = "absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-700 ease-out";

  return (
    <section
      ref={sectionRef}
      id="features"
      className="min-h-screen bg-background text-foreground feature-no py-20 sm:py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-tight mb-4">
            Everything you need to run
            <br />
            <span className="opacity-60">successful voting events</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 sm:gap-6">

          {/* Large — Secure Voting (spans 2 cols + 2 rows) */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className={`${cardBase} sm:col-span-2 lg:row-span-2`}
          >
            <div className="h-full flex flex-col justify-between p-8 sm:p-10 min-h-[400px] lg:min-h-[500px]">
              <div>
                <Icon icon={features[0].icon} className={iconLg} />
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light font-serif tracking-wide mb-4 leading-tight">
                  {features[0].title}
                </h3>
                <p className="text-base sm:text-lg font-light opacity-70 leading-relaxed mb-8">
                  {features[0].description}
                </p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <div className="text-4xl sm:text-5xl font-light mb-2">{features[0].stat}</div>
                <div className="text-sm tracking-widest opacity-60">{features[0].statLabel}</div>
              </div>
            </div>
            <div className={`${underline} h-0.5`} />
          </div>

          {/* Medium — Real-Time Results */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className={`${cardBase} sm:col-span-2`}
          >
            <div className="h-full flex flex-col justify-between p-6 sm:p-8 min-h-[240px]">
              <div>
                <Icon icon={features[1].icon} className={iconMd} />
                <h3 className="text-xl sm:text-2xl font-light font-serif tracking-wide mb-3 leading-tight">
                  {features[1].title}
                </h3>
                <p className="text-sm sm:text-base font-light opacity-70 leading-relaxed">
                  {features[1].description}
                </p>
              </div>
              <div className="border-t border-border/30 pt-4 mt-6">
                <div className="text-3xl font-light mb-1">{features[1].stat}</div>
                <div className="text-xs tracking-widest opacity-60">{features[1].statLabel}</div>
              </div>
            </div>
            <div className={underline} />
          </div>

          {/* Small — Mobile-First */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className={cardBase}
          >
            <div className="h-full flex flex-col p-6 min-h-[200px]">
              <Icon icon={features[2].icon} className={iconSm} />
              <h3 className="text-lg sm:text-xl font-light font-serif tracking-wide mb-2 leading-tight">
                {features[2].title}
              </h3>
              <p className="text-sm font-light opacity-70 leading-relaxed">
                {features[2].description}
              </p>
            </div>
            <div className={underline} />
          </div>

          {/* Small — Nominee Management */}
          <div
            ref={(el) => { cardsRef.current[3] = el; }}
            className={cardBase}
          >
            <div className="h-full flex flex-col p-6 min-h-[200px]">
              <Icon icon={features[4].icon} className={iconSm} />
              <h3 className="text-lg sm:text-xl font-light font-serif tracking-wide mb-2 leading-tight">
                {features[4].title}
              </h3>
              <p className="text-sm font-light opacity-70 leading-relaxed">
                {features[4].description}
              </p>
            </div>
            <div className={underline} />
          </div>

          {/* Medium — Detailed Analytics */}
          <div
            ref={(el) => { cardsRef.current[4] = el; }}
            className={`${cardBase} sm:col-span-2`}
          >
            <div className="h-full flex flex-col justify-between p-6 sm:p-8 min-h-60">
              <div>
                <Icon icon={features[3].icon} className={iconMd} />
                <h3 className="text-xl sm:text-2xl font-light font-serif tracking-wide mb-3 leading-tight">
                  {features[3].title}
                </h3>
                <p className="text-sm sm:text-base font-light opacity-70 leading-relaxed">
                  {features[3].description}
                </p>
              </div>
              <div className="border-t border-border/30 pt-4 mt-6">
                <div className="text-3xl font-light mb-1">{features[3].stat}</div>
                <div className="text-xs tracking-widest opacity-60">{features[3].statLabel}</div>
              </div>
            </div>
            <div className={underline} />
          </div>

          {/* Small — Category Organization */}
          <div
            ref={(el) => { cardsRef.current[5] = el; }}
            className={cardBase}
          >
            <div className="h-full flex flex-col p-6 min-h-[200px]">
              <Icon icon={features[5].icon} className={iconSm} />
              <h3 className="text-lg sm:text-xl font-light font-serif tracking-wide mb-2 leading-tight">
                {features[5].title}
              </h3>
              <p className="text-sm font-light opacity-70 leading-relaxed">
                {features[5].description}
              </p>
            </div>
            <div className={underline} />
          </div>

          {/* Small — Payment Integration */}
          <div
            ref={(el) => { cardsRef.current[6] = el; }}
            className={cardBase}
          >
            <div className="h-full flex flex-col p-6 min-h-[200px]">
              <Icon icon={features[7].icon} className={iconSm} />
              <h3 className="text-lg sm:text-xl font-light font-serif tracking-wide mb-2 leading-tight">
                {features[7].title}
              </h3>
              <p className="text-sm font-light opacity-70 leading-relaxed">
                {features[7].description}
              </p>
            </div>
            <div className={underline} />
          </div>

          {/* Medium — Admin Controls */}
          <div
            ref={(el) => { cardsRef.current[7] = el; }}
            className={`${cardBase} sm:col-span-2`}
          >
            <div className="h-full flex flex-col justify-between p-6 sm:p-8 min-h-[240px]">
              <div>
                <Icon icon={features[6].icon} className={iconMd} />
                <h3 className="text-xl sm:text-2xl font-light font-serif tracking-wide mb-3 leading-tight">
                  {features[6].title}
                </h3>
                <p className="text-sm sm:text-base font-light opacity-70 leading-relaxed">
                  {features[6].description}
                </p>
              </div>
            </div>
            <div className={underline} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureGridBento;
