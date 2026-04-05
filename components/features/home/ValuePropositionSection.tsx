"use client";

import { useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const valueProps = [
  {
    number: "01",
    title: "Unprecedented Access",
    description:
      "Vote from anywhere, on any device. No barriers, no complexity — just participation.",
  },
  {
    number: "02",
    title: "Military-Grade Security",
    description:
      "End-to-end encryption and tamper-proof systems ensure every vote counts, every time.",
  },
  {
    number: "03",
    title: "Effortless Efficiency",
    description:
      "Real-time results, automated tallying, zero manual counting. Focus on your event.",
  },
];

const stats = [
  { value: 10000, decimalPlaces: 0, suffix: "+", label: "VOTES CAST" },
  { value: 99.9, decimalPlaces: 1, suffix: "%", label: "UPTIME" },
  { value: 50, decimalPlaces: 0, suffix: "+", label: "EVENTS POWERED" },
];

const ValuePropositionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="value-prop-section"
      className="bg-primary text-primary-foreground feature-no py-20 md:py-28"
    >
      {/* Section label */}
      <div className="mb-16">
        <span className="text-xs tracking-[0.25em] font-mono text-primary-foreground/40">
          WHY AIMS ACHIEVERS NETWORK
        </span>
      </div>

      {/* Two-column editorial layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-16 md:gap-24 mb-16 md:mb-20">
        {/* Left: Headline + subtext */}
        <div className="flex flex-col justify-between gap-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.05]">
            Transform the way campus events crown their champions.
          </h2>
          <p className="text-base md:text-lg font-light text-primary-foreground/55 max-w-md leading-relaxed">
            Secure, transparent digital voting built for Ghanaian campus events
            and award shows. No paper ballots. No manual counting. Just results
            your audience trusts.
          </p>
        </div>

        {/* Right: Numbered value props */}
        <div className="flex flex-col justify-center divide-y divide-primary-foreground/10">
          {valueProps.map((prop) => (
            <div key={prop.number} className="py-8 first:pt-0 last:pb-0">
              <div className="flex gap-6">
                <span className="text-xs font-mono text-primary-foreground/25 shrink-0 pt-1">
                  {prop.number}
                </span>
                <div>
                  <h3 className="text-lg md:text-xl font-serif font-light tracking-wide mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-sm font-light text-primary-foreground/50 leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="pt-0 mb-14">
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-light tabular-nums flex">
                {isVisible ? (
                  <NumberTicker
                    value={stat.value}
                    decimalPlaces={stat.decimalPlaces}
                    className="tabular-nums"
                  />
                ) : (
                  <span className="opacity-0">0</span>
                )}
                <span>{stat.suffix}</span>
              </div>
              <div className="text-xs tracking-[0.2em] text-primary-foreground/35 mt-1 font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Button variant="secondary" size="lg" asChild>
          <Link href="/events">View Events</Link>
        </Button>
        <Button
          size="lg"
          className="bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
          asChild
        >
          <Link href="#features">See How It Works</Link>
        </Button>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
