import { describe, it, expect } from "vitest";
import { endOfBroadcastMonth } from "./index";

describe("endOfBroadcastMonth", () => {
  it("returns last Sunday of the month", () => {
    const date = new Date(2024, 2, 15);
    const result = endOfBroadcastMonth(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 2, 31, 23, 59, 59, 999).toISOString(),
    );
  });

  it("returns correct last Sunday when month ends mid-week", () => {
    const date = new Date(2024, 3, 15);
    const result = endOfBroadcastMonth(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 3, 28, 23, 59, 59, 999).toISOString(),
    );
  });

  it("handles month ending on Sunday", () => {
    const date = new Date(2024, 8, 15);
    const result = endOfBroadcastMonth(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 8, 29, 23, 59, 59, 999).toISOString(),
    );
  });

  it("handles month ending on Monday", () => {
    const date = new Date(2024, 11, 15);
    const result = endOfBroadcastMonth(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 11, 29, 23, 59, 59, 999).toISOString(),
    );
  });
});
