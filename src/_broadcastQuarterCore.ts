import type { DateArg } from "date-fns";
import {
  boundaryAt,
  broadcastYearTableOf,
  endOfSlice,
  materialize,
} from "./_broadcastCalendarCore";
import type { YearStartMonth } from "./types";

/**
 * Broadcast Quarter questions, answered as slices of the year table.
 *
 * A quarter is three broadcast months — `table[3q]` to `table[3q + 3]` — so it
 * runs 12, 13 or 14 weeks, and only the four together are fixed at the year's
 * 52 or 53. It is not a 13-week block; see `docs/broadcast-quarters.md` for the
 * sourcing. Because the bounds are taken from the same array the month bounds
 * come from, a quarter cannot disagree with its own months, and Q4 needs no
 * "runs to the year end" rule: `table[12]` *is* the year end.
 */

export type BroadcastQuarterNumber = 1 | 2 | 3 | 4;

/** Broadcast Month Number (1..12) → its Broadcast Quarter. */
function quarterOfMonth(monthNumber: number): BroadcastQuarterNumber {
  return Math.ceil(monthNumber / 3) as BroadcastQuarterNumber;
}

/** Start of quarter `quarter` (1..4) of Broadcast Year `year`. */
export function broadcastQuarterStart<DateType extends Date>(
  year: number,
  quarter: BroadcastQuarterNumber,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return materialize(boundaryAt(year, ysm, (quarter - 1) * 3, context), context);
}

/** Broadcast Quarter (1..4) the date falls in. */
export function broadcastQuarterOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): BroadcastQuarterNumber {
  return quarterOfMonth(broadcastYearTableOf(date, ysm).index + 1);
}

/** Immutable descriptor of the Broadcast Quarter a date falls in. */
interface BroadcastQuarterInfo<DateType extends Date = Date> {
  readonly year: number;
  readonly quarter: BroadcastQuarterNumber;
  readonly start: DateType;
  readonly end: DateType;
}

/** One-shot descriptor: one table lookup answers all four fields. */
export function broadcastQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): BroadcastQuarterInfo<DateType> {
  const { year, index, context } = broadcastYearTableOf(date, ysm);
  const quarter = quarterOfMonth(index + 1);
  return {
    year,
    quarter,
    start: materialize(boundaryAt(year, ysm, (quarter - 1) * 3, context), context),
    end: endOfSlice(boundaryAt(year, ysm, quarter * 3, context), context),
  };
}
