import { startOfQuarter, toDate } from "date-fns";
import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

export function eachBroadcastMonthOfQuarter(date: Date): Date[] {
  const quarterDate = startOfQuarter(toDate(date));
  const year = quarterDate.getFullYear();
  const month = quarterDate.getMonth(); // 0, 3, 6, or 9
  return [0, 1, 2].map((i) =>
    startOfBroadcastMonth(new Date(year, month + i, 1))
  );
}
