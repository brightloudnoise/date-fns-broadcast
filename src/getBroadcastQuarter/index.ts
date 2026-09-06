import type { DateArg } from "date-fns";
import { periodOf, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return periodOf(date, "quarter", resolveYearStartMonth(options)).number as 1 | 2 | 3 | 4;
}
