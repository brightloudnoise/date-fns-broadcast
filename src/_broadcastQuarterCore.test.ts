import { describe, it, expect } from "vitest";
import { getDay } from "date-fns";
import {
  broadcastQuarter,
  broadcastQuarterOf,
  broadcastQuarterStart,
} from "./_broadcastQuarterCore";
import { broadcastYearEnd, broadcastYearStart } from "./_broadcastYearCore";
import { broadcastMonthStartByOrdinal } from "./_broadcastMonthCore";

const JAN = 0;
const SEP = 8;

describe("_broadcastQuarterCore", () => {
  describe("quarter numbering", () => {
    it("groups the twelve broadcast months into four quarters", () => {
      // Through the surface that survives: month n lands in quarter ceil(n/3).
      for (const ysm of [JAN, SEP] as const) {
        for (let ordinal0 = 0; ordinal0 < 12; ordinal0++) {
          const monthStart = broadcastMonthStartByOrdinal(2024, ordinal0, ysm);
          expect(broadcastQuarterOf(monthStart, ysm)).toBe(
            Math.ceil((ordinal0 + 1) / 3),
          );
        }
      }
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

  describe("quarter ends", () => {
    it("closes each quarter on its own third month's end", () => {
      for (const ysm of [JAN, SEP] as const) {
        for (const q of [1, 2, 3, 4] as const) {
          const start = broadcastQuarterStart(2024, q, ysm);
          expect(broadcastQuarter(start, ysm).end.getTime()).toBe(
            broadcastMonthStartByOrdinal(2024, q * 3, ysm).getTime() - 1,
          );
        }
      }
    });

    it("runs Q4 to the broadcast year end, with no special case for it", () => {
      const q4 = broadcastQuarterStart(2023, 4, JAN);
      expect(broadcastQuarter(q4, JAN).end).toEqual(broadcastYearEnd(2023, JAN));
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
        end: new Date(
          broadcastMonthStartByOrdinal(2025, 0, JAN).getTime() - 1,
        ),
      });
    });
  });
});
