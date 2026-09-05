import type { DateArg } from "date-fns";
import { startOfWeek } from "date-fns";

export function startOfBroadcastWeek<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  return startOfWeek(date, { weekStartsOn: 1 });
}
