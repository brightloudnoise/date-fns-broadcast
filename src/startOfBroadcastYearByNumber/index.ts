import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function startOfBroadcastYearByNumber(
  year: number,
  options?: BroadcastOptions,
): Date {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
  return startOfBroadcastWeek(new Date(year, yearStartMonth, 1));
}
