import { describe, it, expect } from "vitest";
import { eachBroadcastQuarterOfYear } from "./index";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";

const sep = { yearStartMonth: 8 } as const;

describe("eachBroadcastQuarterOfYear (September-based)", () => {
  it("returns 4 quarters starting from September", () => {
    const quarters = eachBroadcastQuarterOfYear(2024, sep);
    expect(quarters).toHaveLength(4);
  });

  it("Q1 starts in September", () => {
    const [q1] = eachBroadcastQuarterOfYear(2024, sep);
    expect(q1).toEqual(startOfBroadcastQuarter(new Date(2024, 8, 15), sep));
  });

  it("Q2 starts in December", () => {
    const [, q2] = eachBroadcastQuarterOfYear(2024, sep);
    expect(q2).toEqual(startOfBroadcastQuarter(new Date(2024, 11, 15), sep));
  });

  it("Q3 starts in March of the following calendar year", () => {
    const [, , q3] = eachBroadcastQuarterOfYear(2024, sep);
    expect(q3).toEqual(startOfBroadcastQuarter(new Date(2025, 2, 15), sep));
  });

  it("Q4 starts in June of the following calendar year", () => {
    const [, , , q4] = eachBroadcastQuarterOfYear(2024, sep);
    expect(q4).toEqual(startOfBroadcastQuarter(new Date(2025, 5, 15), sep));
  });

  it("all quarters are Mondays", () => {
    eachBroadcastQuarterOfYear(2024, sep).forEach((q) => {
      expect(q.getDay()).toBe(1);
    });
  });
});
