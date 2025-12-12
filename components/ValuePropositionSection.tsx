"use client";

import React, { useEffect, useRef, useState } from "react";
import ButtonArrow from "./ButtonArrow";
import ShiningButton from "./ShinningButton";

const ValuePropositionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const valuePropsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      valuePropsRef.current.forEach((prop, index) => {
        if (prop) {
          prop.style.opacity = "0";
          prop.style.transform = "translateY(30px)";

          setTimeout(() => {
            prop.style.transition =
              "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
            prop.style.opacity = "1";
            prop.style.transform = "translateY(0)";
          }, index * 150 + 300);
        }
      });
    }
  }, [isVisible]);

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
    { number: "10,000+", label: "Votes Cast" },
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Events Powered" },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-background text-white py-10 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[110%] mb-6">
            Transform Event Voting
            <br />
            <span className="opacity-60">in Minutes</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light opacity-70 max-w-3xl mx-auto leading-relaxed">
            Secure, transparent, and accessible voting for modern events.
            <br className="hidden sm:block" />
            No manual counting. No complexity. Just results.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-20 md:mb-32">
          {valueProps.map((prop, index) => (
            <div
              key={prop.number}
              ref={(el) => {
                valuePropsRef.current[index] = el;
              }}
              className="group"
            >
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
                <div className="text-3xl sm:text-4xl md:text-5xl font-light mb-2 tabular-nums">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm tracking-widest opacity-60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <ShiningButton label="View Events" />
          <ButtonArrow
            className="group relative w-56 rounded-md md:py-8 overflow-hidden bg-secondary/20 hover:bg-secondary/40 border transition-all duration-500"
            text="See How It Works"
          />
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
