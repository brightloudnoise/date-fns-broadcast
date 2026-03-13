import { addWeeks } from "date-fns";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";
import { endOfBroadcastQuarter } from "../endOfBroadcastQuarter";

export function eachBroadcastWeekOfQuarter(date: Date): Date[] {
  const start = startOfBroadcastQuarter(date);
  const end = endOfBroadcastQuarter(date);
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
