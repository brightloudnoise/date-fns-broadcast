import type { DateArg } from "date-fns";
import { endOfWeek } from "date-fns";
export function endOfBroadcastWeek<DateType extends Date>(
  date: DateArg<DateType>,
): DateType {
  return endOfWeek(date, { weekStartsOn: 1 });
}
