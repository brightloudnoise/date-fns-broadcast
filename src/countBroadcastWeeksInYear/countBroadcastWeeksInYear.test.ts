import { describe, it, expect } from "vitest";
import { countBroadcastWeeksInYear } from "./index";

describe("countBroadcastWeeksInYear", () => {
  it("returns 52 for a regular year", () => {
    expect(countBroadcastWeeksInYear(2025)).toBe(52);
  });

  it("returns 53 for a 53-week year", () => {
    expect(countBroadcastWeeksInYear(2023)).toBe(53);
  });

  it("returns 52 for 2024", () => {
    expect(countBroadcastWeeksInYear(2024)).toBe(52);
  });
});
