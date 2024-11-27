import type { DateArg } from "date-fns";
import { getDay, setDay, startOfMonth } from "date-fns";

export function startOfBroadcastMonth(date: DateArg<Date>) {
  // Get the first day of the calendar month
  const firstOfMonth = startOfMonth(date);
  // Get what day of the week it falls on (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = getDay(firstOfMonth);

  // If the first falls on anything but Monday,
  // go back to the previous Monday
  if (dayOfWeek !== 1) {
    return setDay(firstOfMonth, 1, { weekStartsOn: 1 });
  }

  return firstOfMonth;
}
