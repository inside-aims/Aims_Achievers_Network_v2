'use client';

import {Badge} from "@/components/ui/badge";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import {EventCategory} from "@/components/features/events/index";
import ButtonLink from "@/components/shared/button-link";

type CategoryCardProps = EventCategory & {
  eventId: string;
  daysLeft: number
};

const CategoryCard = (
  {
    id,
    name,
    description,
    votePrice,
    eventId,
    daysLeft
  }: CategoryCardProps ) => {

  return (
    <div className="flex flex-col gap-2 md:gap-4 rounded-card bg-card p-2 md:p-4 border border-primary/10 hover:shadow-lg hover:animate-pulse">
      {/* Status */}
      <div className={"flex items-center justify-between mb-2"}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg">
          {daysLeft > 0 ? (
            <ThumbsUp className="h-5 w-5 bg-card"/>
          ): (
            <ThumbsDown className="h-5 w-5 bg-card"/>
          )}
        </div>

        <Badge
          className={`bg-green-600 ${daysLeft > 0 ? "bg-green-500 text-white" : "bg-secondary text-secondary-foreground"}`}
        >
          {daysLeft > 0 ? "Active" : "Closed"}
        </Badge>

      </div>

      <div className="space-y-1">
        <h3 className="text-base md:text-lg font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <p className="text-sm font-medium">
        Vote Price:
        <span className="font-bold"> GH₵ {votePrice} </span>
      </p>

      <ButtonLink
        href={`/events/${eventId}/${id}`}
        label={"View Nominees"}
        disabled={daysLeft === 0}
      />
    </div>
  );
};

export default CategoryCard;
