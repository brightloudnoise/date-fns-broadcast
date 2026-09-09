import type { DateArg } from "date-fns";
import { periodOf, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return periodOf(date, "year", resolveYearStartMonth(options)).year;
}
