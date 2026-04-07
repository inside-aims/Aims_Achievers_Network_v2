import React from "react";

export function WhatSection() {
  return (
    <section className="relative -top-22 flex w-full min-h-screen lg:h-screen items-center justify-center px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center space-y-6 sm:space-y-8">
        {/* Label */}
        <div className="inline-block rounded-full border border-white/20 px-3 py-1 text-[10px] sm:text-xs font-mono tracking-wide">
          WHAT IS THIS?
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          AIMS Achievers Network connects students with mentors and
          opportunities
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-gray-400">
          We bring together resources, guidance, and real connections to help
          motivated students access mentorship, discover career pathways, and
          find opportunities that match their ambitions.
        </p>
      </div>
    </section>
  );
}
