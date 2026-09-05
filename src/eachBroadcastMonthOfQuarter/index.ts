import type { DateArg } from "date-fns";
import { broadcastMonthStartByOrdinal } from "../_broadcastMonthCore";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastMonthOfQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType[] {
  const yearStartMonth = resolveYearStartMonth(options);
  const { year, quarter } = broadcastQuarter(date, yearStartMonth);
  // `date` rides along as the construction context: the ordinal is a number and
  // carries no zone, so without it the months come back machine-zoned.
  return [0, 1, 2].map((i) =>
    broadcastMonthStartByOrdinal(
      year,
      (quarter - 1) * 3 + i,
      yearStartMonth,
      date,
    ),
  );
}
