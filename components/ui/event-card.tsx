// EventNameTag.tsx
"use client";

interface EventNameTagProps {
  eventName: string;
  location: string;
  status: "ongoing" | "upcoming" | "past";
  imageUrl: string;
}

const statusConfig = {
  ongoing: {
    color: "bg-green-500",
    label: "Ongoing",
  },
  upcoming: {
    color: "bg-blue-500",
    label: "Upcoming",
  },
  past: {
    color: "bg-gray-400",
    label: "Past",
  },
};

export default function EventNameTag({
  eventName,
  location,
  status,
  imageUrl,
}: EventNameTagProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="inline-flex items-stretch bg-card border border-border rounded-md overflow-hidden h-16 font-sans ">
      {/* Left: Event Image */}
      <div className="w-16 h-16 flex-shrink-0 bg-muted">
        <img
          src={imageUrl}
          alt={eventName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right: Event Details */}
      <div className="flex flex-col justify-center px-4 py-2 min-w-0">
        {/* Event Name */}
        <h3 className="text-sm font-semibold text-foreground truncate leading-tight">
          {eventName}
        </h3>

        {/* Status & Location */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.color}`} />
          <span className="text-xs text-muted-foreground font-normal">
            {statusInfo.label} · {location}
          </span>
        </div>
      </div>
    </div>
  );
}

