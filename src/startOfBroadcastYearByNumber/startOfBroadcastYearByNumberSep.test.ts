import { describe, it, expect } from "vitest";
import { startOfBroadcastYearByNumber } from "./index";
import { startOfBroadcastYear } from "../startOfBroadcastYear";

const sep = { yearStartMonth: 8 } as const;

describe("startOfBroadcastYearByNumber (September-based)", () => {
  it("matches startOfBroadcastYear for a mid-year date", () => {
    expect(startOfBroadcastYearByNumber(2024, sep)).toEqual(
      startOfBroadcastYear(new Date(2024, 8, 15), sep),
    );
  });

  it("returns a Monday", () => {
    expect(startOfBroadcastYearByNumber(2025, sep).getDay()).toBe(1);
    expect(startOfBroadcastYearByNumber(2022, sep).getDay()).toBe(1);
  });

  it("consecutive years produce non-overlapping ranges", () => {
    const start2024 = startOfBroadcastYearByNumber(2024, sep);
    const start2025 = startOfBroadcastYearByNumber(2025, sep);
    expect(start2025.getTime()).toBeGreaterThan(start2024.getTime());
  });
});
