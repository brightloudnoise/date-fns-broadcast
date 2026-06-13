import { describe, it, expect } from "vitest";
import { getBroadcastMonth } from "./index";

const sep = { yearStartMonth: 8 } as const;

describe("getBroadcastMonth (September-based)", () => {
  it("September is month 1", () => {
    expect(getBroadcastMonth(new Date(2024, 8, 15), sep)).toBe(1);
  });

  it("October is month 2", () => {
    expect(getBroadcastMonth(new Date(2024, 9, 15), sep)).toBe(2);
  });

  it("December is month 4", () => {
    expect(getBroadcastMonth(new Date(2024, 11, 15), sep)).toBe(4);
  });

  it("January is month 5", () => {
    expect(getBroadcastMonth(new Date(2025, 0, 15), sep)).toBe(5);
  });

  it("August is month 12", () => {
    expect(getBroadcastMonth(new Date(2025, 7, 15), sep)).toBe(12);
  });

  it("default (January-based) is unchanged", () => {
    expect(getBroadcastMonth(new Date(2024, 8, 15))).toBe(9);  // September = calendar month 9
    expect(getBroadcastMonth(new Date(2025, 0, 15))).toBe(1);  // January = calendar month 1
  });
});
