import type { DateArg } from "date-fns";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function endOfBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  return broadcastQuarter(date, resolveYearStartMonth(options)).end;
}
