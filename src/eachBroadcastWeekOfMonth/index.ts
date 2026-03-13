import { addWeeks } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import { endOfBroadcastMonth } from "../endOfBroadcastMonth";

export function eachBroadcastWeekOfMonth(date: Date): Date[] {
  const start = startOfBroadcastMonth(date);
  const end = endOfBroadcastMonth(date);
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
