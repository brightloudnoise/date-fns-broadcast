import { describe, it, expect } from "vitest";
import { getBroadcastQuarter } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";
import { addWeeks } from "date-fns";

const sep = { yearStartMonth: 8 } as const;

describe("getBroadcastQuarter (September-based)", () => {
  it("Q1 = September, October, November (weeks 1–13)", () => {
    expect(getBroadcastQuarter(new Date(2024, 8, 15), sep)).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 9, 15), sep)).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 10, 15), sep)).toBe(1);
  });

  it("Q2 = December, January, February (weeks 14–26)", () => {
    expect(getBroadcastQuarter(new Date(2024, 11, 15), sep)).toBe(2);
    expect(getBroadcastQuarter(new Date(2025, 0, 15), sep)).toBe(2);
    expect(getBroadcastQuarter(new Date(2025, 1, 15), sep)).toBe(2);
  });

  it("Q3 = March, April, May (weeks 27–39)", () => {
    expect(getBroadcastQuarter(new Date(2025, 2, 15), sep)).toBe(3);
    expect(getBroadcastQuarter(new Date(2025, 3, 15), sep)).toBe(3);
    expect(getBroadcastQuarter(new Date(2025, 4, 15), sep)).toBe(3);
  });

  it("Q4 = June, July, August (weeks 40–52/53)", () => {
    expect(getBroadcastQuarter(new Date(2025, 5, 15), sep)).toBe(4);
    expect(getBroadcastQuarter(new Date(2025, 6, 15), sep)).toBe(4);
    expect(getBroadcastQuarter(new Date(2025, 7, 15), sep)).toBe(4);
  });

  it("late-August date belonging to prior broadcast year returns Q4, not Q1", () => {
    // Sep 1, 2019 is Sunday → broadcast year 2019 starts Aug 26, 2019 (53-week year)
    // Aug 30, 2020 is in week 53 of broadcast year 2019 → Q4
    const start2019 = startOfBroadcastYearByNumber(2019, sep);
    const week53 = addWeeks(start2019, 52);
    expect(getBroadcastQuarter(week53, sep)).toBe(4);
  });
});
