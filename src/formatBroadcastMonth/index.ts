import type { DateArg } from "date-fns";
import { toDate, format } from "date-fns";
import { getBroadcastMonth } from "../getBroadcastMonth";
import { getBroadcastYear } from "../getBroadcastYear";

/**
 * Returns the formatted broadcast month label (e.g., "January 2024")
 * @param date Any date within the broadcast month
 * @param formatStr Optional custom format string (defaults to "MMMM yyyy")
 */
export function formatBroadcastMonth(
  date: DateArg<Date>,
  formatStr: string = "MMMM yyyy",
) {
  const dateObj = toDate(date);
  const month = getBroadcastMonth(dateObj);
  const year = getBroadcastYear(dateObj);

  // Create a date object for the first of the month in the broadcast year
  const formattingDate = new Date(year, month - 1, 1);
  return format(formattingDate, formatStr);
}
