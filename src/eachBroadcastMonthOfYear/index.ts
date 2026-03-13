import { startOfBroadcastMonth } from "../startOfBroadcastMonth";

export function eachBroadcastMonthOfYear(year: number): Date[] {
  return Array.from({ length: 12 }, (_, i) =>
    startOfBroadcastMonth(new Date(year, i, 1))
  );
}
