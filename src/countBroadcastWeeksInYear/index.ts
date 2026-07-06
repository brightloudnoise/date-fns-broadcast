import {
  broadcastWeekCount,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function countBroadcastWeeksInYear(
  year: number,
  options?: BroadcastOptions,
): 52 | 53 {
  return broadcastWeekCount(year, resolveYearStartMonth(options));
}
