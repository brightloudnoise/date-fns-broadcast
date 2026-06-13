import { describe, it, expect } from "vitest";
import { endOfBroadcastYear } from "./index";
import { startOfBroadcastYear } from "../startOfBroadcastYear";
describe("endOfBroadcastYear", () => {
  it("returns the day before start of next broadcast year", () => {
    const date = new Date(2024, 5, 15);
    const result = endOfBroadcastYear(date);
    const nextYearStart = startOfBroadcastYear(new Date(2025, 0, 1));
    const expected = new Date(nextYearStart.getTime() - 1);
    expect(result.toISOString()).toBe(expected.toISOString());
  });

  it("ends on the concrete last Sunday of broadcast year 2024", () => {
    // Jan 1, 2025 is Wednesday → broadcast year 2025 starts Mon Dec 30, 2024,
    // so broadcast year 2024 ends Sun Dec 29, 2024 at 23:59:59.999.
    const result = endOfBroadcastYear(new Date(2024, 5, 15));
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 11, 29, 23, 59, 59, 999).toISOString(),
    );
  });
});
