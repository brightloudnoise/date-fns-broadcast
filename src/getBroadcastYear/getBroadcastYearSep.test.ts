import { describe, it, expect } from "vitest";
import { getBroadcastYear } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";

const sep = { yearStartMonth: 8 } as const;

describe("getBroadcastYear (September-based)", () => {
  it("dates in Sep–Dec belong to that calendar year", () => {
    expect(getBroadcastYear(new Date(2024, 8, 15), sep)).toBe(2024);  // Sep 15
    expect(getBroadcastYear(new Date(2024, 11, 15), sep)).toBe(2024); // Dec 15
  });

  it("dates in Jan–Aug belong to the previous broadcast year", () => {
    expect(getBroadcastYear(new Date(2025, 0, 15), sep)).toBe(2024);  // Jan 15, 2025
    expect(getBroadcastYear(new Date(2025, 7, 15), sep)).toBe(2024);  // Aug 15, 2025
  });

  it("Sep 1 is the first day of the new broadcast year", () => {
    const sep1 = startOfBroadcastYearByNumber(2024, sep);
    expect(getBroadcastYear(sep1, sep)).toBe(2024);
  });

  it("the day before the broadcast year start belongs to the prior year", () => {
    const sep1_2024 = startOfBroadcastYearByNumber(2024, sep);
    const dayBefore = new Date(sep1_2024.getTime() - 1);
    expect(getBroadcastYear(dayBefore, sep)).toBe(2023);
  });

  // Sep 1, 2019 is Sunday → broadcast year 2019 starts Aug 26, 2019 (53-week year)
  it("handles 53-week year where Sep 1 is Sunday", () => {
    expect(getBroadcastYear(new Date(2019, 7, 26), sep)).toBe(2019); // Aug 26 = year start
    expect(getBroadcastYear(new Date(2019, 7, 25), sep)).toBe(2018); // Aug 25 = prior year
    expect(getBroadcastYear(new Date(2020, 7, 30), sep)).toBe(2019); // week 53 of 2019
  });

  // Sep 1, 2018 is Saturday and the following Feb (2019) is not a leap year, so
  // broadcast year 2018 is a 52-week year — its span to 2019's start is exactly
  // 52 weeks, not 53.
  it("Sep 1 on Saturday without a leap February is a 52-week year", () => {
    const start2018 = startOfBroadcastYearByNumber(2018, sep);
    const start2019 = startOfBroadcastYearByNumber(2019, sep);
    expect(start2018.getDay()).toBe(1); // Monday Aug 27, 2018 (Sep 1 is Saturday)
    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const weeks = Math.round((start2019.getTime() - start2018.getTime()) / WEEK);
    expect(weeks).toBe(52);
  });
});
