import { describe, it, expect } from "vitest";
import { eachBroadcastQuarterOfYear } from "./index";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";

describe("eachBroadcastQuarterOfYear", () => {
  it("returns 4 quarters for 2025", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    expect(quarters).toHaveLength(4);
  });

  it("all returned dates are Mondays", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    quarters.forEach((q) => expect(q.getDay()).toBe(1));
  });

  it("Q1 matches startOfBroadcastQuarter of a mid-Q1 date", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    expect(quarters[0].toISOString()).toBe(
      startOfBroadcastQuarter(new Date(2025, 1, 15)).toISOString()
    );
  });

  it("Q2 matches startOfBroadcastQuarter of a mid-Q2 date", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    expect(quarters[1].toISOString()).toBe(
      startOfBroadcastQuarter(new Date(2025, 4, 15)).toISOString()
    );
  });

  it("Q3 matches startOfBroadcastQuarter of a mid-Q3 date", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    expect(quarters[2].toISOString()).toBe(
      startOfBroadcastQuarter(new Date(2025, 7, 15)).toISOString()
    );
  });

  it("Q4 matches startOfBroadcastQuarter of a mid-Q4 date", () => {
    const quarters = eachBroadcastQuarterOfYear(2025);
    expect(quarters[3].toISOString()).toBe(
      startOfBroadcastQuarter(new Date(2025, 10, 15)).toISOString()
    );
  });
});
