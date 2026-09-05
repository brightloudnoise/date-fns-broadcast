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
