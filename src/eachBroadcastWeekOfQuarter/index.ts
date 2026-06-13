import { addWeeks } from "date-fns";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";
import { endOfBroadcastQuarter } from "../endOfBroadcastQuarter";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfQuarter(
  date: Date,
  options?: BroadcastOptions,
): Date[] {
  const start = startOfBroadcastQuarter(date, options);
  const end = endOfBroadcastQuarter(date, options);
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
