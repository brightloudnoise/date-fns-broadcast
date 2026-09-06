import type { DateArg } from "date-fns";
import { periodByOrdinal, periodOf, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastMonthOfQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType[] {
  const yearStartMonth = resolveYearStartMonth(options);
  const { year, number } = periodOf(date, "quarter", yearStartMonth);
  // `date` rides along as the construction context: the ordinal is a number and
  // carries no zone, so without it the months come back machine-zoned.
  return [0, 1, 2].map(
    (i) =>
      periodByOrdinal(
        year,
        "month",
        (number - 1) * 3 + i,
        yearStartMonth,
        date,
      ).start,
  );
}
