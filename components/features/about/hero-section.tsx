"use client";
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Background Component
function BackgroundGL({ hovering }: { hovering: boolean }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div 
        className={`absolute inset-0 transition-all duration-700 ${
          hovering 
            ? 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black' 
            : 'bg-gradient-to-br from-black via-gray-900 to-black'
        }`}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>
        </div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          hovering ? 'bg-purple-500/30 scale-125' : 'bg-purple-500/10 scale-100'
        }`}></div>
        <div className={`absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
          hovering ? 'bg-blue-500/30 scale-125' : 'bg-blue-500/10 scale-100'
        }`}></div>
      </div>
    </div>
  );
}

// Section 1: What is this?
function WhatSection() {
  return (
    <div className="h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center space-y-8">
        <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide mb-4">
          WHAT IS THIS?
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          AIMS Achievers Network connects students with mentors and opportunities
        </h1>
        
        <div className="space-y-6 text-lg text-gray-400 max-w-2xl mx-auto">
          <p>
            We bring together resources, guidance, and real connections to help motivated 
            students access mentorship, discover career pathways, and find opportunities 
            that match their ambitions.
          </p>
          <p>
            Whether you&apos;re looking for direction, seeking a mentor in your field, or 
            exploring scholarships and programs, AIMS is built to make those connections simple.
          </p>
        </div>
      </div>
    </div>
  );
}

// Section 2: Who is it for?
function WhoSection() {
  const audiences = [
    {
      title: "Students",
      description: "High school and college students seeking mentorship, career guidance, and academic opportunities"
    },
    {
      title: "Mentors",
      description: "Professionals and educators wanting to give back and guide the next generation"
    },
    {
      title: "Institutions",
      description: "Schools and organizations looking to connect their students with meaningful opportunities"
    },
    {
      title: "Parents",
      description: "Families seeking trusted resources and support for their student's journey"
    }
  ];

  return (
    <div className="h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHO IS IT FOR?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            AIMS is built for:
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="group border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mb-3 relative inline-block">
                {audience.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm font-mono">
          If you&apos;re looking for direction, connections, or opportunities, this is for you.
        </p>
      </div>
    </div>
  );
}

// Section 3: Why does it exist?
function WhySection() {
  const values = [
    { principle: "Access over exclusivity", description: "Mentorship shouldn't depend on who you know" },
    { principle: "Clarity over confusion", description: "Plain guidance, no jargon or gatekeeping" },
    { principle: "Connection over isolation", description: "Building a community, not just a platform" },
    { principle: "Growth over perfection", description: "Supporting students at every stage of their journey" }
  ];

  return (
    <div className="h-screen flex items-center justify-center px-6 overflow-y-auto">
      <div className="max-w-3xl w-full space-y-16 py-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY DOES IT EXIST?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            The problem we&apos;re solving
          </h2>
        </div>

        <div className="space-y-8">
          <div className="border-l-2 border-red-500/50 pl-6 space-y-4">
            <h3 className="text-2xl font-bold text-red-400">The Challenge</h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              Finding mentorship is hard. Information about opportunities is scattered. 
              Students often don&lsquo;t know what questions to ask, where to look, or who to trust. 
              Traditional networks favor those with existing connections.
            </p>
          </div>

          <div className="border-l-2 border-blue-500/50 pl-6 space-y-4">
            <h3 className="text-2xl font-bold text-blue-400">Our Approach</h3>
            <p className="text-lg text-gray-400 leading-relaxed">
              AIMS exists to level the playing field. We create a space where students can 
              find mentors in their field, discover opportunities they didn&apos;t know existed, 
              and get straightforward guidance—regardless of their background or connections.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">What guides us</h3>
          <div className="space-y-4">
            {values.map((value, index) => (
              <div key={index} className="flex gap-4 items-start group">
                <div className="w-2 h-2 rounded-full bg-white/50 mt-2 group-hover:bg-blue-400 transition-colors"></div>
                <div>
                  <span className="font-bold">{value.principle}</span>
                  <span className="text-gray-500"> — </span>
                  <span className="text-gray-400">{value.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section 4: Why should I trust it?
function TrustSection() {
  const [hovering, setHovering] = useState(false);

  const stats = [
    { value: "500+", label: "Students Connected" },
    { value: "200+", label: "Active Mentors" },
    { value: "50+", label: "Partner Organizations" }
  ];

  return (
    <div className="h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY TRUST US?
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Built by people who&apos;ve been there
          </h2>
        </div>

        <div className="space-y-8 text-center">
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            AIMS Achievers Network is created by educators, students, and professionals 
            who understand what it&apos;s like to navigate these systems. We&apos;ve experienced the 
            confusion, the dead ends, and the moments when the right connection changed everything.
          </p>

          <p className="text-gray-500">
            We&apos;re not here to sell dreams. We&apos;re here to provide clear paths.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-6">
          <p className="text-gray-400">
            Whether you&apos;re just starting your search or already on your path, 
            AIMS is here to support your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-8 py-3 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              [Join as Student]
            </button>
            <button
              className="px-8 py-3 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              [Become a Mentor]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Carousel Component
export default function AboutPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    duration: 25,
    skipSnaps: false 
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <BackgroundGL hovering={hovering} />
      
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          <div className="flex-[0_0_100%] min-w-0">
            <WhatSection />
          </div>
          <div className="flex-[0_0_100%] min-w-0">
            <WhoSection />
          </div>
          <div className="flex-[0_0_100%] min-w-0">
            <WhySection />
          </div>
          <div className="flex-[0_0_100%] min-w-0">
            <TrustSection />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={scrollPrev}
          className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all disabled:opacity-30"
          disabled={selectedIndex === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedIndex === index ? 'w-8 bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="p-2 border border-white/20 rounded-full hover:bg-white/10 transition-all disabled:opacity-30"
          disabled={selectedIndex === 3}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Section Indicator */}
      <div className="fixed top-8 right-8 z-50 text-sm font-mono text-gray-500">
        {selectedIndex + 1} / 4
      </div>
    </div>
  );
}