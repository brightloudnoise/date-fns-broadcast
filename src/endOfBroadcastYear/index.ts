import type { DateArg } from "date-fns";
import {
  broadcastYearEnd,
  broadcastYearOf,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function endOfBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = resolveYearStartMonth(options);
  return broadcastYearEnd(broadcastYearOf(date, yearStartMonth), yearStartMonth);
}
