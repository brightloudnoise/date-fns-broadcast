import { describe, expect, it } from "vitest";
import {
  endOfBroadcastMonth,
  endOfBroadcastQuarter,
  endOfBroadcastWeek,
  endOfBroadcastYear,
  formatBroadcastMonth,
  startOfBroadcastMonth,
  startOfBroadcastQuarter,
  startOfBroadcastWeek,
  startOfBroadcastYear,
  countBroadcastWeeksInYear,
  eachBroadcastMonthOfQuarter,
  eachBroadcastMonthOfYear,
  eachBroadcastQuarterOfYear,
  eachBroadcastWeekOfQuarter,
  getBroadcastMonth,
  getBroadcastQuarter,
  getBroadcastYear,
  startOfBroadcastYearByNumber,
} from "./index";
import type { BroadcastOptions } from "./types";

/**
 * A period must contain the date it was asked about.
 *
 * Stated as a property over every day of a four-year span rather than as a
 * table, because the defect this guards against was invisible to a table: every
 * example in the suite used the 15th or the 1st of a month, and
 * `startOfBroadcastMonth` was correct for both. It was wrong for the 1–6 days
 * after a calendar month's last Sunday — 141 of 1460 days, 9.7% of the year —
 * which no hand-picked date happened to be.
 */

const ANCHORS: Array<{ label: string; options?: BroadcastOptions }> = [
  { label: "January anchor", options: { yearStartMonth: 0 } },
  { label: "September anchor", options: { yearStartMonth: 8 } },
  { label: "default (no options)", options: undefined },
];

/** Every day from 1 Jan 2024 to 31 Dec 2027, at local noon. */
function everyDay(): Date[] {
  const days: Date[] = [];
  for (
    let d = new Date(2024, 0, 1, 12);
    d.getFullYear() < 2028;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)
  ) {
    days.push(d);
  }
  return days;
}

const DAYS = everyDay();

describe("a broadcast period contains the date it was asked about", () => {
  it.each([
    ["week", startOfBroadcastWeek, endOfBroadcastWeek],
    ["month", startOfBroadcastMonth, endOfBroadcastMonth],
  ] as const)("%s", (_name, start, end) => {
    const outside = DAYS.filter((d) => !(start(d) <= d && d <= end(d)));
    expect(outside.map((d) => d.toDateString())).toEqual([]);
  });

  describe.each(ANCHORS)("$label", ({ options }) => {
    it.each([
      ["quarter", startOfBroadcastQuarter, endOfBroadcastQuarter],
      ["year", startOfBroadcastYear, endOfBroadcastYear],
    ] as const)("%s", (_name, start, end) => {
      const outside = DAYS.filter(
        (d) => !(start(d, options) <= d && d <= end(d, options)),
      );
      expect(outside.map((d) => d.toDateString())).toEqual([]);
    });
  });
});

describe("the month bounds and the month label name the same month", () => {
  it("agrees on every day of 2024-2027", () => {
    const disagreeing = DAYS.filter((d) => {
      // The bounds are Monday..Sunday, so the calendar month the block is
      // *named after* is the one its midpoint falls in.
      const start = startOfBroadcastMonth(d);
      const end = endOfBroadcastMonth(d);
      const mid = new Date((start.getTime() + end.getTime()) / 2);
      return formatBroadcastMonth(d) !== formatBroadcastMonth(mid);
    });
    expect(disagreeing.map((d) => d.toDateString())).toEqual([]);
  });
});

describe("the days after a calendar month's last Sunday", () => {
  // 1 Jan 2024 is a Monday, so broadcast January runs 1-28 Jan and 29 Jan is
  // the first day of broadcast February. This is the exact case that was wrong.
  const tailDay = new Date(2024, 0, 29, 12);

  it("belong to the next broadcast month", () => {
    expect(formatBroadcastMonth(tailDay)).toBe("February 2024");
  });

  it("start that month rather than the one just ended", () => {
    expect(startOfBroadcastMonth(tailDay)).toEqual(new Date(2024, 0, 29));
  });

  it("end with that month's last Sunday", () => {
    expect(endOfBroadcastMonth(tailDay)).toEqual(
      new Date(2024, 1, 25, 23, 59, 59, 999),
    );
  });
});

