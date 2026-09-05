import type { DateArg } from "date-fns";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import { eachBroadcastWeekBetween } from "../_internal";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType[] {
  const { start, end } = broadcastQuarter(date, resolveYearStartMonth(options));
  return eachBroadcastWeekBetween(start, end);
}
