import { addWeeks } from "date-fns";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";
import { endOfBroadcastYear } from "../endOfBroadcastYear";

export function eachBroadcastWeekOfYear(year: number): Date[] {
  const start = startOfBroadcastYearByNumber(year);
  const end = endOfBroadcastYear(new Date(year, 6, 15));
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
