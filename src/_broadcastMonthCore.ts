import type { DateArg } from "date-fns";
import { toDate } from "date-fns";
import { startOfBroadcastMonth } from "./startOfBroadcastMonth";
import type { YearStartMonth } from "./types";

/**
 * The single source of truth for the Broadcast Month identity: which calendar
 * month a date's broadcast month is named after, that month's ordinal position
 * within a Broadcast Year, and the start of the n-th broadcast month of a year.
 *
 * The broadcast month's calendar identity is independent of where the broadcast
 * year starts; only its *number* (1..12) is year-relative, so only
 * {@link broadcastMonthNumber} and {@link broadcastMonthStartByOrdinal} take a
 * Year Start Month.
 */

/**
 * Returns the first day of the calendar month that the broadcast month
 * containing `date` is named after.
 *
 * A broadcast month runs from the Monday on/before the 1st of its calendar
 * month to the Sunday before the next month's start, so a date can sit in a
 * broadcast month belonging to the adjacent calendar month (e.g. Aug 26, 2024
 * falls in broadcast September 2024). The returned Date carries both the
 * calendar month and year of that block, with year rollover handled.
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

/**
 * Broadcast Month Number (1..12) of a date: the ordinal position of its
 * broadcast month within the Broadcast Year, where month 1 is the Year Start
 * Month.
 */
export function broadcastMonthNumber(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  const calendarMonth0 = broadcastMonthAnchor(date).getMonth();
  return ((calendarMonth0 - ysm + 12) % 12) + 1;
}

/**
 * Start of the broadcast month that is the `ordinal0`-th (0-based) month of
 * Broadcast Year `year` — i.e. month `ordinal0` steps after the Year Start
 * Month, with calendar-year rollover handled.
 */
export function broadcastMonthStartByOrdinal(
  year: number,
  ordinal0: number,
  ysm: YearStartMonth,
): Date {
  const absMonth = ysm + ordinal0;
  return startOfBroadcastMonth(
    new Date(year + Math.floor(absMonth / 12), absMonth % 12, 1),
  );
}
