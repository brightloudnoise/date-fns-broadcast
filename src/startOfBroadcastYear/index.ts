import type { DateArg } from "date-fns";
import {
  broadcastYearOf,
  broadcastYearStart,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function startOfBroadcastYear<DateType extends Date>(
  date: DateArg<DateType>,
  options?: BroadcastOptions,
): DateType {
  const yearStartMonth = resolveYearStartMonth(options);
  // `date` is threaded on as the construction context: the year start is keyed
  // on a year *number*, which carries no zone of its own.
  return broadcastYearStart(
    broadcastYearOf(date, yearStartMonth),
    yearStartMonth,
    date,
  );
}
