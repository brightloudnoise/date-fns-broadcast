import type { DateArg } from "date-fns";
import { endOfMonth, getDay } from "date-fns";

export function endOfBroadcastMonth(date: DateArg<Date>) {
  // Get the last day of the calendar month
  const lastDay = endOfMonth(date);
  const lastDayOfWeek = getDay(lastDay);

  // If the last day is Sunday, return it
  // Otherwise, return the last Sunday before it
  if (lastDayOfWeek === 0) {
    return lastDay;
  }

  // Subtract the number of days needed to get to the previous Sunday
  return new Date(lastDay.getTime() - lastDayOfWeek * 24 * 60 * 60 * 1000);
}
