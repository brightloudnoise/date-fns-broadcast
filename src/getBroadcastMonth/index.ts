import type { DateArg } from "date-fns";
import { broadcastMonthNumber } from "../_broadcastMonthCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastMonth(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return broadcastMonthNumber(date, resolveYearStartMonth(options));
}
