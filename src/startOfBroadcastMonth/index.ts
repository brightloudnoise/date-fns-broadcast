import type { DateArg } from "date-fns";
import { MONTH_BOUNDS_ANCHOR, monthStartOf } from "../_broadcastMonthCore";

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
export function startOfBroadcastMonth<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  // Month bounds do not depend on the Year Start Month — only month
  // *numbers* are year-relative — so any anchor selects the same slice.
  return monthStartOf(date, MONTH_BOUNDS_ANCHOR);
}
