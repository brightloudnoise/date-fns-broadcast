import type { DateArg } from "date-fns";
import { endOfQuarter, toDate } from "date-fns";

import { endOfBroadcastMonth } from "../endOfBroadcastMonth";

/**
 * Returns the end of the broadcast quarter containing the given date
 * Broadcast quarters end on the last Sunday of the quarter's last month
 */
export function endOfBroadcastQuarter(date: DateArg<Date>) {
  const dateObj = toDate(date);
  const quarterEnd = endOfQuarter(dateObj);
  return endOfBroadcastMonth(quarterEnd);
}
