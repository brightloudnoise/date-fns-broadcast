import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function eachBroadcastQuarterOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  return [0, 3, 6, 9].map((offset) => {
    const absMonth = yearStartMonth + offset;
    return startOfBroadcastQuarter(
      new Date(year + Math.floor(absMonth / 12), absMonth % 12, 1),
      options,
    );
  });
}
