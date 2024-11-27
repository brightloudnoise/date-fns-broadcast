import type { DateArg } from "date-fns";
import { getYear, isLeapYear, isSaturday, isSunday, toDate } from "date-fns";
import { startOfBroadcastYear } from "../startOfBroadcastYear";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";

/**
 * Returns the broadcast year for a given date
 * The broadcast year can differ from the calendar year when
 * January 1st falls on certain days, causing the broadcast year
 * to start in the previous calendar year
 */
export function getBroadcastYear(date: DateArg<Date>) {
  const dateObj = toDate(date);
  const calendarYear = getYear(dateObj);

  // Check next year's January 1 first
  const nextYear = new Date(calendarYear + 1, 0, 1);

  // For any year, if we're in the last week of December that belongs to next year
  const nextYearStart = startOfBroadcastWeek(nextYear);
  if (dateObj >= nextYearStart) {
    // Check if current year is a 53-week year
    const firstOfYear = new Date(calendarYear, 0, 1);
    const is53WeekYear =
      (isLeapYear(firstOfYear) &&
        (isSaturday(firstOfYear) || isSunday(firstOfYear))) ||
      (!isLeapYear(firstOfYear) && isSunday(firstOfYear));

    if (!is53WeekYear) {
      return calendarYear + 1;
    }
  }

  // Check current year's January 1
  const firstOfYear = new Date(calendarYear, 0, 1);

  // If Jan 1 is Saturday in leap year or Sunday in any year,
  // check if we're before its first broadcast week
  if (
    (isLeapYear(firstOfYear) && isSaturday(firstOfYear)) ||
    isSunday(firstOfYear)
  ) {
    const broadcastYearStart = startOfBroadcastYear(firstOfYear);
    if (dateObj < broadcastYearStart) {
      return calendarYear - 1;
    }
  }

  return calendarYear;
}
