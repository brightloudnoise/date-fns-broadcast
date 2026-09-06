import { describe, expect, it } from "vitest";
import { getDay } from "date-fns";
import {
  MONTH_BOUNDS_ANCHOR,
  monthAnchorOf,
  periodByOrdinal,
  periodOf,
  resolveYearStartMonth,
  weekCountOf,
  weekNumberOf,
  weeksBetweenDates,
  weeksOfYear,
} from "./_broadcastCalendarCore";
import type { YearStartMonth } from "./types";

const JAN = 0 as YearStartMonth;
const SEP = 8 as YearStartMonth;

/**
 * The core's whole interface, exercised directly.
 *
 * This replaces three separate core suites that each tested one period type.
 * They could drift the way the modules did; a single table cannot, so the
 * assertions here are mostly about the periods agreeing with each other.
 */
describe("_broadcastCalendarCore", () => {
  describe("resolveYearStartMonth", () => {
    it("defaults to January and honours an explicit anchor", () => {
      expect(resolveYearStartMonth()).toBe(0);
      expect(resolveYearStartMonth({})).toBe(0);
      expect(resolveYearStartMonth({ yearStartMonth: 8 })).toBe(8);
    });
  });

  describe("periodOf", () => {
    it("numbers months from the Year Start Month", () => {
      expect(periodOf(new Date(2024, 0, 15), "month", JAN).number).toBe(1);
      expect(periodOf(new Date(2024, 11, 15), "month", JAN).number).toBe(12);
      // September anchor: September is month 1, so January is month 5.
      expect(periodOf(new Date(2024, 8, 15), "month", SEP).number).toBe(1);
      expect(periodOf(new Date(2025, 0, 15), "month", SEP).number).toBe(5);
    });

    it("groups three months into each quarter", () => {
      for (const ysm of [JAN, SEP]) {
        for (let ordinal0 = 0; ordinal0 < 12; ordinal0++) {
          const { start } = periodByOrdinal(2024, "month", ordinal0, ysm);
          expect(periodOf(start, "quarter", ysm).number).toBe(
            Math.ceil((ordinal0 + 1) / 3),
          );
        }
      }
    });

    it("gives every period a start that is a Monday", () => {
      for (const unit of ["month", "quarter", "year"] as const) {
        for (const ysm of [JAN, SEP]) {
          expect(getDay(periodOf(new Date(2024, 4, 20), unit, ysm).start)).toBe(1);
        }
      }
    });

    it("nests: a month sits inside its quarter, which sits inside its year", () => {
      for (
        let d = new Date(2023, 0, 1, 12);
        d.getFullYear() < 2027;
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)
      ) {
        for (const ysm of [JAN, SEP]) {
          const m = periodOf(d, "month", ysm);
          const q = periodOf(d, "quarter", ysm);
          const y = periodOf(d, "year", ysm);
          expect(q.start.getTime()).toBeLessThanOrEqual(m.start.getTime());
          expect(q.end.getTime()).toBeGreaterThanOrEqual(m.end.getTime());
          expect(y.start.getTime()).toBeLessThanOrEqual(q.start.getTime());
          expect(y.end.getTime()).toBeGreaterThanOrEqual(q.end.getTime());
          expect(m.year).toBe(y.year);
          expect(q.year).toBe(y.year);
        }
      }
    });
  });

  describe("periodByOrdinal", () => {
    it("tiles the year: each period ends where the next begins", () => {
      for (const ysm of [JAN, SEP]) {
        for (const [unit, count] of [
          ["month", 12],
          ["quarter", 4],
        ] as const) {
          for (let i = 0; i < count - 1; i++) {
            expect(periodByOrdinal(2024, unit, i, ysm).end.getTime()).toBe(
              periodByOrdinal(2024, unit, i + 1, ysm).start.getTime() - 1,
            );
          }
          expect(periodByOrdinal(2024, unit, count - 1, ysm).end).toEqual(
            periodByOrdinal(2024, "year", 0, ysm).end,
          );
        }
      }
    });

    it("agrees with periodOf for a date inside the period", () => {
      for (const ysm of [JAN, SEP]) {
        for (let i = 0; i < 12; i++) {
          const { start, end } = periodByOrdinal(2025, "month", i, ysm);
          expect(periodOf(start, "month", ysm).start).toEqual(start);
          expect(periodOf(end, "month", ysm).end).toEqual(end);
        }
      }
    });
  });

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

    it("keeps a date in its own calendar month when nothing is borrowed", () => {
      expect(monthAnchorOf(new Date(2024, 5, 15), MONTH_BOUNDS_ANCHOR)).toEqual(
        new Date(2024, 5, 1),
      );
    });
  });

  describe("weeks", () => {
    it("counts 52 or 53 weeks, matching the year's own span", () => {
      for (const ysm of [JAN, SEP]) {
        for (let y = 2000; y <= 2100; y++) {
          const n = weekCountOf(y, ysm);
          expect([52, 53]).toContain(n);
          expect(weeksOfYear(y, ysm)).toHaveLength(n);
        }
      }
    });

    it("numbers weeks from 1 within the year length", () => {
      for (const ysm of [JAN, SEP]) {
        const { start, end } = periodByOrdinal(2024, "year", 0, ysm);
        expect(weekNumberOf(start, ysm)).toBe(1);
        expect(weekNumberOf(end, ysm)).toBe(weekCountOf(2024, ysm));
      }
    });

    it("walks whole weeks that all land on Monday", () => {
      const { start, end } = periodByOrdinal(2024, "quarter", 0, SEP);
      const weeks = weeksBetweenDates(start, end);
      expect(weeks.length).toBeGreaterThanOrEqual(12);
      weeks.forEach((w) => expect(getDay(w)).toBe(1));
    });
  });

  describe("MONTH_BOUNDS_ANCHOR", () => {
    it("month bounds are the same slice under every anchor", () => {
      for (
        let d = new Date(2024, 0, 1, 12);
        d.getFullYear() < 2028;
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 12)
      ) {
        const ref = periodOf(d, "month", MONTH_BOUNDS_ANCHOR);
        for (const ysm of [0, 3, 6, 8, 11] as YearStartMonth[]) {
          const other = periodOf(d, "month", ysm);
          expect(other.start.getTime()).toBe(ref.start.getTime());
          expect(other.end.getTime()).toBe(ref.end.getTime());
        }
      }
    });
  });
});
