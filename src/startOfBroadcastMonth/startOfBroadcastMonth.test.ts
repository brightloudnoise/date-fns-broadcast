import { describe, it, expect } from "vitest";
import { startOfBroadcastMonth } from "./index";

describe("startOfBroadcastMonth", () => {
  it("returns first of month when month starts on Monday", () => {
    const date = new Date(2024, 3, 15);
    const result = startOfBroadcastMonth(date);
    expect(result.toISOString()).toBe(new Date(2024, 3, 1).toISOString());
  });

  it("returns previous Monday when month starts on other days", () => {
    const date = new Date(2024, 2, 15);
    const result = startOfBroadcastMonth(date);
    expect(result.toISOString()).toBe(new Date(2024, 1, 26).toISOString());
  });

  it("returns previous Monday when month starts on other days", () => {
    const date = new Date(2024, 8, 1);
    const result = startOfBroadcastMonth(date);
    expect(result.toISOString()).toBe(new Date(2024, 7, 26).toISOString());
  });

  it("handles month starting on Sunday", () => {
    const date = new Date(2024, 8, 1);
    const result = startOfBroadcastMonth(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2024, 7, 26).toISOString());
  });

  it("handles month starting on Saturday", () => {
    const date = new Date(2024, 5, 1);
    const result = startOfBroadcastMonth(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2024, 4, 27).toISOString());
  });
});
