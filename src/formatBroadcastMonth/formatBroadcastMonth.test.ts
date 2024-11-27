import { describe, it, expect } from "vitest";
import { formatBroadcastMonth } from "./index";

describe("formatBroadcastMonth", () => {
  it("returns correctly formatted month and year", () => {
    expect(formatBroadcastMonth(new Date(2024, 0, 15))).toBe("January 2024");
    expect(formatBroadcastMonth(new Date(2024, 5, 15))).toBe("June 2024");
  });

  it("handles month transitions", () => {
    // February 26, 2024 is part of March broadcast month
    expect(formatBroadcastMonth(new Date(2024, 1, 26))).toBe("March 2024");
    // March 1, 2024 is part of March broadcast month
    expect(formatBroadcastMonth(new Date(2024, 2, 1))).toBe("March 2024");
  });

  it("handles year transitions", () => {
    // December 30, 2024 is part of January 2025 broadcast month
    expect(formatBroadcastMonth(new Date(2024, 11, 30))).toBe("January 2025");
    // January 1, 2025 is part of January 2025 broadcast month
    expect(formatBroadcastMonth(new Date(2025, 0, 1))).toBe("January 2025");
  });

  it("accepts custom format strings", () => {
    const date = new Date(2024, 0, 15);
    expect(formatBroadcastMonth(date, "MMM yyyy")).toBe("Jan 2024");
    expect(formatBroadcastMonth(date, "MM/yyyy")).toBe("01/2024");
    expect(formatBroadcastMonth(date, "MMMM")).toBe("January");
  });
});
