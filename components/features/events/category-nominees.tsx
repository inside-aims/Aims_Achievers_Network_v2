'use client';

import {EVENTS, NomineeProps} from "@/components/features/events/index";
import {Button} from "@/components/ui/button";
import {Clock, User} from "lucide-react";
import {useRouter} from "next/navigation";
import {getDaysLeft} from "@/lib/utils";
import NomineeCard from "@/components/features/events/nominee-card";
import {useState} from "react";
import VotingModal from "@/components/features/events/voting-modal";
import InfoModal from "@/components/features/events/info-modal";
import FeatureNavigationWrapper from "@/components/shared/feature-navigation-wrapper";

const CategoryNominees = ({eventId,categoryId}: {eventId: string; categoryId: string}) => {
  const [openVoting, setOpenVoting] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [selectedNominee, setSelectedNominee] = useState<NomineeProps | null>(null);

  const router = useRouter();

  const event = EVENTS.find(e => e.eventId === eventId);
  const category = event?.categories.find(c => c.id === categoryId);

  if (!event) return <div>Event not found</div>;
  if (!category) return <div>No category found</div>;
  if (!category.nominees?.length) return <div>No nominees</div>;

  const daysLeft = getDaysLeft(event.endDate)

  // Helper for vote click
  const handleVoteClick = (nominee: NomineeProps) => {
    setSelectedNominee(nominee);
    setOpenInfo(false);
    setOpenVoting(true);
  };

  // Info on ussd info and procedures click
  const handleInfoClick = (nominee: NomineeProps) => {
    setSelectedNominee(nominee);
    setOpenVoting(false);
    setOpenInfo(true);
  }

  return (
    <FeatureNavigationWrapper key={"category-nominees"}>
      {/* Header */}
      <div className="space-y-2 md:space-y-4">
        <div className="space-y-2">
          <h1 className="text-xl font-bold md:text-4xl">
            {category?.name}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {category?.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-full text-sm">
            <User className="h-4 w-4 text-primary"/>
            {category?.nominees.length} Nominees
          </div>

          <Button
            variant={"ghost"}
            className="flex items-center gap-2 rounded-full border border-primary/10 bg-muted text-sm">
            <Clock className="h-4 w-4 text-primary"/>
            {daysLeft === 0 ? "Event ended" : `${daysLeft} days left`}
          </Button>

        </div>
      </div>

      {/* List selected event categories */}
      {category?.nominees.length > 0 && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {category?.nominees.map((nominee) => (
            <NomineeCard
              key={nominee.nomineeId}
              daysLeft={daysLeft}
              onVoteClick={handleVoteClick}
              onInfoClick={handleInfoClick}
              {...nominee}
            />
          ))}
        </div>
      )}

      {/*Initiate voting pop up modal*/}
      {openVoting && (
          <VotingModal
            open={openVoting}
            nominee={selectedNominee}
            setOpen={() => {
              setOpenVoting(false)
              setSelectedNominee(null)
            }}
          />
        )}

      {/*Info on ussd voting and procedures*/}
      {openInfo && (
        <InfoModal
          open={openInfo}
          nominee={selectedNominee}
          event={event.title}
          category={category.name}
          setOpen={() => {
            setOpenInfo(false);
            setSelectedNominee(null)
          }}
        />
      )}
    </FeatureNavigationWrapper>
  )
}
export default CategoryNominees;