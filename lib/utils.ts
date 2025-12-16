import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDaysLeft = (eventDate: string) => {
  const today = new Date();
  const event = new Date(eventDate);

  today.setHours(0, 0, 0, 0);
  event.setHours(0, 0, 0, 0);

  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(diffDays, 0);
};
