import { type DateArg, toDate, startOfQuarter } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

/**
 * Returns the start of the broadcast quarter containing the given date
 * Broadcast quarters start on the Monday of the week containing the first of the quarter
 */

export function startOfBroadcastQuarter(date: DateArg<Date>) {
  const dateObj = toDate(date);
  const quarterStart = startOfQuarter(dateObj);
  return startOfBroadcastMonth(quarterStart);
}
