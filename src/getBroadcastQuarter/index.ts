import type { DateArg } from "date-fns";
import { broadcastQuarterOf } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return broadcastQuarterOf(date, resolveYearStartMonth(options));
}
