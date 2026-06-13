import { describe, it, expect } from "vitest";
import { getDay } from "date-fns";
import {
  broadcastQuarter,
  broadcastQuarterEnd,
  broadcastQuarterOf,
  broadcastQuarterStart,
  quarterOfWeek,
} from "./_broadcastQuarterCore";
import { broadcastYearEnd, broadcastYearStart } from "./_broadcastYearCore";

const JAN = 0;
const SEP = 8;

describe("_broadcastQuarterCore", () => {
  describe("quarterOfWeek", () => {
    it("maps 13-week blocks to quarters", () => {
      expect([1, 13].map(quarterOfWeek)).toEqual([1, 1]);
      expect([14, 26].map(quarterOfWeek)).toEqual([2, 2]);
      expect([27, 39].map(quarterOfWeek)).toEqual([3, 3]);
      expect([40, 52].map(quarterOfWeek)).toEqual([4, 4]);
    });

    it("clamps the 53rd week of a 53-week year into Q4", () => {
      expect(quarterOfWeek(53)).toBe(4);
    });
  });

  describe("broadcastQuarterStart", () => {
    it("steps 13 weeks per quarter from the year start (January anchor)", () => {
      expect(broadcastQuarterStart(2024, 1, JAN)).toEqual(
        broadcastYearStart(2024, JAN),
      );
      expect(broadcastQuarterStart(2024, 2, JAN)).toEqual(new Date(2024, 3, 1));
      expect(broadcastQuarterStart(2024, 3, JAN)).toEqual(new Date(2024, 6, 1));
      expect(broadcastQuarterStart(2024, 4, JAN)).toEqual(new Date(2024, 8, 30));
    });

    it("always lands on a Monday", () => {
      for (const q of [1, 2, 3, 4] as const) {
        expect(getDay(broadcastQuarterStart(2024, q, SEP))).toBe(1);
      }
    });
  });

  describe("broadcastQuarterEnd", () => {
    it("ends a non-final quarter 1ms before the next quarter", () => {
      expect(broadcastQuarterEnd(2024, 1, JAN).getTime()).toBe(
        broadcastQuarterStart(2024, 2, JAN).getTime() - 1,
      );
    });

    it("runs Q4 to the broadcast year end (14 weeks in a 53-week year)", () => {
      expect(broadcastQuarterEnd(2023, 4, JAN)).toEqual(
        broadcastYearEnd(2023, JAN),
      );
    });
  });

  describe("broadcastQuarterOf", () => {
    it("classifies a date into its quarter", () => {
      expect(broadcastQuarterOf(new Date(2024, 0, 15), JAN)).toBe(1);
      expect(broadcastQuarterOf(new Date(2024, 4, 15), JAN)).toBe(2);
      expect(broadcastQuarterOf(new Date(2024, 7, 15), JAN)).toBe(3);
      expect(broadcastQuarterOf(new Date(2024, 10, 15), JAN)).toBe(4);
    });
  });

  describe("broadcastQuarter descriptor", () => {
    it("matches the individual primitives, classifying once", () => {
      const date = new Date(2024, 10, 15);
      const info = broadcastQuarter(date, JAN);
      expect(info).toEqual({
        year: 2024,
        quarter: 4,
        start: broadcastQuarterStart(2024, 4, JAN),
        end: broadcastQuarterEnd(2024, 4, JAN),
      });
    });
  });
});
