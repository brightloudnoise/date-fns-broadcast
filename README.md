# date-fns-broadcast

A set of helper functions for working with broadcast calendar dates, built to be compatible with [date-fns](https://date-fns.org/).

## Installation

```sh
npm install date-fns-broadcast date-fns
```

## What is a Broadcast Calendar?

The Broadcast Calendar is a standardized calendar used primarily in the broadcasting industry for planning and purchasing radio and television programs and advertising. It was designed to provide uniform billing periods and has been widely adopted by broadcasters, agencies, and advertisers.

Key characteristics:

- Every week starts on Monday and ends on Sunday
- Every month has either 4 or 5 complete weeks (28 or 35 days)
- Every month ends on the last Sunday of the calendar month
- The first week of every broadcast month always contains the first day of the calendar month
- Years can have either 52 or 53 weeks

### 53-Week Years

A broadcast calendar will have 53 weeks in:

- A leap year where January 1 falls on a Saturday or Sunday
- A common year where January 1 falls on a Sunday

Known 53-week years in the 21st century: 2006, 2012, 2017, 2023, 2028, 2034, 2040, 2045, 2051, 2056, 2062, 2068, 2073, 2079, 2084, 2090, and 2096.

## Functions

### Week Functions

- `startOfBroadcastWeek(date)` - Returns the Monday of the broadcast week
- `endOfBroadcastWeek(date)` - Returns the Sunday of the broadcast week
- `getBroadcastWeek(date)` - Returns the week number (1-53) within the broadcast year

### Month Functions

- `startOfBroadcastMonth(date)` - Returns the first Monday of the broadcast month
- `endOfBroadcastMonth(date)` - Returns the last Sunday of the broadcast month
- `getBroadcastMonth(date)` - Returns the broadcast month number (1-12)
- `formatBroadcastMonth(date, formatStr?)` - Returns the broadcast month as a formatted string (default: `"MMMM yyyy"`)

### Quarter Functions

- `startOfBroadcastQuarter(date)` - Returns the first Monday of the broadcast quarter
- `endOfBroadcastQuarter(date)` - Returns the last Sunday of the broadcast quarter
- `getBroadcastQuarter(date)` - Returns the quarter number (1-4)

### Year Functions

- `startOfBroadcastYear(date)` - Returns the start of the broadcast year
- `endOfBroadcastYear(date)` - Returns the end of the broadcast year
- `getBroadcastYear(date)` - Returns the broadcast year number

### Utility Functions

- `renderBroadcastCalendar(year)` - Returns a string representation of the broadcast calendar for a given year

## A note on date construction

Avoid constructing dates from short ISO strings like `new Date("2025-01-01")`. JavaScript treats these as UTC midnight, which in non-UTC timezones resolves to the previous day — a common source of off-by-one errors.

Prefer local date construction:

```ts
// ✅ correct — uses local time
const date = new Date(2025, 0, 1);

// ⚠️ avoid — parsed as UTC, may resolve to Dec 31 in your timezone
const date = new Date("2025-01-01");
```

This applies to all date-fns functions, not just this library.

## Examples

```ts
import {
  getBroadcastWeek,
  getBroadcastMonth,
  getBroadcastYear,
  startOfBroadcastMonth,
  endOfBroadcastMonth,
  formatBroadcastMonth,
} from "date-fns-broadcast";

// Basic lookups
const date = new Date(2025, 0, 1); // January 1, 2025
getBroadcastWeek(date);   // 1
getBroadcastMonth(date);  // 1
getBroadcastYear(date);   // 2025

// Broadcast month boundaries can differ from calendar month boundaries.
// January 1, 2025 falls on a Wednesday, so the broadcast month starts
// on the previous Monday, December 30, 2024.
startOfBroadcastMonth(date); // 2024-12-30
endOfBroadcastMonth(date);   // 2025-01-26

// Format a broadcast month
formatBroadcastMonth(date);           // "January 2025"
formatBroadcastMonth(date, "MMM yy"); // "Jan 25"
```
