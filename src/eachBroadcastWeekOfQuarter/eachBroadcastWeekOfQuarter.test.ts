import { describe, it, expect } from "vitest";
import { differenceInCalendarDays } from "date-fns";
import { eachBroadcastWeekOfQuarter } from "./index";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";

describe("eachBroadcastWeekOfQuarter", () => {
  it("returns 13 weeks for a standard quarter (Q1 2025)", () => {
    expect(eachBroadcastWeekOfQuarter(new Date(2025, 1, 15))).toHaveLength(13);
  });

  it("all returned dates are Mondays", () => {
    eachBroadcastWeekOfQuarter(new Date(2025, 1, 15)).forEach((w) =>
      expect(w.getDay()).toBe(1)
    );
  });

  it("first week matches startOfBroadcastQuarter", () => {
    const weeks = eachBroadcastWeekOfQuarter(new Date(2025, 1, 15));
    expect(weeks[0].toISOString()).toBe(
      startOfBroadcastQuarter(new Date(2025, 1, 15)).toISOString()
    );
  });

  it("weeks are 7 days apart", () => {
    const weeks = eachBroadcastWeekOfQuarter(new Date(2025, 1, 15));
    for (let i = 1; i < weeks.length; i++) {
      expect(differenceInCalendarDays(weeks[i], weeks[i - 1])).toBe(7);
    }
  });

  it("returns 14 weeks for a quarter in a 53-week year when applicable (Q4 2023)", () => {
    expect(eachBroadcastWeekOfQuarter(new Date(2023, 10, 15))).toHaveLength(14);
  });
});
