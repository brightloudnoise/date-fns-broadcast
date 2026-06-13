import { describe, it, expect } from "vitest";
import { renderBroadcastCalendar } from "./index";

describe("renderBroadcastCalendar (January-based)", () => {
  it("titles the calendar with the broadcast year", () => {
    expect(renderBroadcastCalendar(2025)).toContain("2025 Broadcast Calendar");
  });

  it("orders months from January through December", () => {
    const out = renderBroadcastCalendar(2025);
    const monthHeaders = [...out.matchAll(/^(\w+ \d{4}) \(\d+ weeks\)$/gm)].map(
      (m) => m[1],
    );
    expect(monthHeaders).toHaveLength(12);
    expect(monthHeaders[0]).toBe("January 2025");
    expect(monthHeaders[11]).toBe("December 2025");
  });

  it("renders 52 week rows for a 52-week year (2025) and 53 for a 53-week year (2023)", () => {
    const rows = (year: number) =>
      [...renderBroadcastCalendar(year).matchAll(/^\d{2} \|/gm)].length;
    expect(rows(2025)).toBe(52);
    expect(rows(2023)).toBe(53);
  });
});
