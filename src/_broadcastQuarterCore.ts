import type { DateArg } from "date-fns";
import { addWeeks, differenceInWeeks } from "date-fns";
import { startOfBroadcastWeek } from "./startOfBroadcastWeek";
import {
  broadcastWeekOf,
  broadcastYear,
  broadcastYearEnd,
  broadcastYearStart,
} from "./_broadcastYearCore";
import type { YearStartMonth } from "./types";

/**
 * The single source of truth for the Broadcast Quarter: the Broadcast Week →
 * quarter mapping (13-week blocks), and each quarter's start/end. Built on the
 * Broadcast Year core; the "Q4 runs to the year end" special case (14 weeks in
 * a 53-Week Year) lives here, once.
 */

export type BroadcastQuarterNumber = 1 | 2 | 3 | 4;

/** Broadcast Week Number (1..53) → its Broadcast Quarter. */
export function quarterOfWeek(weekNumber: number): BroadcastQuarterNumber {
  return Math.ceil(Math.min(weekNumber, 52) / 13) as BroadcastQuarterNumber;
}

/** Start of quarter `quarter` (1..4) of Broadcast Year `year`. */
export function broadcastQuarterStart(
  year: number,
  quarter: BroadcastQuarterNumber,
  ysm: YearStartMonth,
): Date {
  return addWeeks(broadcastYearStart(year, ysm), (quarter - 1) * 13);
}

/** End of quarter `quarter`: Q4 runs to the year end, otherwise next quarter − 1ms. */
export function broadcastQuarterEnd(
  year: number,
  quarter: BroadcastQuarterNumber,
  ysm: YearStartMonth,
): Date {
  if (quarter === 4) return broadcastYearEnd(year, ysm);
  return new Date(
    broadcastQuarterStart(
      year,
      (quarter + 1) as BroadcastQuarterNumber,
      ysm,
    ).getTime() - 1,
  );
}

/** Broadcast Quarter (1..4) the date falls in. */
export function broadcastQuarterOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): BroadcastQuarterNumber {
  return quarterOfWeek(broadcastWeekOf(date, ysm));
}

/** Immutable descriptor of the Broadcast Quarter a date falls in. */
export interface BroadcastQuarterInfo {
  /** Broadcast Year Number the quarter belongs to. */
  readonly year: number;
  /** Quarter number, 1..4. */
  readonly quarter: BroadcastQuarterNumber;
  /** Quarter start (a Monday). */
  readonly start: Date;
  /** Last instant of the quarter. */
  readonly end: Date;
}

/**
 * One-shot descriptor for the Broadcast Quarter a date falls in. Classifies the
 * broadcast year exactly once.
 */
export function broadcastQuarter(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): BroadcastQuarterInfo {
  const { year, start: yearStart, end: yearEnd, weekCount } = broadcastYear(
    date,
    ysm,
  );
  const weekNumber = Math.min(
    differenceInWeeks(startOfBroadcastWeek(date), yearStart) + 1,
    weekCount,
  );
  const quarter = quarterOfWeek(weekNumber);
  const start = addWeeks(yearStart, (quarter - 1) * 13);
  const end =
    quarter === 4 ? yearEnd : new Date(addWeeks(start, 13).getTime() - 1);
  return { year, quarter, start, end };
}
