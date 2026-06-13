export type YearStartMonth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface BroadcastOptions {
  yearStartMonth?: YearStartMonth;
}

export const DEFAULT_YEAR_START_MONTH: YearStartMonth = 0;
