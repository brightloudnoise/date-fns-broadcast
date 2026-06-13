import type { DateArg } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function endOfBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  const broadcastYear = getBroadcastYear(date, options);
  const nextStart = startOfBroadcastWeek(
    new Date(broadcastYear + 1, yearStartMonth, 1),
  );
  return new Date(nextStart.getTime() - 1);
}
