import { periodByOrdinal, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastQuarterOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = resolveYearStartMonth(options);
  return Array.from(
    { length: 4 },
    (_, q) => periodByOrdinal(year, "quarter", q, yearStartMonth).start,
  );
}
