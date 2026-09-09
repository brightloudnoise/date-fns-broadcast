import { resolveYearStartMonth, weekCountOf } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function countBroadcastWeeksInYear(
  year: number,
  options?: BroadcastOptions,
): 52 | 53 {
  return weekCountOf(year, resolveYearStartMonth(options));
}
