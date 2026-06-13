import { addWeeks } from "date-fns";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";
import { endOfBroadcastYear } from "../endOfBroadcastYear";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function eachBroadcastWeekOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const start = startOfBroadcastYearByNumber(year, options);
  const end = endOfBroadcastYear(new Date(year, yearStartMonth, 15), options);
  const weeks: Date[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}
