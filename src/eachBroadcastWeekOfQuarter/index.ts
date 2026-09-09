import type { DateArg } from "date-fns";
import { periodOf, resolveYearStartMonth, weeksBetweenDates } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType[] {
  const { start, end } = periodOf(date, "quarter", resolveYearStartMonth(options));
  return weeksBetweenDates(start, end);
}
