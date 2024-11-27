import { describe, it, expect } from "vitest";
import { endOfBroadcastQuarter } from "./index";

describe("endOfBroadcastQuarter", () => {
  it("returns last Sunday of quarter's last month", () => {
    const date = new Date(2024, 0, 15);
    const result = endOfBroadcastQuarter(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 2, 31, 23, 59, 59, 999).toISOString(),
    );
  });

  it("handles quarters ending mid-week", () => {
    const date = new Date(2024, 4, 15);
    const result = endOfBroadcastQuarter(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 5, 30, 23, 59, 59, 999).toISOString(),
    );
  });

  it("returns previous Sunday when quarter ends mid-week", () => {
    const date = new Date(2024, 7, 15);
    const result = endOfBroadcastQuarter(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 8, 29, 23, 59, 59, 999).toISOString(),
    );
  });

  it("handles first day of quarter", () => {
    const date = new Date(2024, 3, 1);
    const result = endOfBroadcastQuarter(date);
    expect(result.toISOString()).toBe(
      new Date(2024, 5, 30, 23, 59, 59, 999).toISOString(),
    );
  });
});
