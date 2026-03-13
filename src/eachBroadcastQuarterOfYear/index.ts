import { startOfBroadcastQuarter } from "../startOfBroadcastQuarter";

export function eachBroadcastQuarterOfYear(year: number): Date[] {
  return [0, 3, 6, 9].map((month) =>
    startOfBroadcastQuarter(new Date(year, month, 1))
  );
}
