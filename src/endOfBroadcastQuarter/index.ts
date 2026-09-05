import type { DateArg } from "date-fns";
import { broadcastQuarter } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function endOfBroadcastQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType {
  return broadcastQuarter(date, resolveYearStartMonth(options)).end;
}
