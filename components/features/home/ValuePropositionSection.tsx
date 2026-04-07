"use client";

import { useEffect, useRef, useState } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const valueProps = [
  {
    number: "01",
    title: "Unprecedented Access",
    description:
      "Vote from anywhere, on any device. No barriers, no complexity - just participation that reaches every corner of campus.",
  },
  {
    number: "02",
    title: "Military-Grade Security",
    description:
      "256-bit encryption and tamper-proof systems ensure every vote counts, every time. Zero disputes since launch.",
  },
  {
    number: "03",
    title: "Effortless Efficiency",
    description:
      "Real-time results, automated tallying, zero manual counting. Focus on the event - not the ballot box.",
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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="value-prop-section"
      className="bg-primary text-primary-foreground feature-no py-20 md:py-28 relative overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      <div className="relative z-10">

        {/* Label row */}
        <div className="mb-14 md:mb-16 flex items-center gap-6">
          <span className="text-xs tracking-[0.25em] font-mono text-primary-foreground/30 shrink-0">
            WHY AIMS ACHIEVERS NETWORK
          </span>
          <div className="h-px flex-1 bg-primary-foreground/10" />
        </div>

        {/* Two-column: headline + feature list */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 md:gap-20 mb-0">

          {/* Left: headline + stats + ctas */}
          <div className="flex flex-col justify-between gap-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.0]">
              Transform the way
              <br />
              campus events
              <br />
              crown their{" "}
              <span className="text-secondary italic">champions.</span>
            </h2>

            {/* Stats */}
            <div>
              <div className="grid grid-cols-3 gap-4 pb-10 border-b border-primary-foreground/10">
                {stats.map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-light tabular-nums flex text-secondary">
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
                    <div className="text-[10px] tracking-[0.2em] text-primary-foreground/30 mt-2 font-mono">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-3 pt-10">
                <Button variant="secondary" size="lg" className="w-full sm:flex-1" asChild>
                  <Link href="/events">
                    View Events
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="w-full sm:flex-1 bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
                  asChild
                >
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: numbered value props */}
          <div className="flex flex-col justify-center divide-y divide-primary-foreground/10">
            {valueProps.map((prop) => (
              <div key={prop.number} className="group py-8 first:pt-0 last:pb-0 hover:pl-2 transition-all duration-500">
                <div className="flex gap-6">
                  <span className="text-xs font-mono text-primary-foreground/20 shrink-0 pt-1 group-hover:text-secondary transition-colors duration-500">
                    {prop.number}
                  </span>
                  <div>
                    <h3 className="text-lg md:text-xl font-serif font-light tracking-wide mb-2 group-hover:text-secondary transition-colors duration-500">
                      {prop.title}
                    </h3>
                    <p className="text-sm font-light text-primary-foreground/45 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
