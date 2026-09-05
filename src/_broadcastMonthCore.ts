import type { DateArg } from "date-fns";
import {
  addMonths,
  endOfMonth,
  getDay,
  setDay,
  startOfDay,
  startOfMonth,
  subDays,
  set,
  toDate,
} from "date-fns";
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
 *
 * Two questions live here and they are **not** the same question:
 *
 * - *Where does the block named after this calendar month begin and end?* —
 *   {@link calendarMonthBlockStart} / {@link calendarMonthBlockEnd}. Pure
 *   calendar arithmetic; the input's day of month is ignored entirely.
 * - *Which broadcast month contains this date?* — {@link broadcastMonthAnchor}.
 *
 * They coincide for most of the month and diverge for the 1–6 days after a
 * calendar month's last Sunday, which belong to the **next** broadcast month.
 * Conflating them is what made `startOfBroadcastMonth(29 Jan 2024)` answer
 * "broadcast January" while `formatBroadcastMonth` answered "February 2024" —
 * an interval that did not contain its own argument, on 9.7% of all days.
 */

/**
 * Start of the broadcast block **named after** `date`'s calendar month: the
 * Monday on or before the 1st of that month.
 *
 * Keyed on the calendar month alone, so the day of month is irrelevant. This
 * is the primitive, not the public question — for the block *containing* a
 * date, compose it with {@link broadcastMonthAnchor}, which is what
 * `startOfBroadcastMonth` does.
 */
export function calendarMonthBlockStart<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  const firstOfMonth = startOfMonth(date);
  return getDay(firstOfMonth) === 1
    ? firstOfMonth
    : setDay(firstOfMonth, 1, { weekStartsOn: 1 });
}

/**
 * End of the broadcast block **named after** `date`'s calendar month: the last
 * Sunday of that month, at the last instant of the day.
 *
 * The counterpart to {@link calendarMonthBlockStart}, and keyed on the calendar
 * month in exactly the same way.
 */
export function calendarMonthBlockEnd<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  const lastDay = endOfMonth(date);
  // `subDays`, not millisecond arithmetic: a fixed 24h step reads the wrong
  // wall-clock day whenever a DST transition falls inside the span.
  return subDays(lastDay, getDay(lastDay));
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
 */
export function broadcastMonthAnchor<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  const dateObj = toDate(date) as DateType;
  // `addMonths(startOfMonth(...))`, never `new Date(y, m + n, 1)`: bare
  // construction drops the subclass and re-reads the wall clock in the
  // machine's zone, so a TZDate would be compared against a machine-zone
  // instant. `addMonths` still normalizes the year rollover.
  const thisMonth = startOfMonth(dateObj);
  const nextMonth = addMonths(thisMonth, 1);

  if (dateObj >= calendarMonthBlockStart(nextMonth)) return nextMonth;
  if (dateObj >= calendarMonthBlockStart(thisMonth)) return thisMonth;
  return addMonths(thisMonth, -1);
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
export function broadcastMonthStartByOrdinal<DateType extends Date>(
  year: number,
  ordinal0: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  const absMonth = ysm + ordinal0;
  return calendarMonthBlockStart(
    monthFirst(year + Math.floor(absMonth / 12), absMonth % 12, context),
  );
}

/**
 * First instant of a calendar month, built **in `context`'s frame** when one is
 * given so the result keeps that date's class and zone.
 *
 * Number-keyed entry points have no date to inherit a zone from, so they take
 * an explicit context. Without one this is a plain machine-zone `Date`, which
 * is the documented limit of the number-keyed API.
 */
export function monthFirst<DateType extends Date>(
  year: number,
  month0: number,
  context?: DateArg<DateType>,
): DateType {
  if (context === undefined) return new Date(year, month0, 1) as DateType;
  // `set` writes the target zone's wall-clock fields and keeps the subclass;
  // `constructFrom` would keep the class but reinterpret the instant.
  return startOfDay(
    set(toDate(context) as DateType, { year, month: month0, date: 1 }),
  );
}
