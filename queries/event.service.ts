import { useQuery } from "@tanstack/react-query";
import {
  getEvents,
  getEvent,
  getEventCategories,
  getNominees,
  getNominee,
  EventStatus
} from "@/actions/event.actions";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (query: string = "", status: EventStatus = "all") =>
    [...eventKeys.lists(), { query, status }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  categories: (eventId: string) =>
    [...eventKeys.detail(eventId), "categories"] as const,
  nominees: (categoryId: string) =>
    [...eventKeys.all, "nominees", categoryId] as const,
  nominee: (nomineeId: string) =>
    [...eventKeys.all, "nominee", nomineeId] as const,
};

export function useEvents(query: string = "", status: EventStatus = "all") {
  return useQuery({
    queryKey: eventKeys.list(query, status),
    queryFn: () => getEvents({ query, status }),
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
  });
}

export function useEventCategories(eventId: string) {
  return useQuery({
    queryKey: eventKeys.categories(eventId),
    queryFn: () => getEventCategories(eventId),
    enabled: !!eventId,
  });
}

export function useNominees(categoryId: string) {
  return useQuery({
    queryKey: eventKeys.nominees(categoryId),
    queryFn: () => getNominees(categoryId),
    enabled: !!categoryId,
  });
}

export function useNominee(nomineeId: string) {
  return useQuery({
    queryKey: eventKeys.nominee(nomineeId),
    queryFn: () => getNominee(nomineeId),
    enabled: !!nomineeId,
  });
}
