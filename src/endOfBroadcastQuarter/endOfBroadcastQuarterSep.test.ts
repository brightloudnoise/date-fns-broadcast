import { describe, it, expect } from "vitest";
import { endOfBroadcastQuarter } from "./index";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";
import { endOfBroadcastYear } from "../endOfBroadcastYear";
import { addWeeks } from "date-fns";

const sep = { yearStartMonth: 8 } as const;

describe("endOfBroadcastQuarter (September-based)", () => {
  it("Q1 ends the millisecond before Q2 starts", () => {
    const q2Start = startOfBroadcastQuarter(new Date(2024, 11, 15), sep);
    const q1End = endOfBroadcastQuarter(new Date(2024, 8, 15), sep);
    expect(q1End.getTime()).toBe(q2Start.getTime() - 1);
  });

  it("Q1–Q3 each span exactly 13 weeks", () => {
    for (const month of [8, 11, 2]) { // Sep, Dec, Mar
      const date = month < 8 ? new Date(2025, month, 15) : new Date(2024, month, 15);
      const qStart = startOfBroadcastQuarter(date, sep);
      const qEnd = endOfBroadcastQuarter(date, sep);
      const nextQStart = addWeeks(qStart, 13);
      expect(qEnd.getTime()).toBe(nextQStart.getTime() - 1);
    }
  });

  it("Q4 spans 13 weeks and ends at the broadcast year end in a 52-week year", () => {
    // Sep 1, 2022 is Thursday → broadcast year 2022 is a 52-week year.
    // June 2023 falls in Q4 of broadcast year 2022.
    const q4Date = new Date(2023, 5, 15);
    const q4Start = startOfBroadcastQuarter(q4Date, sep);
    const q4End = endOfBroadcastQuarter(q4Date, sep);
    const yearEnd = endOfBroadcastYear(new Date(2022, 8, 15), sep);
    expect(q4End.getTime()).toBe(yearEnd.getTime());
    const weeks = Math.round((q4End.getTime() - q4Start.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    expect(weeks).toBe(13);
  });

  it("Q4 spans 14 weeks in a 53-week year (Sep 1, 2019 is Sunday)", () => {
    // broadcast year 2019 (Sep-based) has 53 weeks → Q4 gets the extra week
    const q4Date = new Date(2020, 5, 15); // June 2020 = Q4 of broadcast year 2019
    const q4Start = startOfBroadcastQuarter(q4Date, sep);
    const q4End = endOfBroadcastQuarter(q4Date, sep);
    const weeks = Math.round((q4End.getTime() - q4Start.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
    expect(weeks).toBe(14);
  });
});
