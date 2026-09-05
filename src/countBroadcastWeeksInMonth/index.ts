import type { DateArg } from "date-fns";
import { eachBroadcastWeekOfMonth } from "../eachBroadcastWeekOfMonth";

export function countBroadcastWeeksInMonth(date: DateArg<Date>): 4 | 5 {
  return eachBroadcastWeekOfMonth(date).length as 4 | 5;
}
