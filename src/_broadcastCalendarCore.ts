import type { DateArg } from "date-fns";
import {
  addMonths,
  addWeeks,
  constructFrom,
  getDay,
  getMonth,
  getYear,
  set,
  startOfDay,
  startOfWeek,
  subDays,
  toDate,
} from "date-fns";
import type { BroadcastOptions, YearStartMonth } from "./types";
import { DEFAULT_YEAR_START_MONTH } from "./types";

/**
 * The generating fact of the Broadcast Calendar, and the only place a period
 * boundary is ever computed.
 *
 * A Broadcast Year is thirteen instants: the starts of its twelve Broadcast
 * Months, plus the start of the *next* Broadcast Year as a sentinel. Every
 * other period is a slice of that array:
 *
 * ```
 *   year            t[0] .. t[12] - 1ms
 *   month k (0..11) t[k] .. t[k + 1] - 1ms
 *   quarter q (0..3) t[3q] .. t[3q + 3] - 1ms
 *   weeks in year   (t[12] - t[0]) / one week
 * ```
 *
 * The sentinel is what makes that possible. With it, "end" has exactly one
 * definition — *the next boundary, less a millisecond* — so there is no
 * separate rule for the end of a month, the end of a quarter, or the end of a
 * year that could drift out of agreement with the others. Three such rules used
 * to exist, and every defect this library has shipped came from two of them
 * disagreeing: bounds naming a different month than the label
 * (`startOfBroadcastMonth` vs `formatBroadcastMonth`), quarters stepping 13
 * weeks while months said otherwise, and a year boundary classifying its own
 * first day as the year before.
 *
 * The same applies to zones. The table is built once, in the caller's frame, so
 * there is a single construction site rather than one per period type.
 */

/** One week, in milliseconds. Periods are whole weeks by construction. */
const WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * First instant of a calendar month, in `context`'s frame when one is given.
 *
 * `set` writes the target zone's wall-clock fields and keeps the subclass;
 * `constructFrom` would keep the class but reinterpret the instant, and a bare
 * `new Date(y, m, 1)` would silently re-read the wall clock in the machine's
 * zone. Number-keyed callers with no date to inherit from get a plain `Date`,
 * which is the documented limit of that part of the API.
 */
function monthFirst<DateType extends Date>(
  year: number,
  month0: number,
  context?: DateArg<DateType>,
): DateType {
  if (context === undefined) return new Date(year, month0, 1) as DateType;
  const ctx = toDate(context) as DateType;
  // A plain Date already lives in the machine's zone, so direct construction is
  // the same instant as writing the fields — and materially cheaper on a path
  // every lookup takes.
  if (ctx.constructor === Date) return new Date(year, month0, 1) as DateType;
  return startOfDay(set(ctx, { year, month: month0, date: 1 }));
}

/**
 * Start of the broadcast block named after a calendar month: the Monday on or
 * before the 1st. This is the calendar's single rule, applied thirteen times to
 * build a year; nothing else in the library reproduces it.
 */
function blockStart<DateType extends Date>(first: DateType): DateType {
  const dayOfWeek = getDay(first);
  // `subDays`, not `setDay`: same answer, materially cheaper, and it still
  // preserves the subclass. A table is thirteen of these, on every lookup.
  return dayOfWeek === 1 ? first : subDays(first, (dayOfWeek + 6) % 7);
}

/**
 * Memo for the plain-`Date` case, which is both the common one and the only one
 * whose table depends on nothing but `(year, ysm)`.
 *
 * Timestamps are cached rather than dates, and each hit builds fresh `Date`
 * objects, so nothing mutable is ever shared with a caller. Zone-carrying
 * inputs skip the cache entirely: their table depends on the zone they carry,
 * which is not part of any key here. Correctness first, speed for the rest.
 */
const slotCache = new Map<string, number>();
/** Whole assembled tables, so a repeat lookup is one map hit, not thirteen. */
const tableCache = new Map<string, number[]>();
const SLOT_CACHE_LIMIT = 8192;

function remember(key: string, value: number): number {
  if (slotCache.size >= SLOT_CACHE_LIMIT) slotCache.clear();
  slotCache.set(key, value);
  return value;
}

/**
 * Cache key for a table, or `null` when the context cannot be keyed safely.
 *
 * A plain `Date` (or no context) keys on the year and anchor alone. A
 * zone-carrying date keys additionally on its class and the zone it names, so
 * two different zones can never share an entry. Anything exotic that exposes no
 * zone string is not cached at all — a slow correct answer beats a fast wrong
 * one.
 */
function cacheKeyFor(year: number, ysm: YearStartMonth, ctx?: Date): string | null {
  if (ctx === undefined || ctx.constructor === Date) return `${year}|${ysm}`;
  const zone = (ctx as { timeZone?: unknown }).timeZone;
  return typeof zone === "string"
    ? `${year}|${ysm}|${ctx.constructor.name}|${zone}`
    : null;
}

