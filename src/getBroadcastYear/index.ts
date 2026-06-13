import type { DateArg } from "date-fns";
import { broadcastYearOf, resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function getBroadcastYear(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return broadcastYearOf(date, resolveYearStartMonth(options));
}
