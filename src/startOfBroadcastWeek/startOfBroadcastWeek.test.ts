import { describe, it, expect } from "vitest";
import { startOfBroadcastWeek } from "./index";

describe("startOfBroadcastWeek", () => {
  it("returns Monday for any day in the week", () => {
    const date = new Date(2024, 2, 20);
    const result = startOfBroadcastWeek(date);
    expect(result.getDay()).toBe(1);
    expect(result.toISOString()).toBe(new Date(2024, 2, 18).toISOString());
  });

  it("returns same date if already Monday", () => {
    const monday = new Date(2024, 2, 18);
    const result = startOfBroadcastWeek(monday);
    expect(result.toISOString()).toBe(monday.toISOString());
  });
});
