'use client';

import React from 'react';

const MarqueeSection = () => {
  const topMarqueeItems = [
    'Secure Voting',
    'Real-Time Results',
    'Military-Grade Encryption',
    'Accessible Anywhere',
    'Zero Manual Counting',
    'Transparent Process',
  ];

  const bottomMarqueeItems = [
    'Transform Your Events',
    '10,000+ Votes Cast',
    'Cost-Effective Solutions',
    'Eco-Friendly Digital Voting',
    'Instant Analytics',
    '99.9% Uptime Guarantee',
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/60 to-background/90 opacity-50"></div>

      <div className="relative z-10 space-y-6 md:space-y-8">
        {/* Top Marquee */}
        <div className="relative flex overflow-hidden py-4 md:py-6 group">
          <div className="flex animate-marquee hover:pause-animation">
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex shrink-0">
                {topMarqueeItems.map((item, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex items-center gap-4 md:gap-6 px-4 md:px-6"
                  >
                    <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-[-0.07em] leading-[90%] text-white/90 whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-white/20 text-xl md:text-2xl">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex absolute top-0 animate-marquee2 hover:pause-animation py-4 md:py-6">
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex shrink-0">
                {topMarqueeItems.map((item, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex items-center gap-4 md:gap-6 px-4 md:px-6"
                  >
                    <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-[-0.07em] leading-[90%] text-white/90 whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-white/20 text-xl md:text-2xl">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Marquee - Reverse Direction */}
        <div className="relative flex overflow-hidden py-4 md:py-6 group">
          <div className="flex animate-marquee-reverse hover:pause-animation">
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex shrink-0">
                {bottomMarqueeItems.map((item, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex items-center gap-4 md:gap-6 px-4 md:px-6"
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white/90 whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-white/20 text-xl md:text-2xl">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex absolute top-0 animate-marquee-reverse2 hover:pause-animation py-4 md:py-6">
            {[...Array(3)].map((_, repeatIndex) => (
              <div key={repeatIndex} className="flex shrink-0">
                {bottomMarqueeItems.map((item, index) => (
                  <div
                    key={`${repeatIndex}-${index}`}
                    className="flex items-center gap-4 md:gap-6 px-4 md:px-6"
                  >
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-white/90 whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-white/20 text-xl md:text-2xl">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes marquee-reverse2 {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
        .animate-marquee-reverse2 {
          animation: marquee-reverse2 40s linear infinite;
        }
        .hover\\:pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default MarqueeSection;