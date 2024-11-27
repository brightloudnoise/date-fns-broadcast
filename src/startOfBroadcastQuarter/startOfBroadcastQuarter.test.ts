import { describe, it, expect } from "vitest";
import { startOfBroadcastQuarter } from "./index";

describe("startOfBroadcastQuarter", () => {
  it("returns correct start date for Q1", () => {
    const date = new Date(2024, 0, 15);
    const result = startOfBroadcastQuarter(date);
    expect(result.toISOString()).toBe(new Date(2024, 0, 1).toISOString());
  });

  it("handles mid-quarter dates", () => {
    const date = new Date(2024, 1, 15);
    const result = startOfBroadcastQuarter(date);
    expect(result.toISOString()).toBe(new Date(2024, 0, 1).toISOString());
  });

  it("handles last day of quarter", () => {
    const date = new Date(2024, 2, 31);
    const result = startOfBroadcastQuarter(date);
    expect(result.toISOString()).toBe(new Date(2024, 0, 1).toISOString());
  });
});
