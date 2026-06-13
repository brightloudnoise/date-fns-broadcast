import type { DateArg } from "date-fns";
import { getYear, toDate } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { isBroadcast53WeekYear } from "../_internal";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function getBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const dateObj = toDate(date);
  const calendarYear = getYear(dateObj);

  const broadcastStartThisYear = startOfBroadcastWeek(
    new Date(calendarYear, yearStartMonth, 1),
  );
  const broadcastStartNextYear = startOfBroadcastWeek(
    new Date(calendarYear + 1, yearStartMonth, 1),
  );

  if (dateObj >= broadcastStartNextYear) {
    if (!isBroadcast53WeekYear(calendarYear, yearStartMonth))
      return calendarYear + 1;
  }

  if (dateObj < broadcastStartThisYear) return calendarYear - 1;

  return calendarYear;
}
