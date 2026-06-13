import type { DateArg } from "date-fns";
import { addWeeks } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import { getBroadcastWeek } from "../getBroadcastWeek";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function startOfBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const broadcastYear = getBroadcastYear(date, options);
  const weekNumber = getBroadcastWeek(date, options);
  const quarter = Math.ceil(Math.min(weekNumber, 52) / 13);
  const yearStart = startOfBroadcastWeek(
    new Date(broadcastYear, yearStartMonth, 1),
  );
  return addWeeks(yearStart, (quarter - 1) * 13);
}
