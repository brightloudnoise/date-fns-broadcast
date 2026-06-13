import { describe, it, expect } from "vitest";
import { eachBroadcastMonthOfQuarter } from "./index";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

const sep = { yearStartMonth: 8 } as const;

describe("eachBroadcastMonthOfQuarter (September-based)", () => {
  it("Q1 contains September, October, November", () => {
    const months = eachBroadcastMonthOfQuarter(new Date(2024, 8, 15), sep);
    expect(months).toHaveLength(3);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2024, 8, 1)));  // Sep
    expect(months[1]).toEqual(startOfBroadcastMonth(new Date(2024, 9, 1)));  // Oct
    expect(months[2]).toEqual(startOfBroadcastMonth(new Date(2024, 10, 1))); // Nov
  });

  it("Q2 contains December, January, February (spanning calendar year)", () => {
    const months = eachBroadcastMonthOfQuarter(new Date(2024, 11, 15), sep);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2024, 11, 1)));  // Dec 2024
    expect(months[1]).toEqual(startOfBroadcastMonth(new Date(2025, 0, 1)));   // Jan 2025
    expect(months[2]).toEqual(startOfBroadcastMonth(new Date(2025, 1, 1)));   // Feb 2025
  });

  it("Q3 contains March, April, May", () => {
    const months = eachBroadcastMonthOfQuarter(new Date(2025, 2, 15), sep);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2025, 2, 1)));  // Mar
    expect(months[1]).toEqual(startOfBroadcastMonth(new Date(2025, 3, 1)));  // Apr
    expect(months[2]).toEqual(startOfBroadcastMonth(new Date(2025, 4, 1)));  // May
  });

  it("Q4 contains June, July, August", () => {
    const months = eachBroadcastMonthOfQuarter(new Date(2025, 5, 15), sep);
    expect(months[0]).toEqual(startOfBroadcastMonth(new Date(2025, 5, 1)));  // Jun
    expect(months[1]).toEqual(startOfBroadcastMonth(new Date(2025, 6, 1)));  // Jul
    expect(months[2]).toEqual(startOfBroadcastMonth(new Date(2025, 7, 1)));  // Aug
  });
});
