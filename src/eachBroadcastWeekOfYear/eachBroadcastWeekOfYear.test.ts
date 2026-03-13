import { describe, it, expect } from "vitest";
import { differenceInCalendarDays } from "date-fns";
import { eachBroadcastWeekOfYear } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";

describe("eachBroadcastWeekOfYear", () => {
  it("returns 52 weeks for a regular broadcast year (2025)", () => {
    expect(eachBroadcastWeekOfYear(2025)).toHaveLength(52);
  });

  it("returns 53 weeks for a 53-week broadcast year (2023)", () => {
    expect(eachBroadcastWeekOfYear(2023)).toHaveLength(53);
  });

  it("all returned dates are Mondays", () => {
    eachBroadcastWeekOfYear(2025).forEach((w) => expect(w.getDay()).toBe(1));
  });

  it("first week matches startOfBroadcastYearByNumber", () => {
    const weeks = eachBroadcastWeekOfYear(2025);
    expect(weeks[0].toISOString()).toBe(
      startOfBroadcastYearByNumber(2025).toISOString()
    );
  });

  it("weeks are 7 days apart", () => {
    const weeks = eachBroadcastWeekOfYear(2025);
    for (let i = 1; i < weeks.length; i++) {
      expect(differenceInCalendarDays(weeks[i], weeks[i - 1])).toBe(7);
    }
  });
});
