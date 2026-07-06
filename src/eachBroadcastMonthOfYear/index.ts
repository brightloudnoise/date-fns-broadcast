import { broadcastMonthStartByOrdinal } from "../_broadcastMonthCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastMonthOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = resolveYearStartMonth(options);
  return Array.from({ length: 12 }, (_, i) =>
    broadcastMonthStartByOrdinal(year, i, yearStartMonth),
  );
}
