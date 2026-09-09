import type { DateArg } from "date-fns";
import { MONTH_BOUNDS_ANCHOR, periodOf, weeksBetweenDates } from "../_broadcastCalendarCore";

export function eachBroadcastWeekOfMonth<DateType extends Date>(
  date: DateArg<DateType>,
): DateType[] {
  const { start, end } = periodOf(date, "month", MONTH_BOUNDS_ANCHOR);
  return weeksBetweenDates(start, end);
}
