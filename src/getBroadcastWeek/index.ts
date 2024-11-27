import type { DateArg } from "date-fns";
import {
  toDate,
  getYear,
  differenceInWeeks,
  isLeapYear,
  isSaturday,
  isSunday,
} from "date-fns";

import { startOfBroadcastWeek } from "../startOfBroadcastWeek";
import { getBroadcastYear } from "../getBroadcastYear";
import { startOfBroadcastYear } from "../startOfBroadcastYear";

/**
 * Returns the broadcast week number (1-53) for a given date
 * Broadcast weeks start on Monday and end on Sunday
 */
export function getBroadcastWeek(date: DateArg<Date>) {
  const dateObj = toDate(date);
  const calendarYear = getYear(dateObj);
  const nextYear = new Date(calendarYear + 1, 0, 1);
  const nextYearStart = startOfBroadcastWeek(nextYear);

  // Check if current year is a 53-week year
  const firstOfYear = new Date(calendarYear, 0, 1);
  const is53WeekYear =
    (isLeapYear(firstOfYear) &&
      (isSaturday(firstOfYear) || isSunday(firstOfYear))) ||
    (!isLeapYear(firstOfYear) && isSunday(firstOfYear));

  // Only switch to week 1 if we're not in a 53-week year
  if (dateObj >= nextYearStart && !is53WeekYear) {
    return 1;
  }

  const broadcastYear = getBroadcastYear(dateObj);
  const yearStart = startOfBroadcastYear(new Date(broadcastYear, 0, 1));
  const currentWeekStart = startOfBroadcastWeek(dateObj);

  // Calculate the difference in weeks from the start of broadcast year
  const weekNumber = differenceInWeeks(currentWeekStart, yearStart) + 1;

  // For the last week of December in a 53-week year
  if (is53WeekYear && weekNumber > 52) {
    return 53;
  }

  return Math.min(weekNumber, 52);
}
