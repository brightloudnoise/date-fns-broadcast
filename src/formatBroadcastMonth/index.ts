import type { DateArg } from "date-fns";
import { format } from "date-fns";
import { broadcastMonthAnchor } from "../_internal";

/**
 * Formats the broadcast month containing `date` using a date-fns format string.
 *
 * The label reflects the calendar month/year that the broadcast month is named
 * after (e.g. Aug 26, 2024 → "September 2024"). This is a property of the
 * broadcast month calendar alone, so — unlike the year-relative helpers — it
 * takes no `yearStartMonth` option.
 */
export function formatBroadcastMonth(
  date: DateArg<Date>,
  formatStr: string = "MMMM yyyy",
) {
  return format(broadcastMonthAnchor(date), formatStr);
}
