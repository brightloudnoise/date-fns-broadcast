import type { DateArg } from "date-fns";
import {
  broadcastMonthAnchor,
  calendarMonthBlockEnd,
} from "../_broadcastMonthCore";

/**
 * End of the broadcast month **containing** `date` — the last Sunday of the
 * calendar month that month is named after, at the last instant of that day.
 *
 * The counterpart to `startOfBroadcastMonth`, and "containing" in the same
 * sense: 29 Jan 2024 is in broadcast February, so this answers `Sun 25 Feb
 * 2024`, not January's `Sun 28 Jan`.
 */
export function endOfBroadcastMonth(date: DateArg<Date>) {
  return calendarMonthBlockEnd(broadcastMonthAnchor(date));
}
