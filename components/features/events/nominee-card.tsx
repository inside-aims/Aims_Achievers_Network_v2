'use client';

import {NomineeProps} from "@/components/features/events/index";
import Image from "next/image";
import {User, Code, Vote} from "lucide-react";
import {Button} from "@/components/ui/button";
import ButtonLink from "@/components/shared/button-link";

type NomineeCardProps = NomineeProps & {
  daysLeft: number;
  onVoteClick: (nominee: NomineeProps) => void;
  onInfoClick: (info: NomineeProps) => void;
}
const NomineeCard = (
  {
    nomineeId,
    nomineeCode,
    imageUrl,
    fullName,
    description,
    daysLeft,
    onVoteClick,
    onInfoClick,
  }: NomineeCardProps
) => {
  return (
    <div
      className="w-full group rounded-card border bg-card border-primary/10 overflow-hidden shadow-sm hover:shadow-md transition hover:scale-y-102 duration-300 ease-in-out ">
      <div className="h-44 w-full">
        <Image
          src={imageUrl}
          alt={`${description}-${nomineeCode}`}
          width={100}
          height={100}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col gap-2 md:gap-4 p-2 md:p-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold leading-tight line-clamp-1">
            {fullName}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {description}
          </p>
        </div>
        <p className="flex gap-2 text-sm text-muted-foreground line-clamp-1">
          <span><Code className={"w-4 h-4"}/></span>
          Code: {nomineeCode}
        </p>

        <p className="flex gap-2 text-sm text-muted-foreground line-clamp-1">
          <span><Vote className={"w-4 h-4"}/></span>
          Votes: 200
        </p>

        <div className={"flex items-center justify-between gap-2 md:gap-4"}>
          <div className={"flex-1"}>
            <ButtonLink
              label={"Vote"}
              icon={false}
              disabled={daysLeft === 0}
              onClick={() => onVoteClick?.({nomineeId, nomineeCode, imageUrl, fullName, description})}
            />
          </div>
          <Button
            variant={"outline"}
            className={"h-10"}
            onClick={() => onInfoClick?.({nomineeId, nomineeCode, imageUrl, fullName, description})}
          >
            <User/>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default NomineeCard;