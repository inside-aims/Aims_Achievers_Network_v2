import { useQuery } from "@tanstack/react-query";
import { getOutlets, getOutlet } from "@/actions/outlet.actions";

export const outletKeys = {
  all: ["outlets"] as const,
  lists: () => [...outletKeys.all, "list"] as const,
  details: () => [...outletKeys.all, "detail"] as const,
  detail: (id: string) => [...outletKeys.details(), id] as const,
};

export function useOutlets() {
  return useQuery({
    queryKey: outletKeys.lists(),
    queryFn: () => getOutlets(),
  });
}

export function useOutlet(id: string) {
  return useQuery({
    queryKey: outletKeys.detail(id),
    queryFn: () => getOutlet(id),
    enabled: !!id,
  });
}
