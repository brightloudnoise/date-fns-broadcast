import { eachBroadcastWeekOfYear } from "../eachBroadcastWeekOfYear";
import type { BroadcastOptions } from "../types";

export function countBroadcastWeeksInYear(
  year: number,
  options?: BroadcastOptions,
): 52 | 53 {
  return eachBroadcastWeekOfYear(year, options).length as 52 | 53;
}
