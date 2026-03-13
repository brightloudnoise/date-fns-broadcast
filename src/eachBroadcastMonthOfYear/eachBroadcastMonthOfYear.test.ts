import { describe, it, expect } from "vitest";
import { eachBroadcastMonthOfYear } from "./index";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

describe("eachBroadcastMonthOfYear", () => {
  it("returns 12 months for 2025", () => {
    expect(eachBroadcastMonthOfYear(2025)).toHaveLength(12);
  });

  it("all returned dates are Mondays", () => {
    eachBroadcastMonthOfYear(2025).forEach((m) =>
      expect(m.getDay()).toBe(1)
    );
  });

  it("first month matches startOfBroadcastMonth of Jan 1", () => {
    const months = eachBroadcastMonthOfYear(2025);
    expect(months[0].toISOString()).toBe(
      startOfBroadcastMonth(new Date(2025, 0, 1)).toISOString()
    );
  });

  it("last month matches startOfBroadcastMonth of Dec 1", () => {
    const months = eachBroadcastMonthOfYear(2025);
    expect(months[11].toISOString()).toBe(
      startOfBroadcastMonth(new Date(2025, 11, 1)).toISOString()
    );
  });

  it("each month matches startOfBroadcastMonth for mid-month dates", () => {
    const months = eachBroadcastMonthOfYear(2025);
    for (let i = 0; i < 12; i++) {
      expect(months[i].toISOString()).toBe(
        startOfBroadcastMonth(new Date(2025, i, 15)).toISOString()
      );
    }
  });
});
