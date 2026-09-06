import type { DateArg } from "date-fns";
import { subMilliseconds, toDate } from "date-fns";
import {
  broadcastMonthNumber,
  broadcastMonthStartByOrdinal,
} from "./_broadcastMonthCore";
import { broadcastYearOf } from "./_broadcastYearCore";
import type { YearStartMonth } from "./types";

/**
 * The single source of truth for the Broadcast Quarter.
 *
 * A Broadcast Quarter is **three Broadcast Months**, and nothing else. It is not
 * a 13-week block: months are 4 or 5 weeks, so a quarter runs 12, 13 or 14
 * weeks, and only the four together are fixed at the year's 52 or 53. Measured
 * over 2000–2100 on both anchors, quarter lengths come out 12 (×11), 13 (×364)
 * and 14 (×29), summing to the year count every time.
 *
 * Deriving quarters from weeks instead is what let `getBroadcastMonth` and
 * `getBroadcastQuarter` disagree — 23 Feb 2026 under a September anchor is
 * month 7, which is quarter 3, while a 13-week block called it quarter 2. Every
 * boundary here now comes from {@link broadcastMonthStartByOrdinal}, so the two
 * cannot drift apart again.
 */

export type BroadcastQuarterNumber = 1 | 2 | 3 | 4;

/** Broadcast Month Number (1..12) → its Broadcast Quarter. */
export function quarterOfMonth(monthNumber: number): BroadcastQuarterNumber {
  return Math.ceil(monthNumber / 3) as BroadcastQuarterNumber;
}

/** Start of quarter `quarter` (1..4) of Broadcast Year `year`. */
export function broadcastQuarterStart<DateType extends Date>(
  year: number,
  quarter: BroadcastQuarterNumber,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return broadcastMonthStartByOrdinal(year, (quarter - 1) * 3, ysm, context);
}

/**
 * End of quarter `quarter`: the instant before its fourth month would start.
 *
 * Q4 needs no special case. Month ordinal 12 is the first month of the next
 * Broadcast Year, so `broadcastMonthStartByOrdinal(year, 12, ysm)` is that
 * year's start and Q4 ends 1ms before it — the same value `broadcastYearEnd`
 * gives, reached without a second rule that could drift from the first.
 */
export function broadcastQuarterEnd<DateType extends Date>(
  year: number,
  quarter: BroadcastQuarterNumber,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType {
  return subMilliseconds(
    broadcastMonthStartByOrdinal(year, quarter * 3, ysm, context),
    1,
  );
}

/** Broadcast Quarter (1..4) the date falls in. */
export function broadcastQuarterOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): BroadcastQuarterNumber {
  return quarterOfMonth(broadcastMonthNumber(date, ysm));
}

/** Immutable descriptor of the Broadcast Quarter a date falls in. */
export interface BroadcastQuarterInfo<DateType extends Date = Date> {
  /** Broadcast Year Number the quarter belongs to. */
  readonly year: number;
  /** Quarter number, 1..4. */
  readonly quarter: BroadcastQuarterNumber;
  /** Quarter start (a Monday). */
  readonly start: DateType;
  /** Last instant of the quarter. */
  readonly end: DateType;
}

/**
 * One-shot descriptor for the Broadcast Quarter a date falls in. Classifies the
 * broadcast year exactly once.
 */
export function broadcastQuarter<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): BroadcastQuarterInfo<DateType> {
  const dateObj = toDate(date) as DateType;
  const year = broadcastYearOf(dateObj, ysm);
  const quarter = quarterOfMonth(broadcastMonthNumber(dateObj, ysm));
  return {
    year,
    quarter,
    start: broadcastQuarterStart(year, quarter, ysm, dateObj),
    end: broadcastQuarterEnd(year, quarter, ysm, dateObj),
  };
}
