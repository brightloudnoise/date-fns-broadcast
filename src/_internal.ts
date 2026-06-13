import { addWeeks } from "date-fns";

/**
 * Every Broadcast Week Start from `start` through `end` (inclusive), in order.
 *
 * The shared week-walk used by the `each*` range builders and the Broadcast Year
 * week list. Generic: it knows nothing about years, months, or quarters — it
 * just steps a Monday-aligned cursor one week at a time.
 */
export function eachBroadcastWeekBetween(start: Date, end: Date): Date[] {
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
