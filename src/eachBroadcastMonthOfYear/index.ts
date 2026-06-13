import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function eachBroadcastMonthOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  return Array.from({ length: 12 }, (_, i) => {
    const absMonth = yearStartMonth + i;
    return startOfBroadcastMonth(
      new Date(year + Math.floor(absMonth / 12), absMonth % 12, 1),
    );
  });
}