/**
 * The periods must nest: a year is exactly twelve broadcast months, exactly
 * four broadcast quarters, and 52 or 53 whole weeks; a quarter is exactly three
 * of those months, with its own edges taken from them.
 *
 * These are the properties the 13-week quarter could not hold. A quarter is
 * three broadcast months, and months run 4 or 5 weeks, so a quarter runs 12, 13
 * or 14 — only the four together are fixed. Stepping a constant 13 weeks from
 * the year start made `getBroadcastQuarter` disagree with
 * `getBroadcastMonth` (23 Feb 2026 under a September anchor is month 7, so
 * quarter 3, while the block arithmetic said quarter 2) and pushed quarter
 * edges off the month edges that `eachBroadcastMonthOfQuarter` reports.
 *
 * A table missed this the same way it missed the 1.2.1 defect: the mismatches
 * are 2 quarters out of 32 on a January anchor over 2023–2030, and they only
 * show on days the hand-written cases never picked.
 */
describe("broadcast periods nest by construction", () => {
  describe.each(ANCHORS)("$label", ({ options }) => {
    const years = [2013, 2019, 2023, 2024, 2028, 2029, 2040, 2041];

    it("a year is exactly twelve broadcast months that tile it", () => {
      for (const y of years) {
        const months = eachBroadcastMonthOfYear(y, options);
        expect(months).toHaveLength(12);
        expect(months[0].getTime()).toBe(
          startOfBroadcastYearByNumber(y, options).getTime(),
        );
        // every entry is a real month start, and each month ends where the
        // next begins
        for (let i = 0; i < 12; i++) {
          expect(startOfBroadcastMonth(months[i]).getTime()).toBe(
            months[i].getTime(),
          );
          const next =
            i === 11 ? startOfBroadcastYearByNumber(y + 1, options) : months[i + 1];
          expect(endOfBroadcastMonth(months[i]).getTime()).toBe(
            next.getTime() - 1,
          );
        }
      }
    });

    it("a quarter is exactly three of those months, edges included", () => {
      for (const y of years) {
        const months = eachBroadcastMonthOfYear(y, options);
        const quarters = eachBroadcastQuarterOfYear(y, options);
        expect(quarters).toHaveLength(4);
        for (let q = 0; q < 4; q++) {
          expect(quarters[q].getTime()).toBe(months[q * 3].getTime());
          const probe = months[q * 3];
          expect(startOfBroadcastQuarter(probe, options).getTime()).toBe(
            months[q * 3].getTime(),
          );
          expect(endOfBroadcastQuarter(probe, options).getTime()).toBe(
            endOfBroadcastMonth(months[q * 3 + 2]).getTime(),
          );
          expect(eachBroadcastMonthOfQuarter(probe, options)).toEqual([
            months[q * 3],
            months[q * 3 + 1],
            months[q * 3 + 2],
          ]);
        }
      }
    });

    it("the quarters' weeks sum to the year's week count", () => {
      for (const y of years) {
        const months = eachBroadcastMonthOfYear(y, options);
        const total = [0, 1, 2, 3].reduce(
          (n, q) => n + eachBroadcastWeekOfQuarter(months[q * 3], options).length,
          0,
        );
        expect(total).toBe(countBroadcastWeeksInYear(y, options));
        expect([52, 53]).toContain(total);
      }
    });

    it("quarter number is the month number's group of three, every day", () => {
      for (const day of everyDay()) {
        expect(getBroadcastQuarter(day, options)).toBe(
          Math.ceil(getBroadcastMonth(day, options) / 3),
        );
      }
    });
  });
});

/**
 * The year a date belongs to and the year that names its own start must agree.
 *
 * `startOfBroadcastYearByNumber` was the one telling the truth: a January
 * anchored year whose 1 Jan is a Tuesday opens on 31 Dec of the year before,
 * and `getBroadcastYear` read that day as the earlier year — 2013, 2041, 2069
 * and 2097. The suite never noticed because it only probed years by their
 * middle, and because the default anchor is the one that breaks.
 */
describe("year membership agrees with the year boundary", () => {
  describe.each(ANCHORS)("$label", ({ options }) => {
    it("getBroadcastYear(startOfBroadcastYearByNumber(y)) === y, 2000-2100", () => {
      for (let y = 2000; y <= 2100; y++) {
        const start = startOfBroadcastYearByNumber(y, options);
        expect(getBroadcastYear(start, options)).toBe(y);
        // and the instant before it belongs to the year before
        expect(
          getBroadcastYear(new Date(start.getTime() - 1), options),
        ).toBe(y - 1);
      }
    });

    it("consecutive years tile with no gap or overlap, 2000-2100", () => {
      for (let y = 2000; y < 2100; y++) {
        expect(endOfBroadcastYear(startOfBroadcastYearByNumber(y, options), options).getTime()).toBe(
          startOfBroadcastYearByNumber(y + 1, options).getTime() - 1,
        );
      }
    });
  });
});
