import type { DateArg } from "date-fns";
import {
  broadcastYearEnd,
  broadcastYearOf,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function endOfBroadcastYear<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType {
  const yearStartMonth = resolveYearStartMonth(options);
  return broadcastYearEnd(
    broadcastYearOf(date, yearStartMonth),
    yearStartMonth,
    date,
  );
}
