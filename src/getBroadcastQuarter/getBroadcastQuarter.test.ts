import { describe, it, expect } from "vitest";
import { getBroadcastQuarter } from "./index";

describe("getBroadcastQuarter", () => {
  it("returns correct quarter for regular dates", () => {
    expect(getBroadcastQuarter(new Date(2024, 0, 15))).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 3, 15))).toBe(2);
    expect(getBroadcastQuarter(new Date(2024, 6, 15))).toBe(3);
    expect(getBroadcastQuarter(new Date(2024, 9, 15))).toBe(4);
  });

  it("handles quarter boundaries", () => {
    expect(getBroadcastQuarter(new Date(2024, 0, 1))).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 3, 1))).toBe(2);
    expect(getBroadcastQuarter(new Date(2024, 6, 1))).toBe(3);
    expect(getBroadcastQuarter(new Date(2024, 8, 30))).toBe(4);
  });

  it("handles last days of quarters", () => {
    expect(getBroadcastQuarter(new Date(2024, 2, 31))).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 5, 30))).toBe(2);
    expect(getBroadcastQuarter(new Date(2024, 8, 29))).toBe(3);
    expect(getBroadcastQuarter(new Date(2024, 11, 29))).toBe(4);
  });

  it("handles edge cases around year boundaries", () => {
    expect(getBroadcastQuarter(new Date(2023, 11, 30))).toBe(4);
    expect(getBroadcastQuarter(new Date(2024, 11, 30))).toBe(1);
  });

  it("handles quarter transitions", () => {
    expect(getBroadcastQuarter(new Date(2024, 2, 31))).toBe(1);
    expect(getBroadcastQuarter(new Date(2024, 3, 1))).toBe(2);
    expect(getBroadcastQuarter(new Date(2024, 5, 30))).toBe(2);
    expect(getBroadcastQuarter(new Date(2024, 6, 1))).toBe(3);
    expect(getBroadcastQuarter(new Date(2024, 8, 29))).toBe(3);
    expect(getBroadcastQuarter(new Date(2024, 8, 30))).toBe(4);
    expect(getBroadcastQuarter(new Date(2024, 11, 29))).toBe(4);
    expect(getBroadcastQuarter(new Date(2024, 11, 30))).toBe(1);
  });
});
