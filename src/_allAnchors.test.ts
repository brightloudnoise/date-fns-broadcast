import { describe, expect, it } from "vitest";
import {
  countBroadcastWeeksInYear,
  eachBroadcastMonthOfYear,
  endOfBroadcastMonth,
  endOfBroadcastQuarter,
  endOfBroadcastWeek,
  endOfBroadcastYear,
  formatBroadcastMonth,
  getBroadcastMonth,
  getBroadcastQuarter,
  getBroadcastWeek,
  getBroadcastYear,
  startOfBroadcastMonth,
  startOfBroadcastQuarter,
  startOfBroadcastWeek,
  startOfBroadcastYear,
  startOfBroadcastYearByNumber,
} from "./index";
import type { YearStartMonth } from "./types";

/**
 * The same properties, on all twelve anchors rather than the two the README
 * called well-tested.
 *
 * `yearStartMonth` is typed `0-11`, so every one of those is a supported input
 * and a caller may reasonably pass it — a broadcast year anchored to April or
 * July is an ordinary fiscal arrangement. Until this file existed the suite
 * exercised January, September and the default, which meant the type promised
 * more than the tests checked.
 *
 * Kept separate from `_periodContainment.test.ts` rather than folded into its
 * `ANCHORS`, so the January and September cases stay legible as the two the
 * documented examples use.
 */

const ALL_ANCHORS: Array<YearStartMonth> = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Every day of 2024-2026: two leap years and a 53-week broadcast year. */
const EVERY_DAY: Array<Date> = [];
for (
  let d = new Date(2024, 0, 1);
  d < new Date(2027, 0, 1);
  d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
) {
  EVERY_DAY.push(d);
}

const YEARS = Array.from({ length: 101 }, (_, index) => 2000 + index);
const civil = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

describe.each(ALL_ANCHORS)("yearStartMonth %i", (yearStartMonth) => {
  const options = { yearStartMonth };

  it.each([
    ["week", startOfBroadcastWeek, endOfBroadcastWeek],
    ["month", startOfBroadcastMonth, endOfBroadcastMonth],
    ["quarter", startOfBroadcastQuarter, endOfBroadcastQuarter],
    ["year", startOfBroadcastYear, endOfBroadcastYear],
  ] as const)("a %s contains the date it was resolved from", (_s, start, end) => {
    const failures = EVERY_DAY.filter(
      (day) =>
        !(
          start(day, options).getTime() <= day.getTime() &&
          day.getTime() <= end(day, options).getTime()
        ),
    ).map(civil);
    expect(failures).toEqual([]);
  });

  it("opens every period on a Monday", () => {
    const wrong: Array<string> = [];
    for (const day of EVERY_DAY) {
      for (const start of [
        startOfBroadcastWeek,
        startOfBroadcastMonth,
        startOfBroadcastQuarter,
        startOfBroadcastYear,
      ]) {
        if (start(day, options).getDay() !== 1) wrong.push(civil(day));
      }
    }
    expect(wrong).toEqual([]);
  });

  it("opens the year in the month it is anchored to", () => {
    const wrong: Array<string> = [];
    for (const year of [2024, 2025, 2026]) {
      const first = eachBroadcastMonthOfYear(year, options)[0];
      const name = formatBroadcastMonth(first, "MMMM");
      if (name !== MONTH_NAMES[yearStartMonth]) {
        wrong.push(`${year}: opens in ${name}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("gives a year twelve months, four quarters and 52 or 53 weeks", () => {
    const wrong: Array<string> = [];
    for (const year of YEARS) {
      const months = eachBroadcastMonthOfYear(year, options);
      const weeks = countBroadcastWeeksInYear(year, options);
      if (months.length !== 12) wrong.push(`${year}: ${months.length} months`);
      if (weeks !== 52 && weeks !== 53) wrong.push(`${year}: ${weeks} weeks`);
    }
    expect(wrong).toEqual([]);
  });

  it("numbers a quarter as its month's group of three", () => {
    const wrong = EVERY_DAY.filter(
      (day) =>
        getBroadcastQuarter(day, options) !==
        Math.ceil(getBroadcastMonth(day, options) / 3),
    ).map(civil);
    expect(wrong).toEqual([]);
  });

  it("numbers weeks from where the year opens", () => {
    const wrong = EVERY_DAY.filter((day) => {
      const weekStart = startOfBroadcastWeek(day);
      const yearStart = startOfBroadcastYear(day, options);
      const expected =
        Math.round(
          (weekStart.getTime() - yearStart.getTime()) / (7 * 24 * 60 * 60 * 1000),
        ) + 1;
      return getBroadcastWeek(day, options) !== expected;
    }).map(civil);
    expect(wrong).toEqual([]);
  });

  it("round-trips a year through its own opening day, 2000-2100", () => {
    const wrong: Array<string> = [];
    for (const year of YEARS) {
      const opening = startOfBroadcastYearByNumber(year, options);
      if (getBroadcastYear(opening, options) !== year) {
        wrong.push(`${year} opens ${civil(opening)}`);
      }
      if (civil(startOfBroadcastYear(opening, options)) !== civil(opening)) {
        wrong.push(`${civil(opening)} is not its own year start`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
