import {
  broadcastWeeksOf,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  return broadcastWeeksOf(year, resolveYearStartMonth(options));
}
