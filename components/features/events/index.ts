export type EventStatus = "all" | "active" | "past";

export interface NomineeProps {
  nomineeId: string;
  nomineeCode: string;
  fullName: string;
  description: string;
  imageUrl: string;
  votes: number;
}

export type EventCategory = {
  id: string;
  name: string;
  description: string;
  votePrice: number;
  nominees?: NomineeProps[];
};

export type EventCardProps = {
  eventId: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  categories: EventCategory[];
};
