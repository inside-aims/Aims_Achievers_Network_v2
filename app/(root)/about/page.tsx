"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-4xl text-center space-y-8">
        <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
          WHAT IS THIS?
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          AIMS Achievers Network connects students with mentors and opportunities
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          We bring together resources, guidance, and real connections to help motivated 
          students access mentorship, discover career pathways, and find opportunities 
          that match their ambitions.
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}

// Section 2: Who is it for?
function WhoSection() {
  const audiences = [
    {
      title: "Students",
      description: "High school and college students seeking mentorship and career guidance"
    },
    {
      title: "Mentors",
      description: "Professionals and educators wanting to guide the next generation"
    },
    {
      title: "Institutions",
      description: "Schools connecting their students with meaningful opportunities"
    },
    {
      title: "Parents",
      description: "Families seeking trusted resources for their student's journey"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-5xl w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHO IS IT FOR?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            AIMS is built for:
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="group border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2 relative inline-block">
                {audience.title}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500"></span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}

// Section 3: The Problem
function ProblemSection() {
  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-3xl w-full space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY DOES IT EXIST?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            The problem we&apos;re solving
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-red-500/30 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-red-400">The Challenge</h3>
            <p className="text-gray-400 leading-relaxed">
              Finding mentorship is hard. Information about opportunities is scattered. 
              Students often don&apos;t know what questions to ask, where to look, or who to trust.
            </p>
          </div>

          <div className="border border-blue-500/30 rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-blue-400">Our Approach</h3>
            <p className="text-gray-400 leading-relaxed">
              AIMS exists to level the playing field. We create a space where students can 
              find mentors and discover opportunities—regardless of their background.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}

// Section 4: Our Values
function ValuesSection() {
  const values = [
    { principle: "Access over exclusivity", description: "Mentorship shouldn't depend on who you know" },
    { principle: "Clarity over confusion", description: "Plain guidance, no jargon or gatekeeping" },
    { principle: "Connection over isolation", description: "Building a community, not just a platform" },
    { principle: "Growth over perfection", description: "Supporting students at every stage" }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            What guides us
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((value, index) => (
            <div key={index} className="border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all group">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-white/50 mt-2 group-hover:bg-blue-400 transition-colors flex-shrink-0"></div>
                <div>
                  <div className="font-bold mb-1">{value.principle}</div>
                  <div className="text-gray-400 text-sm">{value.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-500 font-mono mb-2">Scroll to learn more about us</p>
        <ArrowDown className="w-5 h-5 text-gray-500 mx-auto animate-bounce" />
      </div>
    </div>
  );
}

// Section 5: Trust & Impact
function TrustSection() {
  const stats = [
    { value: "500+", label: "Students Connected" },
    { value: "200+", label: "Active Mentors" },
    { value: "50+", label: "Partner Organizations" }
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-xs font-mono tracking-wide">
            WHY TRUST US?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Built by people who&apos;ve been there
          </h2>
        </div>

        <div className="text-center space-y-4">
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            AIMS Achievers Network is created by educators, students, and professionals 
            who understand what it&apos;s like to navigate these systems.
          </p>

          <p className="text-gray-500">
            We&apos;re not here to sell dreams. We&apos;re here to provide clear paths.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400">
            Whether you&apos;re just starting your search or already on your path, 
            AIMS is here to support your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-2.5 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm">
              [Join as Student]
            </button>
            <button className="px-6 py-2.5 border border-white/30 rounded hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm">
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
  const [currentSection, setCurrentSection] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  const totalSections = 5;

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSection(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (now - lastScrollTime.current < 800 || isTransitioning) return;
      
      lastScrollTime.current = now;

      if (e.deltaY > 0) {
        scrollToSection(currentSection + 1);
      } else if (e.deltaY < 0) {
        scrollToSection(currentSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentSection, isTransitioning]);

  // Click and drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(currentSection);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (startX - x) / 100;
    
    if (Math.abs(walk) > 0.5) {
      if (walk > 0) {
        scrollToSection(Math.min(currentSection + 1, totalSections - 1));
      } else {
        scrollToSection(Math.max(currentSection - 1, 0));
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden bg-black text-white cursor-grab active:cursor-grabbing"
      style={{ height: 'calc(100vh - 80px)', marginTop: '80px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <BackgroundGL hovering={hovering} />
      
      {/* Carousel Sections */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSection * 100}%)` }}
      >
        <div className="flex-shrink-0 w-full">
          <WhatSection />
        </div>
        <div className="flex-shrink-0 w-full">
          <WhoSection />
        </div>
        <div className="flex-shrink-0 w-full">
          <ProblemSection />
        </div>
        <div className="flex-shrink-0 w-full">
          <ValuesSection />
        </div>
        <div className="flex-shrink-0 w-full">
          <TrustSection />
        </div>
      </div>
    </div>
  );
}