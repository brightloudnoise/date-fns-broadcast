import { describe, it, expect } from "vitest";
import { eachBroadcastWeekOfYear } from "./index";
import { startOfBroadcastYearByNumber } from "../startOfBroadcastYearByNumber";

const sep = { yearStartMonth: 8 } as const;

describe("eachBroadcastWeekOfYear (September-based)", () => {
  it("returns 52 weeks for a regular year (2022)", () => {
    expect(eachBroadcastWeekOfYear(2022, sep)).toHaveLength(52);
  });

  it("returns 53 weeks for a 53-week year (Sep 1, 2019 is Sunday)", () => {
    expect(eachBroadcastWeekOfYear(2019, sep)).toHaveLength(53);
  });

  it("returns 53 weeks for a 53-week year (Sep 1, 2024 is Sunday)", () => {
    expect(eachBroadcastWeekOfYear(2024, sep)).toHaveLength(53);
  });

  it("first week matches the broadcast year start", () => {
    const [first] = eachBroadcastWeekOfYear(2024, sep);
    expect(first).toEqual(startOfBroadcastYearByNumber(2024, sep));
  });

  it("all weeks are Mondays", () => {
    eachBroadcastWeekOfYear(2025, sep).forEach((w) => expect(w.getDay()).toBe(1));
  });
});
