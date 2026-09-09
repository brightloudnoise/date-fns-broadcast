import type { DateArg } from "date-fns";
import { periodOf, resolveYearStartMonth } from "../_broadcastCalendarCore";
import type { BroadcastOptions } from "../types";

export function startOfBroadcastQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType {
  return periodOf(date, "quarter", resolveYearStartMonth(options)).start;
}
