import type { DateArg } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import { endOfBroadcastMonth } from "../endOfBroadcastMonth";
import { eachBroadcastWeekBetween } from "../_internal";

export function eachBroadcastWeekOfMonth(date: DateArg<Date>): Date[] {
  return eachBroadcastWeekBetween(
    startOfBroadcastMonth(date),
    endOfBroadcastMonth(date),
  );
}
