import { describe, it, expect } from "vitest";
import { startOfBroadcastYearByNumber } from "./index";
import { startOfBroadcastYear } from "../startOfBroadcastYear";

describe("startOfBroadcastYearByNumber", () => {
  it("returns the same result as startOfBroadcastYear with a mid-year date", () => {
    expect(startOfBroadcastYearByNumber(2025).toISOString()).toBe(
      startOfBroadcastYear(new Date(2025, 6, 15)).toISOString()
    );
  });

  it("works for 2024", () => {
    expect(startOfBroadcastYearByNumber(2024).toISOString()).toBe(
      startOfBroadcastYear(new Date(2024, 6, 15)).toISOString()
    );
  });

  it("works for 2026", () => {
    expect(startOfBroadcastYearByNumber(2026).toISOString()).toBe(
      startOfBroadcastYear(new Date(2026, 6, 15)).toISOString()
    );
  });

  it("returns a Monday", () => {
    expect(startOfBroadcastYearByNumber(2025).getDay()).toBe(1);
    expect(startOfBroadcastYearByNumber(2024).getDay()).toBe(1);
    expect(startOfBroadcastYearByNumber(2023).getDay()).toBe(1);
  });
});
