import { describe, it, expect } from "vitest";
import { countBroadcastWeeksInYear } from "./index";

const sep = { yearStartMonth: 8 } as const;

describe("countBroadcastWeeksInYear (September-based)", () => {
  it("returns 52 for a regular year (Sep 1, 2022 is Thursday)", () => {
    expect(countBroadcastWeeksInYear(2022, sep)).toBe(52);
  });

  it("returns 52 for another regular year (Sep 1, 2025 is Monday)", () => {
    expect(countBroadcastWeeksInYear(2025, sep)).toBe(52);
  });

  it("returns 53 when Sep 1 is Sunday (2019)", () => {
    expect(countBroadcastWeeksInYear(2019, sep)).toBe(53);
  });

  it("returns 53 when Sep 1 is Sunday (2024)", () => {
    // Sep 1, 2024 is Sunday
    expect(countBroadcastWeeksInYear(2024, sep)).toBe(53);
  });
});
