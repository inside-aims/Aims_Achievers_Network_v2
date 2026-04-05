"use client";

import Image from "next/image";

interface EventCardProps {
  eventName: string;
  location: string;
  status: "ongoing" | "upcoming" | "past";
  imageUrl: string;
}

const statusConfig = {
  ongoing: { bg: "bg-secondary", text: "text-secondary-foreground", label: "ONGOING" },
  upcoming: { bg: "bg-primary", text: "text-primary-foreground", label: "UPCOMING" },
  past: { bg: "bg-muted", text: "text-muted-foreground", label: "PAST" },
};

export default function EventNameTag({
  eventName,
  location,
  status,
  imageUrl,
}: EventCardProps) {
  const { bg, text, label } = statusConfig[status];

  return (
    <div className="group relative overflow-hidden aspect-[4/5] cursor-pointer">
      <Image
        fill
        src={imageUrl}
        alt={eventName}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Status badge */}
      <div className="absolute top-4 left-4">
        <span
          className={`${bg} ${text} text-[10px] px-2.5 py-1 font-mono tracking-[0.2em]`}
        >
          {label}
        </span>
      </div>

      {/* Event info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-serif font-light text-white leading-tight mb-1.5 group-hover:tracking-wide transition-all duration-500">
          {eventName}
        </h3>
        <p className="text-xs text-white/50 tracking-[0.2em] font-mono">
          {location.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
