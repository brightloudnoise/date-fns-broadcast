import { describe, it, expect } from "vitest";
import { getBroadcastWeek } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";
import { addWeeks } from "date-fns";

const sep = { yearStartMonth: 8 } as const;

describe("getBroadcastWeek (September-based)", () => {
  it("week 1 at broadcast year start", () => {
    const start = startOfBroadcastYearByNumber(2024, sep);
    expect(getBroadcastWeek(start, sep)).toBe(1);
  });

  // Sep 1, 2025 is Monday → broadcast year 2025 starts Sep 1, 2025 exactly
  // Oct 6 is 5 weeks in → week 6
  it("known date: Oct 6, 2025 is week 6 of the 2025 September-based year", () => {
    expect(getBroadcastWeek(new Date(2025, 9, 6), sep)).toBe(6);
  });

  // Sep 2024 start = Aug 26 (Sep 1 is Sunday).
  // Week 19 = Dec 30–Jan 5; week 20 starts Jan 6.
  it("known date: Jan 6, 2025 is in week 20 of the 2024 September-based year", () => {
    expect(getBroadcastWeek(new Date(2025, 0, 6), sep)).toBe(20);
  });

  it("week 52 at last week of a 52-week year (Sep 1, 2022 is Thursday)", () => {
    const start2022 = startOfBroadcastYearByNumber(2022, sep);
    expect(getBroadcastWeek(addWeeks(start2022, 51), sep)).toBe(52);
  });

  it("Sep 1, 2019 is Sunday — 53-week year, week 53 exists", () => {
    // broadcast year 2019 starts Aug 26, 2019; week 53 = last week before Sep 2020 start
    const start2019 = startOfBroadcastYearByNumber(2019, sep);
    expect(getBroadcastWeek(addWeeks(start2019, 52), sep)).toBe(53);
  });

  it("no phantom week 53 in a 52-week year: the week after week 52 is week 1 of the next year", () => {
    // 2022 is a 52-week Sep-based year. The Monday one week past the last week
    // belongs to broadcast year 2023, so it must report week 1, never 53.
    const start2022 = startOfBroadcastYearByNumber(2022, sep);
    expect(getBroadcastWeek(addWeeks(start2022, 52), sep)).toBe(1);
  });
});
