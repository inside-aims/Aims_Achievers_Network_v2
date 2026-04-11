"use client";

import { NomineeProps } from "@/components/features/events/index";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";
import { getDaysLeft } from "@/lib/utils";
import NomineeCard from "@/components/features/events/nominee-card";
import { useState } from "react";
import VotingModal from "@/components/features/events/voting-modal";
import InfoModal from "@/components/features/events/info-modal";
import FeatureNavigationWrapper from "@/components/shared/feature-navigation-wrapper";
import NominateButton from "@/components/features/events/nominate-button";
import { useCategoryNominees } from "@/hooks/use-category-nominees";
import { NomineeCardSkeleton } from "@/components/ui/skeleton";

const CategoryNominees = ({ eventId, categoryId }: { eventId: string; categoryId: string }) => {
  const [openVoting, setOpenVoting] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [selectedNominee, setSelectedNominee] = useState<NomineeProps | null>(null);

  const { category, votingConfig, nominees, loading, error } = useCategoryNominees(eventId, categoryId);

  const handleVoteClick = (nominee: NomineeProps) => {
    setSelectedNominee(nominee);
    setOpenInfo(false);
    setOpenVoting(true);
  };

  const handleInfoClick = (nominee: NomineeProps) => {
    setSelectedNominee(nominee);
    setOpenVoting(false);
    setOpenInfo(true);
  };

  if (loading) {
    return (
      <FeatureNavigationWrapper>
        <div className="space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <NomineeCardSkeleton key={i} />
          ))}
        </div>
      </FeatureNavigationWrapper>
    );
  }

  if (error || !category) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        {error ?? "Category not found"}
      </div>
    );
  }

  const daysLeft = getDaysLeft(category.eventEndDate);

  return (
    <FeatureNavigationWrapper key="category-nominees">
      {/* Header */}
      <div className="space-y-2 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-bold md:text-4xl">{category.name}</h1>
            <p className="max-w-2xl text-muted-foreground">{category.description}</p>
          </div>
          <NominateButton event={eventId} category={categoryId} />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 rounded-full text-sm">
              <User className="h-4 w-4 text-primary" />
              {nominees.length} Nominees
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full border border-primary/10 bg-muted text-sm"
            >
              <Clock className="h-4 w-4 text-primary" />
              {daysLeft === 0 ? "Event ended" : `${daysLeft} days left`}
            </Button>
          </div>
        </div>
      </div>

      {nominees.length > 0 && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {nominees.map((nominee) => (
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

      {nominees.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No nominees found for this category yet.
        </div>
      )}

      {openVoting && (
        <VotingModal
          open={openVoting}
          nominee={selectedNominee}
          votingConfig={votingConfig}
          setOpen={() => { setOpenVoting(false); setSelectedNominee(null); }}
        />
      )}

      {openInfo && (
        <InfoModal
          open={openInfo}
          nominee={selectedNominee}
          event={category.eventTitle}
          category={category.name}
          setOpen={() => { setOpenInfo(false); setSelectedNominee(null); }}
        />
      )}
    </FeatureNavigationWrapper>
  );
};

export default CategoryNominees;
