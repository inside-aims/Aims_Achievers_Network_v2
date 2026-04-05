"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackgroundGL } from "@/components/features/about/background-gl";
import { WhatSection } from "@/components/features/about/what-section";
import { WhoSection } from "@/components/features/about/who-section";
import { ProblemSection } from "@/components/features/about/problem-section";
import { ValuesSection } from "@/components/features/about/value-section";
import { TrustSection } from "@/components/features/about/trust-section";
import { ContactSection } from "@/components/features/about/contact-section";

const SECTIONS = [
  WhatSection,
  WhoSection,
  ProblemSection,
  ValuesSection,
  TrustSection,
  ContactSection,
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTime = useRef(0);

  /* ------------------------
     Media helpers
  ------------------------ */
  const isDesktop = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches;

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------
     Navigation logic
  ------------------------ */
  const scrollToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTIONS.length || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSection(index);
  }, [isTransitioning]);

  /* ------------------------
     Desktop wheel navigation
  ------------------------ */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < 700) return;
      lastScrollTime.current = now;

      if (e.deltaY > 0) scrollToSection(currentSection + 1);
      if (e.deltaY < 0) scrollToSection(currentSection - 1);
    };

    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [currentSection, isTransitioning, scrollToSection]);

  /* ------------------------
     Safety unlock for reduced motion
  ------------------------ */
  useEffect(() => {
    if (!prefersReducedMotion()) return;

    const id = requestAnimationFrame(() => {
      setIsTransitioning(false);
    });

    return () => cancelAnimationFrame(id);
  }, [currentSection]);

  /* ------------------------
     Mouse drag (desktop only)
  ------------------------ */
  const dragState = useRef({
    isDragging: false,
    startX: 0,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDesktop()) return;
    dragState.current.isDragging = true;
    dragState.current.startX = e.pageX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop() || !dragState.current.isDragging) return;

    e.preventDefault();
    const walk = (dragState.current.startX - e.pageX) / 100;

    if (Math.abs(walk) > 0.5) {
      if (walk > 0) scrollToSection(Math.min(currentSection + 1, SECTIONS.length - 1));
      else scrollToSection(Math.max(currentSection - 1, 0));

      dragState.current.isDragging = false;
    }
  };

  const handleMouseUp = () => {
    dragState.current.isDragging = false;
  };

  /* ------------------------
     Render
  ------------------------ */
  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-auto lg:overflow-hidden bg-black text-white cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <BackgroundGL hovering={false} />

      {/* Sections Wrapper */}
      <div
        className={`flex flex-col lg:flex-row h-full ${
          prefersReducedMotion()
            ? ""
            : "transition-transform duration-700 ease-in-out"
        }`}
        style={{
          transform: isDesktop()
            ? `translateX(-${currentSection * 100}%)`
            : "none",
        }}
        onTransitionEnd={() => setIsTransitioning(false)}
      >
        {SECTIONS.map((Section, index) => (
          <div key={index} className="w-full lg:w-screen lg:shrink-0">
            <Section />
          </div>
        ))}
      </div>
    </div>
  );
}
