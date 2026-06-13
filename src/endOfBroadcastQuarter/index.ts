import type { DateArg } from "date-fns";
import { addWeeks } from "date-fns";
import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";
import { endOfBroadcastYear } from "../endOfBroadcastYear";
import { getBroadcastQuarter } from "../getBroadcastQuarter";
import type { BroadcastOptions } from "../types";

export function endOfBroadcastQuarter(
  date: DateArg<Date>,
  options?: BroadcastOptions,
) {
  // Q4 ends at the broadcast year end — 14 weeks in a 53-week year, 13 otherwise
  if (getBroadcastQuarter(date, options) === 4) {
    return endOfBroadcastYear(date, options);
  }
  const quarterStart = startOfBroadcastQuarter(date, options);
  return new Date(addWeeks(quarterStart, 13).getTime() - 1);
}
