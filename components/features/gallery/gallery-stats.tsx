"use client";

import { Calendar, Layers, School, Images } from "lucide-react";

interface StatsProps {
  total: number;
  events: number;
  categories: number;
  universities: number;
}

export default function GalleryStats({ total, events, categories, universities }: StatsProps) {
  const items = [
    { label: "Total Photos", value: total, icon: Images },
    { label: "Events", value: events, icon: Calendar },
    { label: "Categories", value: categories, icon: Layers },
    { label: "Universities", value: universities, icon: School },
  ];

  return (
    <div className="feature-no mx-auto -mt-10 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 xl:px-0">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="bg-card shadow-md rounded-2xl p-4 lg:p-6 flex flex-col items-center text-center border"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <Icon className="w-7 h-7 text-primary" />
              </div>

              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
