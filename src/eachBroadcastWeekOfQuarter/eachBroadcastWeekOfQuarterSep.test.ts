import { describe, it, expect } from "vitest";
import { eachBroadcastWeekOfQuarter } from "./index";

const sep = { yearStartMonth: 8 } as const;

describe("eachBroadcastWeekOfQuarter (September-based)", () => {
  it("Q1–Q3 each return 13 weeks", () => {
    expect(eachBroadcastWeekOfQuarter(new Date(2024, 8, 15), sep)).toHaveLength(13);  // Q1 Sep
    expect(eachBroadcastWeekOfQuarter(new Date(2024, 11, 15), sep)).toHaveLength(13); // Q2 Dec
    expect(eachBroadcastWeekOfQuarter(new Date(2025, 2, 15), sep)).toHaveLength(13);  // Q3 Mar
  });

  it("Q4 returns 13 weeks in a 52-week year", () => {
    // 2022 is a 52-week Sep-based year; Q4 = Jun-Aug 2023
    expect(eachBroadcastWeekOfQuarter(new Date(2023, 5, 15), sep)).toHaveLength(13);
  });

  it("Q4 returns 14 weeks in a 53-week year (Sep 1, 2019 is Sunday)", () => {
    // broadcast year 2019 (Sep-based) has 53 weeks; Q4 = Jun-Aug 2020
    expect(eachBroadcastWeekOfQuarter(new Date(2020, 5, 15), sep)).toHaveLength(14);
  });

  it("all weeks are Mondays", () => {
    eachBroadcastWeekOfQuarter(new Date(2024, 8, 15), sep).forEach((w) => {
      expect(w.getDay()).toBe(1);
    });
  });
});
