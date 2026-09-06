import { describe, it, expect } from "vitest";
import { getBroadcastWeek } from "./index";
import { getBroadcastYear } from "../getBroadcastYear";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";

describe("getBroadcastWeek", () => {
  it("returns correct week number for regular dates", () => {
    expect(getBroadcastWeek(new Date(2024, 0, 15))).toBe(3);
    expect(getBroadcastWeek(new Date(2024, 5, 1))).toBe(22);
  });

  it("handles first week of the year", () => {
    expect(getBroadcastWeek(new Date(2024, 0, 1))).toBe(1);
    expect(getBroadcastWeek(new Date(2024, 0, 7))).toBe(1);
  });

  it("handles last week of the year", () => {
    expect(getBroadcastWeek(new Date(2023, 11, 31))).toBe(53);
    expect(getBroadcastWeek(new Date(2024, 11, 29))).toBe(52);
  });

  it("handles dates in 53-week years", () => {
    expect(getBroadcastWeek(new Date(2023, 11, 31))).toBe(53);
  });

  it("handles week 53 in appropriate years", () => {
    const fiftyThreeWeekYears = [
      2006, 2012, 2017, 2023, 2028, 2034, 2040, 2045, 2051, 2056, 2062, 2068,
      2073, 2079, 2084, 2090, 2096,
    ];

    for (const year of fiftyThreeWeekYears) {
      // Dec 31 is week 53 only while it still belongs to that broadcast year.
      // When 1 Jan falls on a Tuesday the next year opens on 31 Dec, so that
      // day is week 1 of the year after: 2012, 2040, 2068 and 2096.
      const date = new Date(year, 11, 31);
      const opensNextYear =
        startOfBroadcastYearByNumber(year + 1).getTime() === date.getTime();
      expect(getBroadcastWeek(date)).toBe(opensNextYear ? 1 : 53);
      expect(getBroadcastYear(date)).toBe(opensNextYear ? year + 1 : year);
    }
  });
});
