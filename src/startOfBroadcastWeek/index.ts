import type { DateArg } from "date-fns";
import { startOfWeek } from "date-fns";

export function startOfBroadcastWeek(date: DateArg<Date>) {
  return startOfWeek(date, { weekStartsOn: 1 });
}
