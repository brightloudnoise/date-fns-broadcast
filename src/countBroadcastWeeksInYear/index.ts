import { eachBroadcastWeekOfYear } from "../eachBroadcastWeekOfYear";

export function countBroadcastWeeksInYear(year: number): 52 | 53 {
  return eachBroadcastWeekOfYear(year).length as 52 | 53;
}
