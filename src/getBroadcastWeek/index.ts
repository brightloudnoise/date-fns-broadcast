import type { DateArg } from "date-fns";
import { differenceInWeeks, toDate } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import { isBroadcast53WeekYear } from "../_internal";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function getBroadcastWeek(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const dateObj = toDate(date);
  const broadcastYear = getBroadcastYear(dateObj, options);
  const yearStart = startOfBroadcastWeek(
    new Date(broadcastYear, yearStartMonth, 1),
  );
  const currentWeekStart = startOfBroadcastWeek(dateObj);
  const weekNumber = differenceInWeeks(currentWeekStart, yearStart) + 1;
  const is53 = isBroadcast53WeekYear(broadcastYear, yearStartMonth);
  return Math.min(weekNumber, is53 ? 53 : 52);
}
