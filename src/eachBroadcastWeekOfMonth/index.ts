import type { DateArg } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import { endOfBroadcastMonth } from "../endOfBroadcastMonth";
import { eachBroadcastWeekBetween } from "../_internal";

export function eachBroadcastWeekOfMonth<DateType extends Date>(
  date: DateArg<DateType>,
): DateType[] {
  return eachBroadcastWeekBetween(
    startOfBroadcastMonth(date),
    endOfBroadcastMonth(date),
  );
}
