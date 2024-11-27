import type { DateArg } from "date-fns";
import { toDate } from "date-fns";
import { getBroadcastYear } from "../getBroadcastYear";
import { getBroadcastWeek } from "../getBroadcastWeek";

/**
 * Returns the broadcast quarter (1-4) for a given date
 * Broadcast quarters align with calendar quarters but may start earlier or end earlier
 * due to broadcast calendar rules
 */
export function getBroadcastQuarter(date: DateArg<Date>) {
  const dateObj = toDate(date);
  const broadcastYear = getBroadcastYear(dateObj);

  // If we're in the current year's Q1 spillover from previous year
  // (i.e., early January or late December that belongs to Q1)
  if (dateObj.getFullYear() !== broadcastYear) {
    return 1;
  }

  const weekNumber = getBroadcastWeek(dateObj);

  // Each quarter is 13 weeks, except in 53-week years where Q4 gets the extra week
  if (weekNumber <= 13) return 1;
  if (weekNumber <= 26) return 2;
  if (weekNumber <= 39) return 3;
  return 4;
}
