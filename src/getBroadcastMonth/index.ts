import type { DateArg } from "date-fns";
import { broadcastMonthAnchor } from "../_internal";
import type { BroadcastOptions } from "../types";
import { DEFAULT_YEAR_START_MONTH } from "../types";

export function getBroadcastMonth(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const yearStartMonth = options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;

  // Calendar month (0-indexed) of the broadcast month containing this date.
  const calendarMonth0 = broadcastMonthAnchor(date).getMonth();

  // Convert to a broadcast-year-relative month number (1-indexed).
  return ((calendarMonth0 - yearStartMonth + 12) % 12) + 1;
}
