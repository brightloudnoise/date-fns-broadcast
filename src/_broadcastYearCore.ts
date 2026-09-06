import type { DateArg } from "date-fns";
import { addWeeks } from "date-fns";
import {
  broadcastWeekStart,
  broadcastYearNumberOf,
  broadcastYearTable,
  broadcastYearTableMs,
  broadcastYearTableOf,
  endOfSlice,
  materialize,
  weeksBetween,
} from "./_broadcastCalendarCore";
import type { BroadcastOptions, YearStartMonth } from "./types";
import { DEFAULT_YEAR_START_MONTH } from "./types";

/**
 * Broadcast Year questions, answered as slices of the year table.
 *
 * The year is `table[0]` to `table[12] - 1ms`, and its week count is the span
 * between them. The 53-Week Year is therefore observed rather than ruled on:
 * there is no weekday test here that could disagree with where the boundaries
 * actually fell.
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

/** Broadcast Year Start: the Monday on/before the Anchor Date. */
export function broadcastYearStart<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return materialize(broadcastYearTableMs(year, ysm, context)[0], context);
}

/** Last instant of a Broadcast Year: the next year's start, less 1ms. */
export function broadcastYearEnd<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return endOfSlice(broadcastYearTableMs(year, ysm, context)[12], context);
}

/** Whole weeks in a Broadcast Year: the span of its own boundaries. */
export function broadcastWeekCount<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): 52 | 53 {
  const table = broadcastYearTableMs(year, ysm, context);
  return weeksBetween(table[0], table[12]) as 52 | 53;
}

/** Whether this is a 53-Week Year — read off the boundaries, not re-derived. */
export function is53WeekYear<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): boolean {
  return broadcastWeekCount(year, ysm, context) === 53;
}

/** Broadcast Year Number of a date. */
export function broadcastYearOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  return broadcastYearNumberOf(date, ysm);
}

/** Every Broadcast Week Start of a year, in order (length === week count). */
export function broadcastWeeksOf(year: number, ysm: YearStartMonth): Date[] {
  const table = broadcastYearTable(year, ysm);
  const weeks: Date[] = [];
  // `addWeeks`, not a fixed 7-day step in milliseconds: a DST transition inside
  // the year would otherwise slide later weeks off Monday.
  for (let w = 0, n = weeksBetween(table[0], table[12]); w < n; w++) {
    weeks.push(addWeeks(table[0], w));
  }
  return weeks;
}

/** Broadcast Week Number (1..52/53) of a date, within its own year. */
export function broadcastWeekOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  const { table } = broadcastYearTableOf(date, ysm);
  return weeksBetween(table[0], broadcastWeekStart(date)) + 1;
}

