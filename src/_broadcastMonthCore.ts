import type { DateArg } from "date-fns";
import {
  boundaryAt,
  broadcastYearTableOf,
  endOfSlice,
  materialize,
  monthFirst,
} from "./_broadcastCalendarCore";
import type { YearStartMonth } from "./types";

/**
 * Broadcast Month questions, answered as slices of the year table.
 *
 * Everything here is a projection of {@link broadcastYearTable}; no boundary is
 * computed a second time. That is deliberate — this module used to own a
 * *second* month rule (`calendarMonthBlockStart`, "where does the block named
 * after this calendar month begin"), which `startOfBroadcastMonth` called while
 * `formatBroadcastMonth` went via the anchor. The two disagreed on 9.7% of days.
 * There is now only one way to ask.
 */

/** Start of the broadcast month containing `date`. */
export function monthStartOf<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): DateType {
  const { year, index, context } = broadcastYearTableOf(date, ysm);
  return materialize(boundaryAt(year, ysm, index, context), context);
}

/** Last instant of the broadcast month containing `date`. */
export function monthEndOf<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): DateType {
  const { year, index, context } = broadcastYearTableOf(date, ysm);
  return endOfSlice(boundaryAt(year, ysm, index + 1, context), context);
}

/**
 * Broadcast Month Number (1..12) of a date: its position in the Broadcast Year,
 * where month 1 is the Year Start Month.
 */
export function broadcastMonthNumber(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  return broadcastYearTableOf(date, ysm).index + 1;
}

/**
 * First of the calendar month the broadcast month containing `date` is *named
 * after* — broadcast February 2024 answers 1 Feb 2024, though it starts on
 * 29 Jan. This is the value to format: the month's identity, not its bounds.
 */
export function monthAnchorOf<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): DateType {
  const { year, index } = broadcastYearTableOf(date, ysm);
  const absMonth = ysm + index;
  return monthFirst(
    year + Math.floor(absMonth / 12),
    absMonth % 12,
    date as DateArg<DateType>,
  );
}

/**
 * Start of the `ordinal0`-th (0-based) broadcast month of Broadcast Year
 * `year`. `ordinal0` of 12 is the next year's first month, which is what lets
 * callers take a slice end without a special case.
 */
export function broadcastMonthStartByOrdinal<DateType extends Date>(
  year: number,
  ordinal0: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return materialize(boundaryAt(year, ysm, ordinal0, context), context);
}

/**
 * The anchor used when only month *bounds* are wanted.
 *
 * Month boundaries are the same instants whatever the Year Start Month — the
 * anchor decides how months are grouped into years and therefore their
 * numbers, never where a month begins. Any anchor selects the same slice, so
 * the public month bounds stay anchor-free, as their signatures promise.
 */
export const MONTH_BOUNDS_ANCHOR = 0 as YearStartMonth;
