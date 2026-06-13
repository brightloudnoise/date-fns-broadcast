import type { DateArg } from "date-fns";
import { getBroadcastWeek } from "../getBroadcastWeek";
import type { BroadcastOptions } from "../types";

export function getBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  const weekNumber = getBroadcastWeek(date, options);
  if (weekNumber <= 13) return 1;
  if (weekNumber <= 26) return 2;
  if (weekNumber <= 39) return 3;
  return 4;
}
