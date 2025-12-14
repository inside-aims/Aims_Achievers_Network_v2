// TrustedPartnersCarousel.tsx - Minimalist Partner Badge Carousel
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const trustedPartners = [
  {
    id: 1,
    name: "TechCorp Ghana",
    logo: "TC",
    logoImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80",
    industry: "Technology",
    partnerType: "Official Partner",
    description: "Leading technology solutions provider in West Africa",
  },
  {
    id: 2,
    name: "Innovation Hub Africa",
    logo: "IH",
    logoImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&auto=format&fit=crop&q=80",
    industry: "Innovation",
    partnerType: "Trusted Partner",
    description: "Africa's premier innovation and entrepreneurship center",
  },
  {
    id: 3,
    name: "Global Solutions Ltd",
    logo: "GS",
    logoImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=80",
    industry: "Consulting",
    partnerType: "Strategic Partner",
    description: "International consultancy empowering businesses globally",
  },
  {
    id: 4,
    name: "Digital Ventures",
    logo: "DV",
    logoImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&auto=format&fit=crop&q=80",
    industry: "Finance",
    partnerType: "Official Partner",
    description: "Venture capital firm investing in Africa's future",
  },
];

export default function TrustedPartnersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % trustedPartners.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + trustedPartners.length) % trustedPartners.length);
    setIsAutoPlaying(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % trustedPartners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const currentPartner = trustedPartners[currentIndex];

  return (
    <section className="bg-background text-foreground font-sans pb-12 sm:py-16 md:pb-20 lg:pb-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-foreground mb-3 sm:mb-4">
            Trusted Partners
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Collaborating with industry leaders to deliver exceptional experiences
          </p>
        </div>

        {/* Partner Badge Card Carousel */}
        <div className="relative mb-6 sm:mb-8">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-md hover:bg-accent hover:border-foreground/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Previous partner (Left arrow key)"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card border border-border shadow-md hover:bg-accent hover:border-foreground/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Next partner (Right arrow key)"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Partner Badge Card */}
          <div className="px-2 sm:px-4">
            <div 
              key={currentPartner.id}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden transition-opacity duration-300"
            >
              <div className="flex items-stretch">
                {/* Left: Partner Logo/Image */}
                <div className="w-20 sm:w-24 md:w-28 shrink-0 bg-muted flex items-center justify-center border-r border-border overflow-hidden">
                  {currentPartner.logoImage ? (
                    <Image 
                      src={currentPartner.logoImage} 
                      alt={`${currentPartner.name} logo`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg sm:text-xl md:text-2xl font-semibold">
                      {currentPartner.logo}
                    </div>
                  )}
                </div>

                {/* Right: Partner Details */}
                <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-center min-w-0">
                  {/* Partner Name */}
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate mb-2">
                    {currentPartner.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2.5 sm:mb-3 line-clamp-1">
                    {currentPartner.description}
                  </p>

                  {/* Industry Badge & Partner Type */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary-foreground border border-secondary/30">
                      {currentPartner.industry}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                      {currentPartner.partnerType}
                    </span>
                  </div>

                  {/* Partner Counter */}
                  <div className="mt-2.5 sm:mt-3">
                    <span className="text-xs text-muted-foreground font-normal">
                      {currentIndex + 1} / {trustedPartners.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mb-8 sm:mb-10 md:mb-12">
          {trustedPartners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "bg-primary w-6 sm:w-8 h-1.5 sm:h-2"
                  : "bg-muted-foreground/30 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to partner ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Partners Button */}
        <div className="flex justify-center">
          <button 
            className="px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-card text-foreground border border-border rounded-md text-sm sm:text-base font-medium hover:bg-accent hover:border-foreground/20 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => console.log('View all partners')}
          >
            View All Partners
          </button>
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-muted-foreground">
            Use ← → arrow keys to navigate
          </p>
        </div>
      </div>
    </section>
  );
}