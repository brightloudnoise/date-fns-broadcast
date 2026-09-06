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

  it("puts the 53rd week where the months put it, not always in Q4", () => {
    // Broadcast year 2019 (Sep-based) has 53 weeks. A quarter is three
    // broadcast months, so the extra week belongs to whichever quarter holds
    // the extra 5-week month — here Q3 (Feb 24 – May 31 2020), not Q4.
    expect(eachBroadcastWeekOfQuarter(new Date(2020, 2, 15), sep)).toHaveLength(14);
    expect(eachBroadcastWeekOfQuarter(new Date(2020, 5, 15), sep)).toHaveLength(13);
  });

  it("the four quarters tile the 53-week year exactly", () => {
    const probes = [new Date(2019, 8, 15), new Date(2019, 11, 15), new Date(2020, 2, 15), new Date(2020, 5, 15)];
    const total = probes.reduce((n, d) => n + eachBroadcastWeekOfQuarter(d, sep).length, 0);
    expect(total).toBe(53);
  });

  it("all weeks are Mondays", () => {
    eachBroadcastWeekOfQuarter(new Date(2024, 8, 15), sep).forEach((w) => {
      expect(w.getDay()).toBe(1);
    });
  });
});
