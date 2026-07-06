import type { DateArg } from "date-fns";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import { eachBroadcastWeekBetween } from "../_internal";
import type { BroadcastOptions } from "../types";

export function eachBroadcastWeekOfQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
): Date[] {
  const { start, end } = broadcastQuarter(date, resolveYearStartMonth(options));
  return eachBroadcastWeekBetween(start, end);
}
