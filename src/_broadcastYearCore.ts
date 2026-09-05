import type { DateArg } from "date-fns";
import {
  differenceInWeeks,
  getDay,
  getYear,
  isLeapYear,
  subMilliseconds,
  toDate,
} from "date-fns";
import { startOfBroadcastWeek } from "./startOfBroadcastWeek";
import { eachBroadcastWeekBetween } from "./_internal";
import { monthFirst } from "./_broadcastMonthCore";
import type { BroadcastOptions, YearStartMonth } from "./types";
import { DEFAULT_YEAR_START_MONTH } from "./types";

/**
 * The single source of truth for the Broadcast Year boundary: the Anchor Date →
 * Broadcast Year Start mapping, the 53-week-aware classification of a date to a
 * Broadcast Year Number, the 53-Week Year rule, and everything derived from the
 * year start/end (week count, week list, week-of-date).
 *
 * Every function below takes an already-resolved `YearStartMonth`, never the
 * loose `BroadcastOptions`. Public wrappers resolve the default exactly once via
 * {@link resolveYearStartMonth} and thread the plain value down, so the core can
 * never re-default or carry an unresolved `undefined`.
 */

/**
 * Resolve `yearStartMonth`, applying {@link DEFAULT_YEAR_START_MONTH}. The one
 * place the default lives — public wrappers call this at their boundary.
 */
export function resolveYearStartMonth(
  options?: BroadcastOptions,
): YearStartMonth {
  return options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
}

/**
 * Broadcast Year Start for a given Broadcast Year Number: the Monday on/before
 * the Anchor Date (the first day of the Year Start Month).
 */
export function broadcastYearStart<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return startOfBroadcastWeek(monthFirst(year, ysm, context));
}

/**
 * Whether the Broadcast Year with the given number is a 53-Week Year: when the
 * Anchor Date falls on a Sunday, or on a Saturday in a year whose nearest
 * following February is a leap month.
 */
export function is53WeekYear<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): boolean {
  const dayOfWeek = getDay(monthFirst(year, ysm, context));
  const yearWithFeb = ysm >= 2 ? year + 1 : year;
  // Leap-ness is a property of the year number alone, so this one needs no
  // context: no instant derived from it escapes.
  const leap = isLeapYear(new Date(yearWithFeb, 0, 1));
  return dayOfWeek === 0 || (leap && dayOfWeek === 6);
}

/**
 * Broadcast Year Number of a date: the calendar year of the Anchor Date the
 * date belongs to. A date in the trailing days of one calendar year can belong
 * to the next broadcast year (and vice versa), so the classification compares
 * against this year's and next year's starts, deferring to the 53-Week Year
 * rule at the upper boundary.
 */
export function broadcastYearOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  const dateObj = toDate(date);
  const calendarYear = getYear(dateObj);

  if (
    dateObj >= broadcastYearStart(calendarYear + 1, ysm, dateObj) &&
    !is53WeekYear(calendarYear, ysm, dateObj)
  ) {
    return calendarYear + 1;
  }
  if (dateObj < broadcastYearStart(calendarYear, ysm, dateObj)) {
    return calendarYear - 1;
  }
  return calendarYear;
}

/** Last instant of a Broadcast Year: the next year's start minus 1ms. */
export function broadcastYearEnd<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return subMilliseconds(broadcastYearStart(year + 1, ysm, context), 1);
}

/** Whole weeks in a Broadcast Year: 53 in a 53-Week Year, otherwise 52. */
export function broadcastWeekCount<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): 52 | 53 {
  return is53WeekYear(year, ysm, context) ? 53 : 52;
}

/** Every Broadcast Week Start of a year, in order (length === week count). */
export function broadcastWeeksOf(year: number, ysm: YearStartMonth): Date[] {
  return eachBroadcastWeekBetween(
    broadcastYearStart(year, ysm),
    broadcastYearEnd(year, ysm),
  );
}

/**
 * Broadcast Week Number (1..52/53) of a date, clamped to the length of the
 * broadcast year the date belongs to.
 */
export function broadcastWeekOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  const dateObj = toDate(date);
  const year = broadcastYearOf(dateObj, ysm);
  const weekNumber =
    differenceInWeeks(
      startOfBroadcastWeek(dateObj),
      broadcastYearStart(year, ysm, dateObj),
    ) + 1;
  return Math.min(weekNumber, broadcastWeekCount(year, ysm, dateObj));
}

/** Immutable descriptor of the Broadcast Year a date belongs to. */
export interface BroadcastYearInfo<DateType extends Date = Date> {
  /** Broadcast Year Number (calendar year of the Anchor Date). */
  readonly year: number;
  /** Broadcast Year Start (the Monday on/before the Anchor Date). */
  readonly start: DateType;
  /** Last instant of the year (next start minus 1ms). */
  readonly end: DateType;
  /** Whether this is a 53-Week Year. */
  readonly is53: boolean;
  /** Whole weeks in the year: 52 or 53. */
  readonly weekCount: 52 | 53;
}

/**
 * One-shot descriptor for callers that need several facts about the Broadcast
 * Year a date belongs to. Classifies the year exactly once.
 */
export function broadcastYear<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): BroadcastYearInfo<DateType> {
  const dateObj = toDate(date) as DateType;
  const year = broadcastYearOf(dateObj, ysm);
  const is53 = is53WeekYear(year, ysm, dateObj);
  return {
    year,
    start: broadcastYearStart(year, ysm, dateObj),
    end: broadcastYearEnd(year, ysm, dateObj),
    is53,
    weekCount: is53 ? 53 : 52,
  };
}
