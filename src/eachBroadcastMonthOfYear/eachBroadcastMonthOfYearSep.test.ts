import { describe, it, expect } from "vitest";
import { eachBroadcastMonthOfYear } from "./index";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

const sep = { yearStartMonth: 8 } as const;

describe("eachBroadcastMonthOfYear (September-based)", () => {
  it("returns 12 months starting from September", () => {
    const months = eachBroadcastMonthOfYear(2024, sep);
    expect(months).toHaveLength(12);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2024, 8, 1)));  // Sep 2024
    expect(months[11]).toEqual(startOfBroadcastMonth(new Date(2025, 7, 1))); // Aug 2025
  });

  it("months span the correct calendar year boundary", () => {
    const months = eachBroadcastMonthOfYear(2024, sep);
    // Month 4 (index 3) = December 2024
    expect(months[3]).toEqual(startOfBroadcastMonth(new Date(2024, 11, 1)));
    // Month 5 (index 4) = January 2025
    expect(months[4]).toEqual(startOfBroadcastMonth(new Date(2025, 0, 1)));
  });

  it("default (January-based) still starts in January", () => {
    const months = eachBroadcastMonthOfYear(2025);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2025, 0, 1)));
    expect(months[11]).toEqual(startOfBroadcastMonth(new Date(2025, 11, 1)));
  });
});
