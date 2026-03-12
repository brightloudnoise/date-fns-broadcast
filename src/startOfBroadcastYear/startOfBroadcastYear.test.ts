import { describe, it, expect } from "vitest";
import { startOfBroadcastYear } from "./index";

describe("startOfBroadcastYear", () => {
  it("returns January 1 for normal years", () => {
    const date = new Date(2024, 5, 15);
    const result = startOfBroadcastYear(date);
    expect(result.toISOString()).toBe(new Date(2024, 0, 1).toISOString());
  });

  it("returns previous Monday for normal year starting on Sunday", () => {
    const date = new Date(2023, 5, 15);
    const result = startOfBroadcastYear(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2022, 11, 26).toISOString());
  });

  it("returns previous Monday for leap year starting Sat/Sun", () => {
    const date = new Date(2028, 5, 15);
    const result = startOfBroadcastYear(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2027, 11, 27).toISOString());
  });

  it("returns previous Monday for year starting on a mid-week day (2025, Jan 1 = Wednesday)", () => {
    const date = new Date(2025, 5, 15);
    const result = startOfBroadcastYear(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2024, 11, 30).toISOString());
  });
});
