import { broadcastQuarterStart } from "../_broadcastQuarterCore";
import type { BroadcastQuarterNumber } from "../_broadcastQuarterCore";
import { resolveYearStartMonth } from "../_broadcastYearCore";
import type { BroadcastOptions } from "../types";

export function eachBroadcastQuarterOfYear(
  year: number,
  options?: BroadcastOptions,
): Date[] {
  const yearStartMonth = resolveYearStartMonth(options);
  return ([1, 2, 3, 4] as BroadcastQuarterNumber[]).map((quarter) =>
    broadcastQuarterStart(year, quarter, yearStartMonth),
  );
}
