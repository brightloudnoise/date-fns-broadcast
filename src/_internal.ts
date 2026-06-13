import type { DateArg } from "date-fns";
import { getDay, isLeapYear, toDate } from "date-fns";
import { startOfBroadcastMonth } from "./startOfBroadcastMonth";

export function isBroadcast53WeekYear(
  calendarYear: number,
  yearStartMonth: number,
): boolean {
  const dayOfWeek = getDay(new Date(calendarYear, yearStartMonth, 1));
  const yearWithFeb = yearStartMonth >= 2 ? calendarYear + 1 : calendarYear;
  const leap = isLeapYear(new Date(yearWithFeb, 0, 1));
  return dayOfWeek === 0 || (leap && dayOfWeek === 6);
}

/**
 * Returns the first day of the calendar month that the broadcast month
 * containing `date` is named after.
 *
 * A broadcast month runs from the Monday on/before the 1st of its calendar
 * month to the Sunday before the next month's start, so a date can sit in a
 * broadcast month belonging to the adjacent calendar month (e.g. Aug 26, 2024
 * falls in broadcast September 2024). The returned Date carries both the
 * calendar month and year of that block, with year rollover handled.
 *
 * This is the calendar identity of the broadcast month and is independent of
 * where the broadcast year starts (`yearStartMonth`).
 */
export function broadcastMonthAnchor(date: DateArg<Date>): Date {
  const dateObj = toDate(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();

  // Date constructor normalizes month overflow/underflow, rolling the year.
  if (dateObj >= startOfBroadcastMonth(new Date(year, month + 1, 1))) {
    return new Date(year, month + 1, 1);
  }
  if (dateObj >= startOfBroadcastMonth(new Date(year, month, 1))) {
    return new Date(year, month, 1);
  }
  return new Date(year, month - 1, 1);
}
