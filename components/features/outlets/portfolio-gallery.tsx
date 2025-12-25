'use client';
import React from "react";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Verified} from "lucide-react";

export const PortfolioGallery = ({ images, activeIndex, verified }: { images: string[], vendorId: string, activeIndex: number, verified: boolean }) => (
  <div className="relative h-[200px] md:h-[450px] overflow-hidden rounded-t-lg">
    {images.map((img, idx) => (
      <Image
        key={idx}
        src={img}
        height={200}
        width={200}
        alt={`Portfolio ${idx + 1}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: activeIndex === idx ? 1 : 0 }}
      />
    ))}
    {verified && (
      <div className="absolute inset-0 left-2 top-1 bg-gradient-to-t from-black/60 via-transparent to-transparent">
        <Badge variant={"secondary"} className={"bg-green-500"}>
          <Verified/> Verified
        </Badge>
      </div>
    )}

    {/* Progress Indicators */}
    <div className="absolute bottom-4 left-4 flex gap-2">
      {images.map((_, idx) => (
        <div
          key={idx}
          className={`h-1 rounded-full transition-all duration-300 ${
            activeIndex === idx ? 'w-8 bg-secondary' : 'w-4 bg-white/30'
          }`}
        />
      ))}
    </div>
  </div>
);