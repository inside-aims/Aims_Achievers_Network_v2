"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, Target, Sparkles } from 'lucide-react';

// Morphing Text Component
const MorphingText = ({ texts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span
      className={`inline-block transition-all duration-800 ${
        isAnimating ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'
      }`}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default function AboutHeroSection() {
  const morphingWords = [
    "Empower",
    "Connect",
    "Mentor",
    "Achieve",
    "Inspire",
    "Transform",
    "Guide",
    "Elevate",
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Students Connected" },
    { icon: Target, value: "200+", label: "Active Mentors" },
    { icon: Sparkles, value: "50+", label: "Opportunities" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-gray-900 to-black text-white mb-24">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Main Headline */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <MorphingText texts={morphingWords} />
              <span className="block mt-2">Students Through</span>
              <span className="block bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mentorship & Opportunity
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mt-6">
              Bridging the gap between ambition and achievement by connecting students 
              with mentors, resources, and opportunities that unlock their full potential.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <button className="group px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:bg-primary transition-all duration-300 flex items-center gap-2">
              Join as a Student
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300">
              Become a Mentor
            </button>
            
            <button className="px-8 py-4 text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2">
              Learn More
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:border-white/20">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 mt-2">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}