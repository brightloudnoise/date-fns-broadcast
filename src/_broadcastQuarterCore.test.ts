import { describe, it, expect } from "vitest";
import { getDay } from "date-fns";
import {
  broadcastQuarter,
  broadcastQuarterEnd,
  broadcastQuarterOf,
  broadcastQuarterStart,
  quarterOfMonth,
} from "./_broadcastQuarterCore";
import { broadcastYearEnd, broadcastYearStart } from "./_broadcastYearCore";
import { broadcastMonthStartByOrdinal } from "./_broadcastMonthCore";

const JAN = 0;
const SEP = 8;

describe("_broadcastQuarterCore", () => {
  describe("quarterOfMonth", () => {
    it("groups the twelve broadcast months into four quarters", () => {
      expect([1, 2, 3].map(quarterOfMonth)).toEqual([1, 1, 1]);
      expect([4, 5, 6].map(quarterOfMonth)).toEqual([2, 2, 2]);
      expect([7, 8, 9].map(quarterOfMonth)).toEqual([3, 3, 3]);
      expect([10, 11, 12].map(quarterOfMonth)).toEqual([4, 4, 4]);
    });
  });

  describe("broadcastQuarterStart", () => {
    it("opens on its own first broadcast month, not 13 weeks along", () => {
      expect(broadcastQuarterStart(2024, 1, JAN)).toEqual(
        broadcastYearStart(2024, JAN),
      );
      for (const q of [1, 2, 3, 4] as const) {
        expect(broadcastQuarterStart(2024, q, JAN)).toEqual(
          broadcastMonthStartByOrdinal(2024, (q - 1) * 3, JAN),
        );
      }
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

    it("runs Q4 to the broadcast year end, with no special case for it", () => {
      expect(broadcastQuarterEnd(2023, 4, JAN)).toEqual(
        broadcastYearEnd(2023, JAN),
      );
    });

    it("closes each quarter on its own third month's end", () => {
      for (const ysm of [JAN, SEP] as const) {
        for (const q of [1, 2, 3, 4] as const) {
          expect(broadcastQuarterEnd(2024, q, ysm).getTime()).toBe(
            broadcastMonthStartByOrdinal(2024, q * 3, ysm).getTime() - 1,
          );
        }
      }
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
