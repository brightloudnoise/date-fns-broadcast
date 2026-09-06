import type { DateArg } from "date-fns";
import { resolveYearStartMonth, weekNumberOf } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastWeek(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return weekNumberOf(date, resolveYearStartMonth(options));
}
