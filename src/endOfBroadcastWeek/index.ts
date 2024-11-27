import type { DateArg } from "date-fns";
import { endOfWeek } from "date-fns";
export function endOfBroadcastWeek(date: DateArg<Date>) {
  return endOfWeek(date, { weekStartsOn: 1 });
}
