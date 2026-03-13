import { describe, it, expect } from "vitest";
import { eachBroadcastMonthOfQuarter } from "./index";
import { eachBroadcastMonthOfYear } from "../eachBroadcastMonthOfYear";

describe("eachBroadcastMonthOfQuarter", () => {
  it("returns 3 months for a Q1 date", () => {
    expect(eachBroadcastMonthOfQuarter(new Date(2025, 1, 15))).toHaveLength(3);
  });

  it("all returned dates are Mondays", () => {
    eachBroadcastMonthOfQuarter(new Date(2025, 1, 15)).forEach((m) =>
      expect(m.getDay()).toBe(1)
    );
  });

  it("Q1 matches first 3 months of eachBroadcastMonthOfYear", () => {
    const q1 = eachBroadcastMonthOfQuarter(new Date(2025, 1, 15));
    const allMonths = eachBroadcastMonthOfYear(2025);
    expect(q1.map((d) => d.toISOString())).toEqual(
      allMonths.slice(0, 3).map((d) => d.toISOString())
    );
  });

  it("Q2 matches months 3-5 of eachBroadcastMonthOfYear", () => {
    const q2 = eachBroadcastMonthOfQuarter(new Date(2025, 4, 15));
    const allMonths = eachBroadcastMonthOfYear(2025);
    expect(q2.map((d) => d.toISOString())).toEqual(
      allMonths.slice(3, 6).map((d) => d.toISOString())
    );
  });

  it("Q3 matches months 6-8 of eachBroadcastMonthOfYear", () => {
    const q3 = eachBroadcastMonthOfQuarter(new Date(2025, 7, 15));
    const allMonths = eachBroadcastMonthOfYear(2025);
    expect(q3.map((d) => d.toISOString())).toEqual(
      allMonths.slice(6, 9).map((d) => d.toISOString())
    );
  });

  it("Q4 matches months 9-11 of eachBroadcastMonthOfYear", () => {
    const q4 = eachBroadcastMonthOfQuarter(new Date(2025, 10, 15));
    const allMonths = eachBroadcastMonthOfYear(2025);
    expect(q4.map((d) => d.toISOString())).toEqual(
      allMonths.slice(9, 12).map((d) => d.toISOString())
    );
  });
});
