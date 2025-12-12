'use client';

import { useEffect, useRef, useState } from 'react';

const FeatureGridBento = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
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
      cardsRef.current.forEach((card, index) => {
        if (card) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';

          setTimeout(() => {
            card.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80 + 200);
        }
      });
    }
  }, [isVisible]);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Secure Voting',
      description: 'Military-grade encryption and tamper-proof systems ensure every vote is protected and verified. Your data security is our top priority.',
      size: 'large',
      stat: '256-bit',
      statLabel: 'Encryption',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Real-Time Results',
      description: 'Watch votes come in live with instant updates and beautiful visualizations.',
      size: 'medium',
      stat: '<1s',
      statLabel: 'Update Time',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile-First',
      description: 'Optimized experience on any device. Vote from anywhere, anytime.',
      size: 'small',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into voting patterns, engagement rates, and participant demographics.',
      size: 'medium',
      stat: '50+',
      statLabel: 'Metrics',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Nominee Management',
      description: 'Streamlined candidate registration and profile management.',
      size: 'small',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Category Organization',
      description: 'Flexible award categories and custom voting rules.',
      size: 'small',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Admin Controls',
      description: 'Powerful dashboard with granular control over every aspect of your voting event.',
      size: 'medium',
    },
    {
      icon: (
        <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Payment Integration',
      description: 'Seamless payment processing for premium features and event fees.',
      size: 'small',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-background text-foreground py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight mb-4">
            Everything you need to run
            <br />
            <span className="opacity-60">successful voting events</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto gap-4 sm:gap-6">
          {/* Large Card - Secure Voting */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="group relative sm:col-span-2 lg:row-span-2"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-8 sm:p-10 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[400px] lg:min-h-[500px]">
              <div>
                <div className="mb-8 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[0].icon}
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-4 leading-tight">
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
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          {/* Medium Card - Real-Time Results */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="group relative sm:col-span-2"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="mb-6 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[1].icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-3 leading-tight">
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
              <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          {/* Small Cards Row 1 */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            className="group relative"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 transition-all duration-500 cursor-pointer min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="mb-4 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[2].icon}
                </div>
                <h3 className="text-lg sm:text-xl font-light tracking-wide mb-2 leading-tight">
                  {features[2].title}
                </h3>
                <p className="text-sm font-light opacity-70 leading-relaxed">
                  {features[2].description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          <div
            ref={(el) => { cardsRef.current[3] = el; }}
            className="group relative"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 transition-all duration-500 cursor-pointer min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="mb-4 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[4].icon}
                </div>
                <h3 className="text-lg sm:text-xl font-light tracking-wide mb-2 leading-tight">
                  {features[4].title}
                </h3>
                <p className="text-sm font-light opacity-70 leading-relaxed">
                  {features[4].description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          {/* Medium Card - Detailed Analytics */}
          <div
            ref={(el) => { cardsRef.current[4] = el; }}
            className="group relative sm:col-span-2"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-60">
              <div>
                <div className="mb-6 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[3].icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-3 leading-tight">
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
              <div className="absolute bottom-0 left-0 w-0 h-px bg-foreground group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          {/* Small Cards Row 2 */}
          <div
            ref={(el) => { cardsRef.current[5] = el; }}
            className="group relative"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 transition-all duration-500 cursor-pointer min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="mb-4 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[5].icon}
                </div>
                <h3 className="text-lg sm:text-xl font-light tracking-wide mb-2 leading-tight">
                  {features[5].title}
                </h3>
                <p className="text-sm font-light opacity-70 leading-relaxed">
                  {features[5].description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          <div
            ref={(el) => { cardsRef.current[6] = el; }}
            className="group relative"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 transition-all duration-500 cursor-pointer min-h-[200px] flex flex-col justify-between">
              <div>
                <div className="mb-4 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[7].icon}
                </div>
                <h3 className="text-lg sm:text-xl font-light tracking-wide mb-2 leading-tight">
                  {features[7].title}
                </h3>
                <p className="text-sm font-light opacity-70 leading-relaxed">
                  {features[7].description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>

          {/* Medium Card - Admin Controls */}
          <div
            ref={(el) => { cardsRef.current[7] = el; }}
            className="group relative sm:col-span-2"
          >
            <div className="h-full border border-border/50 hover:border-border/70 bg-background/60 hover:bg-background/70 p-6 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="mb-6 text-foreground/60 group-hover:text-foreground transition-colors duration-500">
                  {features[6].icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-light tracking-wide mb-3 leading-tight">
                  {features[6].title}
                </h3>
                <p className="text-sm sm:text-base font-light opacity-70 leading-relaxed">
                  {features[6].description}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-700 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGridBento;