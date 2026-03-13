import { eachBroadcastWeekOfMonth } from "../eachBroadcastWeekOfMonth";

export function countBroadcastWeeksInMonth(date: Date): 4 | 5 {
  return eachBroadcastWeekOfMonth(date).length as 4 | 5;
}
