'use client';
import React, {useEffect, useState} from 'react';
import {Award, Heart, LucideIcon, TrendingUp, Users} from 'lucide-react';
import {mockVendors} from "@/components/features/outlets/index";
import {AnimatedBackground} from "@/components/layout/animated-background";
import {OutletCard} from "@/components/features/outlets/outlet-card";
import {StatCard} from "@/components/features/outlets/stats-card";
import {CTASection} from "@/components/features/outlets/cta-section";
import SearchBar from "@/components/shared/search-bar";
import EmptyState from "@/components/shared/empty-state";

const stats: {label: string, value: string, icon: LucideIcon, color: string}[] = [
  {
    icon: Award,
    value: "50+",
    label: "Master Craftsmen",
    color: "primary"
  },
  {
    icon: Users,
    value: "8,500+",
    label: "Satisfied Client",
    color: "secondary"
  },
  {
    icon: TrendingUp,
    value: "15K",
    label: "Award Delivered",
    color: "accent-foreground"
  },
  {
    icon: Heart,
    value: "98%",
    label: "Client Satisfaction",
    color: "muted-foreground"
  }
]

export default function OutletsListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImages, setActiveImages] = useState<{[key: string]: number}>({});

  // Auto-rotate portfolio images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImages(prev => {
        const next = {...prev};
        mockVendors.forEach(vendor => {
          next[vendor.id] = ((prev[vendor.id] || 0) + 1) % vendor.portfolioImages.length;
        });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const featuredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />

      <div className="relative z-10 space-y-8">
        <div className="w-full flex flex-col">
          <div className="w-full flex flex-col gap-2 md:gap-4">
            <div className={"parent-header"}>
              <h3 className="feature-header leading-tight">
                Where Legends Are Crafted
              </h3>
              <p className="feature-subheader max-w-4xl leading-relaxed">
                {`Connect with master artisans who've created over`}
                <span className="text-secondary font-bold"> 15,000 masterpieces
            </span> for champions across Africa
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-4 lg:gap-6 xl:gap-8">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat}/>
              ))}
            </div>
          </div>
        </div>

        {/* outlets listing */}
        <div className={"flex flex-col gap-2 md:gap-4"}>
          <SearchBar
            query={searchQuery}
            setQuery={setSearchQuery}
            placeholder={"Search for an outlet here"}
          />
          {featuredVendors.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:gap-8">
              {featuredVendors.map((outlet, index) => (
                <OutletCard
                  key={outlet.id}
                  index={index}
                  outlet={outlet}
                  verified={outlet.verified}
                  activeImage={activeImages[outlet.id] || 0}
                />
              ))}
            </div>
          )}
          {featuredVendors.length === 0 && (
            <EmptyState onReset={() => setSearchQuery("")}/>
          )}
        </div>

        <div className={"pt-4 md:pt-8"}>
          <CTASection/>
        </div>
      </div>
    </div>
  );
}