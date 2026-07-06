import {
  broadcastYearStart,
  resolveYearStartMonth,
} from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function startOfBroadcastYearByNumber(
  year: number,
  options?: BroadcastOptions,
): Date {
  return broadcastYearStart(year, resolveYearStartMonth(options));
}
