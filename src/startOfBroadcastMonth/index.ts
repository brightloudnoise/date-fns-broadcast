import type { DateArg } from "date-fns";
import {
  broadcastMonthAnchor,
  calendarMonthBlockStart,
} from "../_broadcastMonthCore";

/**
 * Start of the broadcast month **containing** `date` — the Monday on or before
 * the 1st of the calendar month that month is named after.
 *
 * "Containing", not "named after `date`'s calendar month": the 1–6 days after a
 * calendar month's last Sunday belong to the *next* broadcast month, so 29 Jan
 * 2024 starts broadcast February and answers `Mon 29 Jan 2024`, matching
 * `formatBroadcastMonth`. Resolving the month first is what makes
 * `startOfBroadcastMonth(d) <= d <= endOfBroadcastMonth(d)` hold for every `d`.
 */
export function startOfBroadcastMonth(date: DateArg<Date>) {
  return calendarMonthBlockStart(broadcastMonthAnchor(date));
}
