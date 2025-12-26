"use client";

import React, { useEffect, useState } from "react";
import ButtonArrow from "../../layout/ButtonArrow";
import ShiningButton from "../../layout/ShinningButton";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Highlighter } from "@/components/ui/highlighter";

const ValuePropositionSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("value-prop-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const valueProps = [
    {
      number: "01",
      title: "Unprecedented Accessibility",
      description:
        "Vote from anywhere, on any device. Break down geographical barriers and reach every participant, every time.",
    },
    {
      number: "02",
      title: "Military-Grade Security",
      description:
        "End-to-end encryption and tamper-proof systems ensure every vote is protected and every result is trustworthy.",
    },
    {
      number: "03",
      title: "Effortless Efficiency",
      description:
        "Real-time results, automated tallying, zero manual counting. Focus on your event, not the logistics.",
    },
  ];

  const stats = [
    {
      value: 10000,
      decimalPlaces: 0,
      suffix: "+",
      label: "Votes Cast",
      delay: 0,
    },
    { value: 99.9, decimalPlaces: 1, suffix: "%", label: "Uptime", delay: 0 },
    {
      value: 50,
      decimalPlaces: 0,
      suffix: "+",
      label: "Events Powered",
      delay: 0,
    },
  ];

  return (
    <section
      id="value-prop-section"
      className="min-h-screen bg-background text-white sm:py-5 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto py-24">
        {/* Headline */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[110%] mb-6">
            Transform Event Voting
            <br />
            <Highlighter
              action="highlight"
              color="#87CEFA"
              animationDuration={300}
              isView={true}
            >
              <span className="text-secondary">Minutes</span>
            </Highlighter>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light opacity-70 max-w-3xl mx-auto leading-relaxed">
            Secure, transparent, and accessible voting for modern events.
            <br className="hidden sm:block" />
            No manual counting. No complexity. Just results.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-20 md:mb-32">
          {valueProps.map((prop, index) => (
            <div key={index} className="group">
              <div className="border border-card-foreground/10 hover:border-white/30 transition-all duration-500 p-6 sm:p-8 h-full bg-card/40 hover:bg-card/60">
                <div className="text-5xl sm:text-6xl font-light opacity-20 group-hover:opacity-40 transition-opacity duration-500 mb-6">
                  {prop.number}
                </div>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-4 leading-tight">
                  {prop.title}
                </h3>
                <p className="text-sm sm:text-base font-light opacity-70 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="border-y border-white/10 py-12 md:py-16 mb-16 md:mb-20">
          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-light mb-2 tabular-nums flex justify-center">
                  {isVisible ? (
                    <NumberTicker
                      value={stat.value}
                      decimalPlaces={stat.decimalPlaces}
                      delay={stat.delay}
                      className="tabular-nums"
                    />
                  ) : (
                    <span className="opacity-0">0{stat.suffix}</span>
                  )}
                  <span className="ml-1">{stat.suffix}</span>
                </div>

                <div className="text-xs sm:text-sm tracking-widest opacity-60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 px-4">
            <ShiningButton
              label="View Events"
              className="w-full sm:w-auto sm:min-w-[200px]"
            />
            <ButtonArrow
              className="group relative w-full sm:w-auto sm:min-w-[200px] rounded-md py-4 md:py-6 lg:py-8 overflow-hidden bg-secondary/20 hover:bg-secondary/40 border border-border hover:border-secondary transition-all duration-500"
              text="See How It Works"
            />
          </div>
        </section>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
