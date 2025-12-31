"use client";

import { BackgroundGL } from '@/components/features/about/background-gl';
import { ContactSection } from '@/components/features/about/contact-section';
import { ProblemSection } from '@/components/features/about/problem-section';
import { TrustSection } from '@/components/features/about/trust-section';
import { ValuesSection } from '@/components/features/about/value-section';
import { WhatSection } from '@/components/features/about/what-section';
import { WhoSection } from '@/components/features/about/who-section';
import React, { useState, useEffect, useRef } from 'react';


export default function AboutPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  const totalSections = 6;

  const scrollToSection = (index: number) => {
    if (index < 0 || index >= totalSections || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSection(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Wheel scroll navigation
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

  // Click and drag navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
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
      className="relative overflow-hidden bg-black text-white cursor-grab active:cursor-grabbing h-full"
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
        <div className="flex-shrink-0 w-full">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}