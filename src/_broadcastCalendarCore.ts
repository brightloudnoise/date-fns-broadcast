import type { DateArg } from "date-fns";
import {
  addMonths,
  constructFrom,
  getDay,
  getYear,
  set,
  startOfDay,
  startOfWeek,
  subDays,
  toDate,
} from "date-fns";
import type { YearStartMonth } from "./types";

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
export function monthFirst<DateType extends Date>(
  year: number,
  month0: number,
  context?: DateArg<DateType>,
): DateType {
  if (context === undefined) return new Date(year, month0, 1) as DateType;
  return startOfDay(
    set(toDate(context) as DateType, { year, month: month0, date: 1 }),
  );
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
const tableCache = new Map<string, number[]>();
const TABLE_CACHE_LIMIT = 512;

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
export function broadcastYearTableMs<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): number[] {
  const ctx = context === undefined ? undefined : (toDate(context) as DateType);
  const key = cacheKeyFor(year, ysm, ctx);
  if (key !== null) {
    const hit = tableCache.get(key);
    if (hit) return hit;
  }
  const anchor = monthFirst(year, ysm, ctx);
  const table: number[] = [];
  for (let i = 0; i <= 12; i++) {
    table.push(blockStart(i === 0 ? anchor : addMonths(anchor, i)).getTime());
  }
  if (key !== null) {
    if (tableCache.size >= TABLE_CACHE_LIMIT) tableCache.clear();
    tableCache.set(key, table);
  }
  return table;
}

/** Turn one boundary instant back into a date in the caller's frame. */
export function materialize<DateType extends Date>(
  ms: number,
  context?: DateArg<DateType>,
): DateType {
  if (context === undefined) return new Date(ms) as DateType;
  // From a raw instant `constructFrom` is exact: it keeps the class and zone
  // and lands on the same moment. (From wall-clock *fields* it would not be.)
  return constructFrom(context, ms);
}

/** The thirteen boundaries as dates, for callers that need all of them. */
export function broadcastYearTable<DateType extends Date>(
  year: number,
  ysm: YearStartMonth,
  context?: DateArg<DateType>,
): DateType[] {
  return broadcastYearTableMs(year, ysm, context).map((ms) =>
    materialize(ms, context),
  );
}

/**
 * The Broadcast Year Number containing `date`.
 *
 * Membership is decided by the boundaries alone: year Y runs from its own start
 * up to (not including) the next. There is deliberately no 53-week special case
 * — a 53-Week Year is the *consequence* of two starts being 53 weeks apart, not
 * an extra rule layered on top. Guarding this with `!is53WeekYear` made a
 * January-anchored year that opens on 31 Dec classify as the year before, for
 * 2013, 2041, 2069 and 2097.
 */
export function broadcastYearNumberOf(
  date: DateArg<Date>,
  ysm: YearStartMonth,
): number {
  return containingYear(toDate(date), ysm).year;
}

/**
 * The containing Broadcast Year and its table, built once.
 *
 * The calendar year is always within one of the answer, so this builds a single
 * table and steps at most once. Doing it as three separate boundary queries
 * cost three tables per lookup.
 */
function containingYear<DateType extends Date>(
  dateObj: DateType,
  ysm: YearStartMonth,
): { year: number; table: number[] } {
  const t = dateObj.getTime();
  let year = getYear(dateObj);
  let table = broadcastYearTableMs(year, ysm, dateObj);
  if (t < table[0]) {
    year -= 1;
    table = broadcastYearTableMs(year, ysm, dateObj);
  } else if (t >= table[12]) {
    year += 1;
    table = broadcastYearTableMs(year, ysm, dateObj);
  }
  return { year, table };
}

/**
 * The table of the Broadcast Year containing `date`, with the date's month
 * index (0..11) inside it. The one lookup every date-keyed question goes
 * through, so month, quarter and year answers cannot disagree.
 */
export function broadcastYearTableOf<DateType extends Date>(
  date: DateArg<DateType>,
  ysm: YearStartMonth,
): { year: number; table: number[]; index: number; context: DateType } {
  const dateObj = toDate(date) as DateType;
  const { year, table } = containingYear(dateObj, ysm);
  const t = dateObj.getTime();
  let index = 11;
  for (let i = 0; i < 12; i++) {
    if (t < table[i + 1]) {
      index = i;
      break;
    }
  }
  return { year, table, index, context: dateObj };
}

/** Last instant of the slice that starts at `next`: one millisecond before it. */
export function endOfSlice<DateType extends Date>(
  nextMs: number,
  context?: DateArg<DateType>,
): DateType {
  return materialize(nextMs - 1, context);
}

/** Whole weeks between two boundary instants. Exact: periods are whole weeks. */
export function weeksBetween(start: Date | number, end: Date | number): number {
  return Math.round((Number(end) - Number(start)) / WEEK);
}

/** Broadcast Week start for any date: the Monday on or before it. */
export function broadcastWeekStart<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  return startOfWeek(date, { weekStartsOn: 1 });
}
