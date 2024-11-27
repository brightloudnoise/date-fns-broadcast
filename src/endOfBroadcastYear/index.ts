import type { DateArg } from "date-fns";
import { toDate } from "date-fns";
import { startOfBroadcastYear } from "../startOfBroadcastYear";

export function endOfBroadcastYear(date: DateArg<Date>) {
  // Convert DateArg to Date first
  const dateObj = toDate(date);
  // Get start of next year
  const nextYear = new Date(dateObj.getFullYear() + 1, 0, 1);
  // Get the start of that broadcast year
  const nextBroadcastYear = startOfBroadcastYear(nextYear);
  // Go back one day to get the end of the current broadcast year
  return new Date(nextBroadcastYear.getTime() - 1);
}
