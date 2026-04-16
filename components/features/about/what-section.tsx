import React from "react";

export function WhatSection() {
  return (
    <section className="relative -top-22 flex w-full min-h-screen lg:h-screen items-center justify-center px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center space-y-6 sm:space-y-8">
        {/* Label */}
        <div className="inline-block rounded-full border border-white/20 px-3 py-1 text-[10px] sm:text-xs font-mono tracking-wide">
          What is this
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          AIMS Achievers Network connects ambitious individuals with mentors, opportunities, and pathways for meaningful growth globally.
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-gray-400">
          We bring together curated resources, expert guidance, and powerful networks to help driven people access mentorship, explore diverse career and business pathways, and unlock opportunities aligned with their aspirations.
          At its core, AIMS is built to bridge potential with possibility empowering individuals, professionals, and innovators to move forward with clarity, confidence, and purpose.
        </p>
      </div>
    </section>
  );
}
