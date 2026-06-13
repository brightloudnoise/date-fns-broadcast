import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import { getBroadcastYear } from "../getBroadcastYear";
import { getBroadcastQuarter } from "../getBroadcastQuarter";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function eachBroadcastMonthOfQuarter(
  date: Date,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const broadcastYear = getBroadcastYear(date, options);
  const quarter = getBroadcastQuarter(date, options);
  return [0, 1, 2].map((i) => {
    const absMonth = yearStartMonth + (quarter - 1) * 3 + i;
    return startOfBroadcastMonth(
      new Date(broadcastYear + Math.floor(absMonth / 12), absMonth % 12, 1),
    );
  });
}
