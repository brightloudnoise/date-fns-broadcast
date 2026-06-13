import { describe, it, expect } from "vitest";
import { renderBroadcastCalendar } from "./index";

const sep = { yearStartMonth: 8 } as const;

describe("renderBroadcastCalendar (September-based)", () => {
  it("titles the calendar with the broadcast year", () => {
    expect(renderBroadcastCalendar(2024, sep)).toContain("2024 Broadcast Calendar");
  });

  it("orders months from September through the following August", () => {
    const out = renderBroadcastCalendar(2024, sep);
    const monthHeaders = [...out.matchAll(/^(\w+ \d{4}) \(\d+ weeks\)$/gm)].map(
      (m) => m[1],
    );
    expect(monthHeaders).toHaveLength(12);
    expect(monthHeaders[0]).toBe("September 2024");
    expect(monthHeaders[11]).toBe("August 2025");
  });

  it("renders 53 week rows for a 53-week year (Sep 1, 2024 is Sunday)", () => {
    const out = renderBroadcastCalendar(2024, sep);
    const weekRows = [...out.matchAll(/^\d{2} \|/gm)];
    expect(weekRows).toHaveLength(53);
  });
});
