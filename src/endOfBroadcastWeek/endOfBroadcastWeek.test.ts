import { describe, it, expect } from "vitest";
import { endOfBroadcastWeek } from "./index";

describe("endOfBroadcastWeek", () => {
  it("returns Sunday for any day in the week", () => {
    const date = new Date(2024, 2, 20);
    const result = endOfBroadcastWeek(date);
    expect(result.getDay()).toBe(0);
    expect(result.toISOString()).toBe(
      new Date(2024, 2, 24, 23, 59, 59, 999).toISOString(),
    );
  });

  it("returns end of day on Sunday if already Sunday", () => {
    const sunday = new Date(2024, 2, 24);
    const result = endOfBroadcastWeek(sunday);
    expect(result.toISOString()).toBe(
      new Date(2024, 2, 24, 23, 59, 59, 999).toISOString(),
    );
  });
});
