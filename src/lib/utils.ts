import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates milliseconds remaining until the next minute boundary.
 * Used for zero-drift polling.
 */
export const getMsToNextMinute = () => {
  const now = Date.now();
  // Calculate ms till next minute boundary + 2000ms safety buffer
  // to ensure backend has finished aggregating the previous minute.
  return (60000 - (now % 60000)) + 2000;
};
