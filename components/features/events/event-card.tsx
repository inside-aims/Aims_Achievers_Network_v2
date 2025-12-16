'use client';

import {Badge} from "@/components/ui/badge";
import {Clock, Layers} from "lucide-react";
import Image from "next/image";
import {EventCardProps} from "@/components/features/events/index";
import {getDaysLeft} from "@/lib/utils";
import ButtonLink from "@/components/shared/button-link";

const EventCard = (
  {
    eventId,
    title,
    description,
    categories,
    image,
    endDate,
  }: EventCardProps) => {

  const daysLeft = getDaysLeft(endDate);

  return (
    <div className="group rounded-card border border-primary/10 bg-card overflow-hidden  hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          width={100}
          height={100}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge
          className={`absolute top-3 right-3 bg-green-600 ${daysLeft > 0 ? "bg-green-500 text-white" : "bg-secondary text-secondary-foreground"}`}
        >
          { daysLeft > 0 ? "Active" : "Past"}
        </Badge>
      </div>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className={"flex flex-col gap-4"}>
          <h3 className="font-semibold leading-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 border border-primary/10 p-1 rounded-card">
            <Layers className="h-3.5 w-3.5"/>
            {categories.length} Categories
          </span>

          <span className="flex items-center gap-1 border border-primary/10 p-1 rounded-card bg-card">
            <Clock className="h-3.5 w-3.5"/>
            {daysLeft === 0 ? "Event ended" : `${daysLeft} days left`}
          </span>
        </div>

        <ButtonLink href={`/events/${eventId}`} label={"View Categories"}/>
      </div>
    </div>
  );
};

export default EventCard;
