import { startOfBroadcastYear } from "../startOfBroadcastYear";

export function startOfBroadcastYearByNumber(year: number): Date {
  // Mid-July is always safely within the broadcast year for any calendar year
  return startOfBroadcastYear(new Date(year, 6, 15));
}
