import type { DateArg } from "date-fns";
import { startOfYear } from "date-fns";
import { startOfBroadcastWeek } from "../startOfBroadcastWeek";

export function startOfBroadcastYear(date: DateArg<Date>) {
  const firstOfYear = startOfYear(date);
  return startOfBroadcastWeek(firstOfYear);
}
