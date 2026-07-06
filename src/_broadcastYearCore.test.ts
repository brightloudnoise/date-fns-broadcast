import { describe, it, expect } from "vitest";
import { getDay } from "date-fns";
import {
  broadcastWeekCount,
  broadcastWeekOf,
  broadcastWeeksOf,
  broadcastYear,
  broadcastYearEnd,
  broadcastYearOf,
  broadcastYearStart,
  is53WeekYear,
  resolveYearStartMonth,
} from "./_broadcastYearCore";

const JAN = 0;
const SEP = 8;

describe("_broadcastYearCore", () => {
  describe("resolveYearStartMonth", () => {
    it("defaults to January when unset", () => {
      expect(resolveYearStartMonth()).toBe(0);
      expect(resolveYearStartMonth({})).toBe(0);
    });

    it("honours an explicit yearStartMonth", () => {
      expect(resolveYearStartMonth({ yearStartMonth: 8 })).toBe(8);
    });
  });

  describe("broadcastYearStart", () => {
    it("is the Monday on/before the Anchor Date (January anchor)", () => {
      // Jan 1 2024 is a Monday — the year starts on it.
      expect(broadcastYearStart(2024, JAN)).toEqual(new Date(2024, 0, 1));
      // Jan 1 2023 is a Sunday — roll back to Mon Dec 26 2022.
      expect(broadcastYearStart(2023, JAN)).toEqual(new Date(2022, 11, 26));
    });

    it("is the Monday on/before the Anchor Date (September anchor)", () => {
      // Sep 1 2024 is a Sunday — roll back to Mon Aug 26 2024.
      expect(broadcastYearStart(2024, SEP)).toEqual(new Date(2024, 7, 26));
    });

    it("always lands on a Monday", () => {
      for (let year = 2018; year <= 2032; year++) {
        expect(getDay(broadcastYearStart(year, JAN))).toBe(1);
        expect(getDay(broadcastYearStart(year, SEP))).toBe(1);
      }
    });
  });

  describe("is53WeekYear", () => {
    it("detects a 53-week year when the Anchor Date is a Sunday", () => {
      // Jan 1 2023 is a Sunday.
      expect(is53WeekYear(2023, JAN)).toBe(true);
    });

    it("detects a 53-week year when the Anchor Date is a Saturday before a leap February", () => {
      // Jan 1 2028 is a Saturday and 2028 is a leap year.
      expect(getDay(new Date(2028, JAN, 1))).toBe(6);
      expect(is53WeekYear(2028, JAN)).toBe(true);
    });

    it("is an ordinary 52-week year otherwise", () => {
      expect(is53WeekYear(2024, JAN)).toBe(false);
      expect(is53WeekYear(2025, JAN)).toBe(false);
    });
  });

  describe("broadcastYearOf", () => {
    it("classifies a date into its own calendar year", () => {
      expect(broadcastYearOf(new Date(2024, 5, 15), JAN)).toBe(2024);
    });

    it("rolls a late-December date forward into the next broadcast year", () => {
      // Broadcast 2025 (January anchor) starts Mon Dec 30 2024.
      expect(broadcastYearOf(new Date(2024, 11, 30), JAN)).toBe(2025);
      expect(broadcastYearOf(new Date(2024, 11, 29), JAN)).toBe(2024);
    });

    it("keeps a late date inside a 53-week year rather than rolling it forward", () => {
      // Broadcast 2023 is 53 weeks and runs through Dec 31 2023.
      expect(broadcastYearOf(new Date(2023, 11, 31), JAN)).toBe(2023);
    });

    it("classifies across a September anchor boundary", () => {
      // Broadcast 2024 (September anchor) starts Mon Aug 26 2024.
      expect(broadcastYearOf(new Date(2024, 7, 26), SEP)).toBe(2024);
      expect(broadcastYearOf(new Date(2024, 7, 25), SEP)).toBe(2023);
    });
  });

  describe("broadcastYearEnd", () => {
    it("is exactly the next year's start minus 1ms", () => {
      const end = broadcastYearEnd(2024, JAN);
      expect(end.getTime()).toBe(broadcastYearStart(2025, JAN).getTime() - 1);
    });
  });

  describe("broadcastWeekCount", () => {
    it("returns 53 for a 53-week year and 52 otherwise", () => {
      expect(broadcastWeekCount(2023, JAN)).toBe(53);
      expect(broadcastWeekCount(2024, JAN)).toBe(52);
    });
  });

  describe("broadcastWeeksOf", () => {
    it("starts on the year start and has one entry per week", () => {
      const weeks52 = broadcastWeeksOf(2024, JAN);
      expect(weeks52).toHaveLength(52);
      expect(weeks52[0]).toEqual(broadcastYearStart(2024, JAN));

      expect(broadcastWeeksOf(2023, JAN)).toHaveLength(53);
    });

    it("keeps every week inside the broadcast year", () => {
      const weeks = broadcastWeeksOf(2023, JAN);
      const end = broadcastYearEnd(2023, JAN);
      for (const week of weeks) {
        expect(week.getTime()).toBeLessThanOrEqual(end.getTime());
        expect(getDay(week)).toBe(1);
      }
    });
  });

  describe("broadcastWeekOf", () => {
    it("numbers weeks from 1 within the year length", () => {
      expect(broadcastWeekOf(broadcastYearStart(2024, JAN), JAN)).toBe(1);
    });

    it("clamps to the year length at the tail of a 53-week year", () => {
      // Dec 31 2023 is the final Sunday of broadcast 2023 (53 weeks).
      expect(broadcastWeekOf(new Date(2023, 11, 31), JAN)).toBe(53);
    });
  });

  describe("broadcastYear descriptor", () => {
    it("matches the individual primitives, classifying once", () => {
      const date = new Date(2023, 11, 31);
      const info = broadcastYear(date, JAN);
      expect(info).toEqual({
        year: broadcastYearOf(date, JAN),
        start: broadcastYearStart(2023, JAN),
        end: broadcastYearEnd(2023, JAN),
        is53: is53WeekYear(2023, JAN),
        weekCount: broadcastWeekCount(2023, JAN),
      });
    });
  });
});
