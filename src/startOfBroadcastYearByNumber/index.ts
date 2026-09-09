import { periodByOrdinal, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function startOfBroadcastYearByNumber(
  year: number,
  options?: BroadcastOptions,
): Date {
  return periodByOrdinal(year, "year", 0, resolveYearStartMonth(options)).start;
}
