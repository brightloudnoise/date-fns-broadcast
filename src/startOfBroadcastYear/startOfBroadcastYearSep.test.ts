import { describe, it, expect } from "vitest";
import { startOfBroadcastYear } from "./index";

const sep = { yearStartMonth: 8 } as const;

describe("startOfBroadcastYear (September-based)", () => {
  it("returns Monday on or before Sep 1 for a normal year", () => {
    // Sep 1, 2022 is Thursday → broadcast year start = Mon Aug 29
    const result = startOfBroadcastYear(new Date(2022, 8, 15), sep);
    expect(result).toEqual(new Date(2022, 7, 29)); // Aug 29
    expect(result.getDay()).toBe(1);
  });

  it("returns Sep 1 when Sep 1 is Monday", () => {
    // Sep 1, 2025 is Monday
    const result = startOfBroadcastYear(new Date(2025, 8, 15), sep);
    expect(result).toEqual(new Date(2025, 8, 1));
  });

  it("returns Monday before Sep 1 when Sep 1 is Sunday (53-week year)", () => {
    // Sep 1, 2019 is Sunday → broadcast year start = Mon Aug 26
    const result = startOfBroadcastYear(new Date(2019, 8, 15), sep);
    expect(result).toEqual(new Date(2019, 7, 26)); // Aug 26
    expect(result.getDay()).toBe(1);
  });

  it("a date in January resolves to the prior year's broadcast start", () => {
    // Jan 2025 belongs to broadcast year 2024 (Sep-based)
    const result = startOfBroadcastYear(new Date(2025, 0, 15), sep);
    expect(result).toEqual(startOfBroadcastYear(new Date(2024, 8, 15), sep));
  });
});