/**
 * The thirteen boundaries of Broadcast Year `year`: twelve month starts, then
 * the next year's start.
 *
 * `addMonths(startOfMonth(...))`, never `new Date(y, m + n, 1)` — composition
 * keeps the caller's class and zone, and still rolls the calendar year over.
 */
/**
 * The thirteen boundaries as **instants**.
 *
 * The table is a set of moments; turning them into date objects is
 * presentation, and an expensive one for zone-carrying classes. Lookups compare
 * numbers and then materialise only the one or two boundaries the caller
 * actually wants, instead of building all thirteen every time.
 */
function broadcastYearTableMs<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): number[] {
  const ctx = context === undefined ? undefined : (toDate(context) as DateType);
  const base = cacheKeyFor(year, ysm, ctx);
  if (base !== null) {
    const whole = tableCache.get(base);
    if (whole !== undefined) return whole;
  }
  const anchor = monthFirst(year, ysm, ctx);
  const table: number[] = [];
  for (let i = 0; i <= 12; i++) {
    const key = base === null ? null : `${base}|${i}`;
    const hit = key === null ? undefined : slotCache.get(key);
    if (hit !== undefined) {
      table.push(hit);
      continue;
    }
    const value = blockStart(i === 0 ? anchor : addMonths(anchor, i)).getTime();
    table.push(key === null ? value : remember(key, value));
  }
  if (base !== null) {
    if (tableCache.size >= SLOT_CACHE_LIMIT) tableCache.clear();
    tableCache.set(base, table);
  }
  return table;
}

/** Turn one boundary instant back into a date in the caller's frame. */
function materialize<DateType extends Date>(
  ms: number,
  context?: DateArg<DateType>,
): DateType {
  if (context === undefined) return new Date(ms) as DateType;
  // From a raw instant `constructFrom` is exact: it keeps the class and zone
  // and lands on the same moment. (From wall-clock *fields* it would not be.)
  return constructFrom(context, ms);
}

/**
 * One boundary of a year's table, without building the other twelve.
 *
 * Same rule as {@link broadcastYearTableMs} — it *is* that rule, applied to a
 * single slot — so there is still one definition of where a period begins. It
 * exists because most questions want one or two boundaries, and materialising
 * thirteen to answer them made scattered lookups several times more expensive
 * than the arithmetic they replaced.
 */
function boundaryAt<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  slot: number,
  context?: DateArg<DateType>,
): number {
  const ctx = context === undefined ? undefined : (toDate(context) as DateType);
  const base = cacheKeyFor(year, ysm, ctx);
  if (base !== null) {
    const hit = slotCache.get(`${base}|${slot}`);
    if (hit !== undefined) return hit;
  }
  const anchor = monthFirst(year, ysm, ctx);
  const value = blockStart(
    slot === 0 ? anchor : addMonths(anchor, slot),
  ).getTime();
  return base === null ? value : remember(`${base}|${slot}`, value);
}

/**
 * Which slot of which Broadcast Year holds `date`, in constant time.
 *
 * Finds the containing month block by testing at most three candidates around
 * the date's own calendar month, then converts that month to a (year, slot)
 * pair arithmetically. No table is built.
 */
function monthSlotOf<DateType extends Date>(
  dateObj: DateType,
  ysm: YearStartMonth,
): { year: number; slot: number } {
  const t = dateObj.getTime();
  const first = monthFirst(getYear(dateObj), getMonth(dateObj), dateObj);
  let named = first;
  if (t >= blockStart(addMonths(first, 1)).getTime()) {
    named = addMonths(first, 1);
  } else if (t < blockStart(first).getTime()) {
    named = addMonths(first, -1);
  }
  const month0 = getMonth(named);
  const calendarYear = getYear(named);
  const slot = (month0 - ysm + 12) % 12;
  return { year: month0 < ysm ? calendarYear - 1 : calendarYear, slot };
}

/**
 * The table of the Broadcast Year containing `date`, with the date's month
 * index (0..11) inside it. The one lookup every date-keyed question goes
 * through, so month, quarter and year answers cannot disagree.
 */
function broadcastYearTableOf<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): { year: number; index: number; context: DateType } {
  const dateObj = toDate(date) as DateType;
  if (dateObj.constructor === Date) {
    // Plain dates: constant-time, three cheap constructions, nothing cached.
    const { year, slot } = monthSlotOf(dateObj, ysm);
    return { year, index: slot, context: dateObj };
  }
  // Zone-carrying dates: every construction is expensive, so pay once for the
  // year's table (memoised per zone) and settle the slot by comparing numbers.
  const t = dateObj.getTime();
  let year = getYear(dateObj);
  let table = broadcastYearTableMs(year, ysm, dateObj);
  if (t < table[0]) table = broadcastYearTableMs(--year, ysm, dateObj);
  else if (t >= table[12]) table = broadcastYearTableMs(++year, ysm, dateObj);
  let index = 11;
  for (let i = 0; i < 12; i++) {
    if (t < table[i + 1]) {
      index = i;
      break;
    }
  }
  return { year, index, context: dateObj };
}

/** Last instant of the slice that starts at `next`: one millisecond before it. */
function endOfSlice<DateType extends Date>(
  nextMs: number,
  context?: DateArg<DateType>,
): DateType {
  return materialize(nextMs - 1, context);
}

