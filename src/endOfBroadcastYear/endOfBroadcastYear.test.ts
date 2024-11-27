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
});
