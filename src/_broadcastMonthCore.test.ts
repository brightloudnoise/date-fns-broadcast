import { describe, it, expect } from "vitest";
import { getDay } from "date-fns";
import {
  MONTH_BOUNDS_ANCHOR,
  broadcastMonthNumber,
  broadcastMonthStartByOrdinal,
  monthAnchorOf,
  monthEndOf,
  monthStartOf,
} from "./_broadcastMonthCore";
import { startOfBroadcastMonth } from "./startOfBroadcastMonth";

const JAN = 0;
const SEP = 8;

describe("_broadcastMonthCore", () => {
  describe("monthAnchorOf", () => {
    it("names the broadcast month after the calendar month it belongs to", () => {
      // Aug 26 2024 falls in broadcast September 2024.
      expect(monthAnchorOf(new Date(2024, 7, 26), MONTH_BOUNDS_ANCHOR)).toEqual(
        new Date(2024, 8, 1),
      );
      // Feb 26 2024 falls in broadcast March 2024.
      expect(monthAnchorOf(new Date(2024, 1, 26), MONTH_BOUNDS_ANCHOR)).toEqual(
        new Date(2024, 2, 1),
      );
    });

    it("keeps a date in its own calendar month when the month is not borrowed", () => {
      expect(monthAnchorOf(new Date(2024, 5, 15), MONTH_BOUNDS_ANCHOR)).toEqual(
        new Date(2024, 5, 1),
      );
    });
  });

  describe("broadcastMonthNumber", () => {
    it("is 1-indexed from January under a January anchor", () => {
      expect(broadcastMonthNumber(new Date(2024, 0, 15), JAN)).toBe(1);
      expect(broadcastMonthNumber(new Date(2024, 5, 15), JAN)).toBe(6);
      expect(broadcastMonthNumber(new Date(2024, 11, 15), JAN)).toBe(12);
    });

    it("counts from the Year Start Month under a September anchor", () => {
      expect(broadcastMonthNumber(new Date(2024, 8, 15), SEP)).toBe(1);
      // Aug 26 2024 is broadcast September 2024 → month 1.
      expect(broadcastMonthNumber(new Date(2024, 7, 26), SEP)).toBe(1);
      expect(broadcastMonthNumber(new Date(2024, 9, 15), SEP)).toBe(2);
    });
  });

  describe("broadcastMonthStartByOrdinal", () => {
    it("returns the start of the n-th broadcast month of the year", () => {
      expect(broadcastMonthStartByOrdinal(2024, 0, JAN)).toEqual(
        startOfBroadcastMonth(new Date(2024, 0, 1)),
      );
      // 3rd month (ordinal 2) under January anchor is March; it starts Feb 26 2024.
      expect(broadcastMonthStartByOrdinal(2024, 2, JAN)).toEqual(
        new Date(2024, 1, 26),
      );
    });

    it("rolls into the next calendar year and always lands on a Monday", () => {
      // September anchor, ordinal 0 → broadcast September 2024 starts Aug 26 2024.
      expect(broadcastMonthStartByOrdinal(2024, 0, SEP)).toEqual(
        new Date(2024, 7, 26),
      );
      for (let i = 0; i < 12; i++) {
        expect(getDay(broadcastMonthStartByOrdinal(2024, i, SEP))).toBe(1);
      }
    });
  });

  describe("month bounds are independent of the Year Start Month", () => {
    it("selects the same slice under every anchor, every day of 2024-2027", () => {
      for (
        let d = new Date(2024, 0, 1, 12);
        d.getFullYear() < 2028;
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)
      ) {
        const start = monthStartOf(d, MONTH_BOUNDS_ANCHOR);
        const end = monthEndOf(d, MONTH_BOUNDS_ANCHOR);
        for (const ysm of [0, 3, 6, 8, 11] as const) {
          expect(monthStartOf(d, ysm).getTime()).toBe(start.getTime());
          expect(monthEndOf(d, ysm).getTime()).toBe(end.getTime());
        }
        // and the public wrapper agrees with the projection it delegates to
        expect(startOfBroadcastMonth(d).getTime()).toBe(start.getTime());
      }
    });
  });
});
