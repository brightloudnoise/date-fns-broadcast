import { describe, it, expect } from "vitest";
import { countBroadcastWeeksInMonth } from "./index";

describe("countBroadcastWeeksInMonth", () => {
  it("returns 4 for a 4-week broadcast month (Feb 2025)", () => {
    expect(countBroadcastWeeksInMonth(new Date(2025, 1, 15))).toBe(4);
  });

  it("returns 5 for a 5-week broadcast month (Mar 2025)", () => {
    expect(countBroadcastWeeksInMonth(new Date(2025, 2, 15))).toBe(5);
  });

  it("returns 4 for Jan 2025", () => {
    expect(countBroadcastWeeksInMonth(new Date(2025, 0, 15))).toBe(4);
  });
});
