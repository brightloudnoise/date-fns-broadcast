import type { DateArg } from "date-fns";
import { broadcastMonthStartByOrdinal } from "../_broadcastMonthCore";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastMonthOfQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = resolveYearStartMonth(options);
  const { year, quarter } = broadcastQuarter(date, yearStartMonth);
  return [0, 1, 2].map((i) =>
    broadcastMonthStartByOrdinal(year, (quarter - 1) * 3 + i, yearStartMonth),
  );
}
