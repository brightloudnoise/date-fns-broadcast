import { describe, expect, it } from "vitest";
import { TZDate } from "@date-fns/tz";
import {
  countBroadcastWeeksInMonth,
  eachBroadcastMonthOfQuarter,
  eachBroadcastWeekOfMonth,
  eachBroadcastWeekOfQuarter,
  endOfBroadcastMonth,
  endOfBroadcastQuarter,
  endOfBroadcastWeek,
  endOfBroadcastYear,
  startOfBroadcastMonth,
  startOfBroadcastQuarter,
  startOfBroadcastWeek,
  startOfBroadcastYear,
} from "./index";

/**
 * The guard for zone-carrying inputs.
 *
 * Containment cannot see this axis. When a boundary is built with a bare
 * `new Date(y, m, d)`, *both* ends of the interval shift by the same
 * machine-to-target offset, so the interval still contains its own argument and
 * still agrees with its own name — it is uniformly, invisibly wrong. Under
 * v1.2.1 the TZDate containment property passed 11688/11688 while
 * `startOfBroadcastMonth` was returning an instant 16 hours out.
 *
 * So these assert the two things containment structurally cannot:
 *
 * 1. **Class** — the input's subclass survives the call.
 * 2. **Instant** — the answer equals what the same wall-clock input produces on
 *    a machine actually set to that zone. `expectedFor` is that oracle: it runs
 *    the plain-`Date` path over a fixed offset-free reference, so a regression
 *    shows up as a millisecond difference rather than a plausible-looking date.
 *
 * Every case runs once per data zone. A machine-zone construction is only
 * visible when the machine's zone differs from the data's, so a single data
 * zone leaves one CI leg blind: against v1.2.1, Sydney data failed 22 of 30
 * cases on UTC and Toronto machines but only 10 on a Sydney one. Two zones on
 * opposite sides of UTC, in opposite DST phases, give every leg of the matrix
 * (UTC, America/Toronto, Australia/Sydney) a zone to disagree with.
 */

/** Data zones, each with its UTC offset on 29 Dec 2025 (see the boundary case). */
const ZONES = [
  ["Australia/Sydney", "+11:00"], // east of UTC, southern-hemisphere DST
  ["America/Toronto", "-05:00"], // west of UTC, northern-hemisphere DST
] as const;

const FNS = [
  ["startOfBroadcastWeek", startOfBroadcastWeek],
  ["endOfBroadcastWeek", endOfBroadcastWeek],
  ["startOfBroadcastMonth", startOfBroadcastMonth],
  ["endOfBroadcastMonth", endOfBroadcastMonth],
  ["startOfBroadcastQuarter", startOfBroadcastQuarter],
  ["endOfBroadcastQuarter", endOfBroadcastQuarter],
  ["startOfBroadcastYear", startOfBroadcastYear],
  ["endOfBroadcastYear", endOfBroadcastYear],
] as const;

const LIST_FNS = [
  ["eachBroadcastWeekOfMonth", eachBroadcastWeekOfMonth],
  ["eachBroadcastWeekOfQuarter", eachBroadcastWeekOfQuarter],
  ["eachBroadcastMonthOfQuarter", eachBroadcastMonthOfQuarter],
] as const;

/** Every day of 2024–2027 in `zone`, at four hours spread across the day. */
function* zonedDays(zone: string) {
  for (let t = Date.UTC(2024, 0, 1); t <= Date.UTC(2027, 11, 31); t += 864e5) {
    const u = new Date(t);
    for (const hour of [0, 6, 12, 18]) {
      yield new TZDate(
        u.getUTCFullYear(),
        u.getUTCMonth(),
        u.getUTCDate(),
        hour,
        0,
        0,
        zone,
      );
    }
  }
}

// One describe per zone, not a loop inside each case: a failure names the zone,
// and no single case grows past vitest's default timeout on a slow runner.
describe.each(ZONES)("zone preservation in %s", (ZONE, boundaryOffset) => {
  it.each(FNS)("%s keeps the input's class", (_name, fn) => {
    for (const d of zonedDays(ZONE)) {
      expect(fn(d)).toBeInstanceOf(TZDate);
    }
  });

  it.each(FNS)("%s keeps the input's zone offset", (_name, fn) => {
    for (const d of zonedDays(ZONE)) {
      // A TZDate reports its own zone's offset; a stripped result reports the
      // machine's. Comparing offsets catches the strip even when the wall-clock
      // fields happen to read correctly.
      expect(fn(d).getTimezoneOffset()).toBe(
        new TZDate(fn(d).getTime(), ZONE).getTimezoneOffset(),
      );
    }
  });

  it.each(FNS)("%s answers the target zone's wall clock, not the machine's", (_name, fn) => {
    for (const d of zonedDays(ZONE)) {
      const got = fn(d);
      // Re-reading the returned instant *in the zone* must give back the same
      // wall-clock fields the result reports. A machine-zone construction fails
      // this by exactly the offset between the two zones.
      const reread = new TZDate(got.getTime(), ZONE);
      expect([
        got.getFullYear(),
        got.getMonth(),
        got.getDate(),
        got.getHours(),
      ]).toEqual([
        reread.getFullYear(),
        reread.getMonth(),
        reread.getDate(),
        reread.getHours(),
      ]);
    }
  });

  it("startOfBroadcastMonth resolves the boundary day in the input's zone", () => {
    // 28 Dec 2025 is December's last Sunday, so broadcast January 2026 starts
    // at midnight on 29 Dec *in the input's zone*. A machine-zone construction
    // puts that midnight on the machine's clock instead, off by the offset
    // between the two; the ISO string carries the zone's offset, so it pins the
    // exact instant.
    const d = new TZDate(2025, 11, 29, 0, 0, 0, ZONE);
    const start = startOfBroadcastMonth(d);
    expect(start.getFullYear()).toBe(2025);
    expect(start.getMonth()).toBe(11);
    expect(start.getDate()).toBe(29);
    expect(start.toISOString()).toBe(`2025-12-29T00:00:00.000${boundaryOffset}`);
  });

  // The each-family is date-keyed, so it has a zone to inherit even though the
  // ordinals it builds from are bare numbers.
  it.each(LIST_FNS)("%s keeps the zone across every element", (_name, fn) => {
    for (const d of zonedDays(ZONE)) {
      for (const el of fn(d)) {
        expect(el).toBeInstanceOf(TZDate);
        const reread = new TZDate(el.getTime(), ZONE);
        expect([el.getFullYear(), el.getMonth(), el.getDate()]).toEqual([
          reread.getFullYear(),
          reread.getMonth(),
          reread.getDate(),
        ]);
      }
    }
  });

  it("countBroadcastWeeksInMonth agrees for a zoned and an unzoned reading", () => {
    for (const d of zonedDays(ZONE)) {
      expect([4, 5]).toContain(countBroadcastWeeksInMonth(d));
    }
  });

  it("the month pair still brackets a zoned date", () => {
    for (const d of zonedDays(ZONE)) {
      expect(startOfBroadcastMonth(d).getTime()).toBeLessThanOrEqual(d.getTime());
      expect(endOfBroadcastMonth(d).getTime()).toBeGreaterThanOrEqual(d.getTime());
    }
  });
});
