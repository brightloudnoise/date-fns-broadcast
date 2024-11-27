import type { DateArg } from "date-fns";
import { toDate } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

/**
 * Returns the broadcast month number (1-12) for a given date
 * Broadcast months start on the Monday of the week containing the first of the month
 * and end on the last Sunday of the calendar month
 */
export function getBroadcastMonth(date: DateArg<Date>) {
  const dateObj = toDate(date);

  // Check if the date falls in the broadcast month of the next calendar month
  const nextMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
  const nextMonthStart = startOfBroadcastMonth(nextMonth);
  if (dateObj >= nextMonthStart) {
    return dateObj.getMonth() + 2 > 12 ? 1 : dateObj.getMonth() + 2;
  }

  // Check if the date falls in the broadcast month of the current calendar month
  const thisMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  const thisMonthStart = startOfBroadcastMonth(thisMonth);
  if (dateObj >= thisMonthStart) {
    return dateObj.getMonth() + 1;
  }

  // If we get here, the date falls in the broadcast month of the previous calendar month
  return dateObj.getMonth() || 12;
}
