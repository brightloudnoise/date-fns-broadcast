import { describe, it, expect } from "vitest";
import { getBroadcastYear } from "./index";

describe("getBroadcastYear", () => {
  it("returns calendar year for most dates", () => {
    expect(getBroadcastYear(new Date(2024, 5, 15))).toBe(2024);
    expect(getBroadcastYear(new Date(2023, 3, 1))).toBe(2023);
  });

  it("handles year transitions", () => {
    expect(getBroadcastYear(new Date(2023, 11, 31))).toBe(2023);
    expect(getBroadcastYear(new Date(2024, 0, 1))).toBe(2024);
  });

  it("handles special cases where broadcast year starts in previous calendar year", () => {
    expect(getBroadcastYear(new Date(2022, 11, 26))).toBe(2023);
    expect(getBroadcastYear(new Date(2022, 11, 31))).toBe(2023);
    expect(getBroadcastYear(new Date(2023, 0, 1))).toBe(2023);
    expect(getBroadcastYear(new Date(2022, 11, 27))).toBe(2023);
    expect(getBroadcastYear(new Date(2024, 11, 31))).toBe(2025);
  });

  it("handles dates in known 53-week years", () => {
    const fiftyThreeWeekYears = [
      2023, 2028, 2034, 2040, 2045, 2051, 2056, 2062,
    ];

    for (const year of fiftyThreeWeekYears) {
      expect(getBroadcastYear(new Date(year, 11, 1))).toBe(year);
    }
  });

  it("handles last week of year in 53-week year", () => {
    expect(getBroadcastYear(new Date(2023, 11, 31))).toBe(2023);
    expect(getBroadcastYear(new Date(2024, 0, 1))).toBe(2024);
  });

  it("handles year transition in non-53-week year", () => {
    expect(getBroadcastYear(new Date(2024, 11, 30))).toBe(2025);
    expect(getBroadcastYear(new Date(2025, 0, 1))).toBe(2025);
  });
});
