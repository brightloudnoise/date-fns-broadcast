import type { DateArg } from "date-fns";
import {
  broadcastYearOf,
  broadcastYearStart,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function startOfBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = resolveYearStartMonth(options);
  return broadcastYearStart(broadcastYearOf(date, yearStartMonth), yearStartMonth);
}
