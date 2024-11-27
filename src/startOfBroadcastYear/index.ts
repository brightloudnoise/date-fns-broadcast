import type { DateArg } from "date-fns";
import {
  isLeapYear,
  isSaturday,
  isSunday,
  setDay,
  startOfYear,
} from "date-fns";

export function startOfBroadcastYear(date: DateArg<Date>) {
  const firstOfYear = startOfYear(date);

  // Use date-fns isLeapYear function instead
  if (
    (isLeapYear(firstOfYear) &&
      (isSaturday(firstOfYear) || isSunday(firstOfYear))) ||
    (!isLeapYear(firstOfYear) && isSunday(firstOfYear))
  ) {
    return setDay(firstOfYear, 1, { weekStartsOn: 1 });
  }

  return firstOfYear;
}
