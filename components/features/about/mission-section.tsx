"use client";

import React, { useEffect, useRef, useState } from "react";
import { Target, Sparkles } from "lucide-react";

/* -------------------------------
   Reusable Tags Component
-------------------------------- */
const Tags = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2 mt-auto">
    {items.map((item) => (
      <span
        key={item}
        className="px-3 py-1 border border-white/20 text-white/70 rounded-full text-sm"
      >
        {item}
      </span>
    ))}
  </div>
);

export default function MissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !scrollContentRef.current) return;

      const section = sectionRef.current;
      const scrollContent = scrollContentRef.current;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const start = sectionTop;
      const end = sectionTop + sectionHeight - windowHeight;
      const range = end - start;

      if (scrollY >= start && scrollY <= end) {
        // Lock vertical scroll feel
        document.body.style.overflowY = "hidden";

        const percent = (scrollY - start) / range;
        const maxScroll =
          scrollContent.scrollWidth - scrollContent.clientWidth;

        scrollContent.scrollLeft = percent * maxScroll;
        setProgress(percent);
      } else {
        document.body.style.overflowY = "auto";
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => {
      document.body.style.overflowY = "auto";
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-black text-white py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Purpose
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Scroll to explore our mission and vision
          </p>
        </div>

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollContentRef}
          className="flex gap-8 overflow-x-hidden"
        >
          {/* Challenge */}
          <div className="w-[90vw] md:w-[600px] h-[520px] flex-shrink-0">
            <div className="h-full border border-white/10 rounded-lg p-8 flex flex-col">
              <span className="text-red-400 text-sm mb-6">
                The Challenge
              </span>
              <h3 className="text-3xl font-bold mb-6">
                Too Many Students,{" "}
                <span className="text-red-400">Too Few Pathways</span>
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Talented students face limited mentorship, lack of opportunity
                visibility, and no clear guidance to bridge education and career.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="w-[90vw] md:w-[600px] h-[520px] flex-shrink-0">
            <div className="h-full border border-white/10 rounded-lg p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-blue-400" />
                <h3 className="text-3xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                To democratize access to mentorship and opportunity by building
                a community that empowers students to achieve their full
                potential.
              </p>
              <Tags items={["Mentorship", "Access", "Community"]} />
            </div>
          </div>

          {/* Vision */}
          <div className="w-[90vw] md:w-[600px] h-[520px] flex-shrink-0">
            <div className="h-full border border-white/10 rounded-lg p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-purple-400" />
                <h3 className="text-3xl font-bold">Our Vision</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                A world where every student has a trusted mentor, clear
                direction, and the tools to succeed—regardless of background.
              </p>
              <Tags items={["Equity", "Impact", "Innovation"]} />
            </div>
          </div>

          {/* Core Values */}
          <div className="w-[90vw] md:w-[600px] h-[520px] flex-shrink-0">
            <div className="h-full border border-white/10 rounded-lg p-8 flex flex-col">
              <h3 className="text-3xl font-bold mb-8">
                What Drives{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Us
                </span>
              </h3>

              <ul className="space-y-6 text-gray-300">
                <li>🌍 Accessibility First</li>
                <li>🤝 Quality Connections</li>
                <li>🚀 Continuous Growth</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-10 flex justify-center">
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