/** Whole weeks between two boundary instants. Exact: periods are whole weeks. */
function weeksBetween(start: Date | number, end: Date | number): number {
  return Math.round((Number(end) - Number(start)) / WEEK);
}

/** Broadcast Week start for any date: the Monday on or before it. */
function broadcastWeekStart<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  return startOfWeek(date, { weekStartsOn: 1 });
}

// ---------------------------------------------------------------------------
// The interface. Everything above is how; everything below is what callers ask.
// ---------------------------------------------------------------------------

/** The three periods that are slices of the year table. */
export type BroadcastUnit = "month" | "quarter" | "year";

/** How many table slots one unit spans. */
const SPAN: Record<BroadcastUnit, number> = { month: 1, quarter: 3, year: 12 };

/**
 * Resolve `yearStartMonth`, applying {@link DEFAULT_YEAR_START_MONTH}. The one
 * place the default lives — public wrappers call this at their boundary, so the
 * core never carries an unresolved `undefined`.
 */
export function resolveYearStartMonth(
  options?: BroadcastOptions,
): YearStartMonth {
  return options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH;
}

/**
 * The anchor to use when only month *bounds* are wanted.
 *
 * Month boundaries are the same instants whatever the Year Start Month — the
 * anchor decides how months group into years, and therefore their numbers,
 * never where a month begins. So the public month bounds stay anchor-free, as
 * their signatures promise.
 */
export const MONTH_BOUNDS_ANCHOR = 0 as YearStartMonth;

/** A resolved period: where it runs, which one it is, and whose year it is in. */
export interface BroadcastPeriod<DateType extends Date = Date> {
  /** Broadcast Year Number the period belongs to. */
  readonly year: number;
  /** 1-based position within that year: month 1..12, quarter 1..4, year 1. */
  readonly number: number;
  readonly start: DateType;
  readonly end: DateType;
}

/**
 * The period of `unit` containing `date`.
 *
 * The one question every date-keyed public function asks. Month, quarter and
 * year all resolve through the same table lookup, so they cannot disagree about
 * which period a date is in — which is exactly how a date could once sit
 * outside the month its own bounds named.
 */
export function periodOf<DateType extends Date>(
  date: DateArg<DateType>,
  unit: BroadcastUnit,
  ysm: YearStartMonth,
): BroadcastPeriod<DateType> {
  const { year, index, context } = broadcastYearTableOf(date, ysm);
  const span = SPAN[unit];
  const first = Math.floor(index / span) * span;
  return {
    year,
    number: first / span + 1,
    start: materialize(boundaryAt(year, ysm, first, context), context),
    end: endOfSlice(boundaryAt(year, ysm, first + span, context), context),
  };
}

/**
 * The `ordinal0`-th (0-based) period of `unit` in Broadcast Year `year`.
 *
 * The number-keyed counterpart. `context` supplies the frame to build in: a
 * year number carries no zone, so without one the result is machine-zoned,
 * which is the documented limit of the number-keyed API.
 */
export function periodByOrdinal<DateType extends Date>(
  year: number,
  unit: BroadcastUnit,
  ordinal0: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): { start: DateType; end: DateType } {
  const span = SPAN[unit];
  const first = ordinal0 * span;
  return {
    start: materialize(boundaryAt(year, ysm, first, context), context),
    end: endOfSlice(boundaryAt(year, ysm, first + span, context), context),
  };
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
  const { year, index, context } = broadcastYearTableOf(date, ysm);
  const absMonth = ysm + index;
  return monthFirst(year + Math.floor(absMonth / 12), absMonth % 12, context);
}

/** Broadcast Week Number (1..52/53) of a date, within its own Broadcast Year. */
export function weekNumberOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  const { year, context } = broadcastYearTableOf(date, ysm);
  return (
    weeksBetween(boundaryAt(year, ysm, 0, context), broadcastWeekStart(date)) + 1
  );
}

/** Whole weeks in a Broadcast Year: the span of its own boundaries. */
export function weekCountOf(year: number, ysm: YearStartMonth): 52 | 53 {
  return weeksBetween(
    boundaryAt(year, ysm, 0),
    boundaryAt(year, ysm, 12),
  ) as 52 | 53;
}

/**
 * Every Broadcast Week Start from `start` through `end` inclusive.
 *
 * `addWeeks`, not a fixed 7-day step: a DST transition inside the span would
 * otherwise slide later weeks off Monday.
 */
export function weeksBetweenDates<DateType extends Date>(
  start: DateType,
  end: DateType,
): DateType[] {
  const weeks: DateType[] = [];
  let current = start;
  while (current <= end) {
    weeks.push(current);
    current = addWeeks(current, 1);
  }
  return weeks;
}

/** Every Broadcast Week Start of a year, in order (length === week count). */
export function weeksOfYear(year: number, ysm: YearStartMonth): Date[] {
  const { start, end } = periodByOrdinal(year, "year", 0, ysm);
  return weeksBetweenDates(start, end);
}
