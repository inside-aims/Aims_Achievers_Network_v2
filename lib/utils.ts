import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Merges overrides into defaults, skipping undefined-valued keys — a plain
 *  spread lets an explicit `undefined` in overrides clobber the default. */
export function withDefaults<T extends object>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults }
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    if (overrides[key] !== undefined) result[key] = overrides[key] as T[keyof T]
  }
  return result
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
