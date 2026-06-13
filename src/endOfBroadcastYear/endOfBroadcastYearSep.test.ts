import { describe, it, expect } from "vitest";
import { endOfBroadcastYear } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";

const sep = { yearStartMonth: 8 } as const;

describe("endOfBroadcastYear (September-based)", () => {
  it("ends the millisecond before the next broadcast year starts", () => {
    const endOf2024 = endOfBroadcastYear(new Date(2024, 8, 15), sep);
    const startOf2025 = startOfBroadcastYearByNumber(2025, sep);
    expect(endOf2024.getTime()).toBe(startOf2025.getTime() - 1);
  });

  it("a date in January resolves to the end of its broadcast year", () => {
    // Jan 2025 is in broadcast year 2024
    const endViaJan = endOfBroadcastYear(new Date(2025, 0, 15), sep);
    const endViaSep = endOfBroadcastYear(new Date(2024, 8, 15), sep);
    expect(endViaJan.getTime()).toBe(endViaSep.getTime());
  });

  it("53-week year ends after 53 weeks (Sep 1, 2019 is Sunday)", () => {
    const start2019 = startOfBroadcastYearByNumber(2019, sep);
    const end2019 = endOfBroadcastYear(new Date(2019, 8, 15), sep);
    const weeks = Math.round((end2019.getTime() - start2019.getTime()) / (7 * 24 * 60 * 60 * 1000));
    expect(weeks).toBe(53);
  });

  it("52-week year ends after 52 weeks", () => {
    const start2022 = startOfBroadcastYearByNumber(2022, sep);
    const end2022 = endOfBroadcastYear(new Date(2022, 8, 15), sep);
    const weeks = Math.round((end2022.getTime() - start2022.getTime()) / (7 * 24 * 60 * 60 * 1000));
    expect(weeks).toBe(52);
  });
});
