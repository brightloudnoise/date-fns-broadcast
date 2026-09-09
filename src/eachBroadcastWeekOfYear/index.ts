import { resolveYearStartMonth, weeksOfYear } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  return weeksOfYear(year, resolveYearStartMonth(options));
}
