import { describe, it, expect } from "vitest";
import { startOfBroadcastQuarter } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";
import { addWeeks } from "date-fns";

const sep = { yearStartMonth: 8 } as const;

describe("startOfBroadcastQuarter (September-based)", () => {
  it("Q1 starts at the broadcast year start (September)", () => {
    const yearStart = startOfBroadcastYearByNumber(2024, sep);
    expect(startOfBroadcastQuarter(new Date(2024, 8, 15), sep)).toEqual(yearStart);
  });

  it("Q2 starts 13 weeks into the year (December)", () => {
    const yearStart = startOfBroadcastYearByNumber(2024, sep);
    expect(startOfBroadcastQuarter(new Date(2024, 11, 15), sep)).toEqual(addWeeks(yearStart, 13));
  });

  it("Q3 starts 26 weeks into the year (March)", () => {
    const yearStart = startOfBroadcastYearByNumber(2024, sep);
    expect(startOfBroadcastQuarter(new Date(2025, 2, 15), sep)).toEqual(addWeeks(yearStart, 26));
  });

  it("Q4 starts 39 weeks into the year (June)", () => {
    const yearStart = startOfBroadcastYearByNumber(2024, sep);
    expect(startOfBroadcastQuarter(new Date(2025, 5, 15), sep)).toEqual(addWeeks(yearStart, 39));
  });

  it("returns a Monday", () => {
    expect(startOfBroadcastQuarter(new Date(2024, 8, 15), sep).getDay()).toBe(1);
    expect(startOfBroadcastQuarter(new Date(2025, 2, 15), sep).getDay()).toBe(1);
  });
});
