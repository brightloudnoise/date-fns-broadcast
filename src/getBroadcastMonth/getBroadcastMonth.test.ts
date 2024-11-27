import { describe, it, expect } from "vitest";
import { getBroadcastMonth } from "./index";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";
import { endOfBroadcastMonth } from "../endOfBroadcastMonth";

describe("getBroadcastMonth", () => {
  it("returns correct month number for regular dates", () => {
    expect(getBroadcastMonth(new Date(2024, 0, 15))).toBe(1); // January
    expect(getBroadcastMonth(new Date(2024, 5, 15))).toBe(6); // June
    expect(getBroadcastMonth(new Date(2024, 11, 15))).toBe(12); // December
  });

  it("handles month transitions", () => {
    // End of January
    expect(getBroadcastMonth(new Date(2024, 0, 28))).toBe(1);
    // Start of February
    expect(getBroadcastMonth(new Date(2024, 1, 1))).toBe(2);
  });

  it("handles year transitions", () => {
    // December 30, 2024 is actually part of broadcast January 2025
    expect(getBroadcastMonth(new Date(2024, 11, 30))).toBe(1);
    expect(getBroadcastMonth(new Date(2025, 0, 1))).toBe(1);
  });

  it("handles special cases at year boundaries", () => {
    // December 26, 2022 is part of broadcast January 2023
    expect(getBroadcastMonth(new Date(2022, 11, 26))).toBe(1);
    // December 31, 2023 is still part of broadcast December 2023 (53-week year)
    expect(getBroadcastMonth(new Date(2023, 11, 31))).toBe(12);
  });

  it("handles first and last days of broadcast months", () => {
    // March 2024 broadcast month starts Feb 26
    const marchStart = startOfBroadcastMonth(new Date(2024, 2, 1));
    expect(getBroadcastMonth(marchStart)).toBe(3);

    // March 2024 broadcast month ends March 31
    const marchEnd = endOfBroadcastMonth(new Date(2024, 2, 1));
    expect(getBroadcastMonth(marchEnd)).toBe(3);
  });

  it("handles broadcast months starting in previous calendar month", () => {
    // March 2024 broadcast month starts on February 26
    expect(getBroadcastMonth(new Date(2024, 1, 26))).toBe(3); // Feb 26 is part of March
    expect(getBroadcastMonth(new Date(2024, 1, 27))).toBe(3); // Feb 27 is part of March
    expect(getBroadcastMonth(new Date(2024, 1, 28))).toBe(3); // Feb 28 is part of March
    expect(getBroadcastMonth(new Date(2024, 1, 29))).toBe(3); // Feb 29 is part of March

    // September 2024 broadcast month starts on August 26
    expect(getBroadcastMonth(new Date(2024, 7, 26))).toBe(9); // Aug 26 is part of September
  });

  it("handles broadcast months ending in current month", () => {
    // February 2024 broadcast month ends on February 25
    expect(getBroadcastMonth(new Date(2024, 1, 25))).toBe(2);
    // March 2024 broadcast month ends on March 31
    expect(getBroadcastMonth(new Date(2024, 2, 31))).toBe(3);
  });

  it("handles all days in a broadcast month", () => {
    // Test every day in March 2024 broadcast month (Feb 26 - Mar 31)
    const marchStart = startOfBroadcastMonth(new Date(2024, 2, 1));
    const marchEnd = endOfBroadcastMonth(new Date(2024, 2, 1));

    const currentDate = new Date(marchStart);
    while (currentDate <= marchEnd) {
      expect(getBroadcastMonth(currentDate)).toBe(3);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
});
