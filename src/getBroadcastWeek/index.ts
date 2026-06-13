import type { DateArg } from "date-fns";
import { broadcastWeekOf, resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastWeek(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return broadcastWeekOf(date, resolveYearStartMonth(options));
}
