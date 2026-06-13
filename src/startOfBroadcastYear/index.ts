import type { DateArg } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function startOfBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const broadcastYear = getBroadcastYear(date, options);
  return startOfBroadcastWeek(new Date(broadcastYear, yearStartMonth, 1));
}
