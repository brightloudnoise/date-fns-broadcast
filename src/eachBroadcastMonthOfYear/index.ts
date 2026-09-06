import { periodByOrdinal, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastMonthOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = resolveYearStartMonth(options);
  return Array.from(
    { length: 12 },
    (_, i) => periodByOrdinal(year, "month", i, yearStartMonth).start,
  );
}
