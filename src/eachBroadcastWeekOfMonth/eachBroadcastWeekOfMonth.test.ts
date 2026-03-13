import { describe, it, expect } from "vitest";
import { differenceInCalendarDays } from "date-fns";
import { eachBroadcastWeekOfMonth } from "./index";

describe("eachBroadcastWeekOfMonth", () => {
  it("returns 4 weeks for a 4-week broadcast month (Feb 2025)", () => {
    const weeks = eachBroadcastWeekOfMonth(new Date(2025, 1, 15));
    expect(weeks).toHaveLength(4);
  });

  it("all returned dates are Mondays", () => {
    eachBroadcastWeekOfMonth(new Date(2025, 1, 15)).forEach((w) =>
      expect(w.getDay()).toBe(1)
    );
  });

  it("first week is the start of the broadcast month", () => {
    const weeks = eachBroadcastWeekOfMonth(new Date(2025, 1, 15));
    // Feb 2025 broadcast month starts on Mon Jan 27
    expect(weeks[0].toISOString()).toBe(new Date(2025, 0, 27).toISOString());
  });

  it("weeks are 7 days apart", () => {
    const weeks = eachBroadcastWeekOfMonth(new Date(2025, 1, 15));
    for (let i = 1; i < weeks.length; i++) {
      expect(differenceInCalendarDays(weeks[i], weeks[i - 1])).toBe(7);
    }
  });

  it("returns 5 weeks for a 5-week broadcast month", () => {
    // Find a 5-week month — March 2025 broadcast month runs Mon Mar 31 - Sun May 4 (5 weeks)
    const weeks = eachBroadcastWeekOfMonth(new Date(2025, 2, 15));
    expect(weeks).toHaveLength(5);
  });
});
