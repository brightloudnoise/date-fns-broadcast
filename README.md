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

Functions whose output depends on where the broadcast year starts accept an optional second (or, for year-number-based functions, only) `options: { yearStartMonth?: 0-11 }` argument — see [Configuring the year start month](#configuring-the-year-start-month) below. Functions that only need Monday-based week/month boundaries don't take it.

### Week Functions

- `startOfBroadcastWeek(date)` - Returns the Monday of the broadcast week
- `endOfBroadcastWeek(date)` - Returns the Sunday of the broadcast week
- `getBroadcastWeek(date, options?)` - Returns the week number (1-53) within the broadcast year

### Month Functions

- `startOfBroadcastMonth(date)` - Returns the first Monday of the broadcast month
- `endOfBroadcastMonth(date)` - Returns the last Sunday of the broadcast month
- `getBroadcastMonth(date, options?)` - Returns the broadcast month number (1-12)
- `formatBroadcastMonth(date, formatStr?)` - Returns the broadcast month as a formatted string (default: `"MMMM yyyy"`)

### Quarter Functions

- `startOfBroadcastQuarter(date, options?)` - Returns the first Monday of the broadcast quarter
- `endOfBroadcastQuarter(date, options?)` - Returns the last Sunday of the broadcast quarter
- `getBroadcastQuarter(date, options?)` - Returns the quarter number (1-4)

### Year Functions

- `startOfBroadcastYear(date, options?)` - Returns the start of the broadcast year
- `endOfBroadcastYear(date, options?)` - Returns the end of the broadcast year
- `getBroadcastYear(date, options?)` - Returns the broadcast year number
- `startOfBroadcastYearByNumber(year, options?)` - Returns the start of the broadcast year for a given year number

### Enumeration Functions

- `eachBroadcastWeekOfYear(year, options?)` - Returns an array of week-start Mondays for the broadcast year (52 or 53 dates)
- `eachBroadcastWeekOfQuarter(date)` - Returns an array of week-start Mondays for the broadcast quarter (13 or 14 dates)
- `eachBroadcastWeekOfMonth(date)` - Returns an array of week-start Mondays for the broadcast month (4 or 5 dates)
- `eachBroadcastQuarterOfYear(year, options?)` - Returns an array of 4 quarter-start dates for the broadcast year
- `eachBroadcastMonthOfYear(year, options?)` - Returns an array of 12 month-start dates for the broadcast year
- `eachBroadcastMonthOfQuarter(date)` - Returns an array of 3 month-start dates for the broadcast quarter containing the given date

### Count Functions

- `countBroadcastWeeksInYear(year, options?)` - Returns the number of broadcast weeks in the year (`52 | 53`)
- `countBroadcastWeeksInMonth(date)` - Returns the number of broadcast weeks in the month (`4 | 5`)

### Utility Functions

- `renderBroadcastCalendar(year, options?)` - Returns a string representation of the broadcast calendar for a given year. When `yearStartMonth` isn't January, the calendar spans two calendar years and is labeled as a range (e.g. `"2024-2025 Broadcast Calendar"`).

## Configuring the year start month

By default, the broadcast year starts in January (`yearStartMonth: 0`). Pass a different month (`0`-`11`) to anchor the year elsewhere — for example, `8` for a September-anchored broadcast year:

```ts
import { getBroadcastYear, startOfBroadcastYear } from "date-fns-broadcast";

const date = new Date(2024, 9, 15); // October 15, 2024

getBroadcastYear(date, { yearStartMonth: 8 }); // 2024
startOfBroadcastYear(date, { yearStartMonth: 8 }); // 2024-08-26 (Monday on/before Sep 1, 2024)
```

January and September are the only well-tested, documented anchor months.

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

## Time zones

Every function that takes a date preserves the class and zone of what you pass
in, the same way date-fns v4's own functions do. Hand it a
[`TZDate`](https://github.com/date-fns/tz) and you get a `TZDate` back, resolved
against **that** zone's wall clock rather than the machine's:

```ts
import { TZDate } from "@date-fns/tz";
import { startOfBroadcastMonth } from "date-fns-broadcast";

// 28 Dec 2025 is December's last Sunday, so 29 Dec starts broadcast January.
const d = new TZDate(2025, 11, 29, 0, 0, 0, "Australia/Sydney");

startOfBroadcastMonth(d);
// TZDate 2025-12-29T00:00:00.000+11:00 — correct in Sydney,
// on a machine running anywhere.
```

`@date-fns/tz` is **not** a dependency of this package, and you do not need it
unless you already use it. Nothing here imports it; zone support works because
the library composes date-fns generics instead of calling `new Date(y, m, d)`,
which would silently re-read the wall clock in the machine's zone.

### The number-keyed exception

A handful of functions are keyed on a year *number* rather than a date, so there
is no input to take a zone from. These always return plain machine-zone `Date`s:

- `startOfBroadcastYearByNumber`
- `eachBroadcastMonthOfYear`, `eachBroadcastQuarterOfYear`, `eachBroadcastWeekOfYear`
- `countBroadcastWeeksInYear`
- `renderBroadcastCalendar`

If you need those in a specific zone, derive them from a date-taking function
instead.

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
getBroadcastWeek(date); // 1
getBroadcastMonth(date); // 1
getBroadcastYear(date); // 2025

// Broadcast month boundaries can differ from calendar month boundaries.
// January 1, 2025 falls on a Wednesday, so the broadcast month starts
// on the previous Monday, December 30, 2024.
startOfBroadcastMonth(date); // 2024-12-30
endOfBroadcastMonth(date); // 2025-01-26

// Format a broadcast month
formatBroadcastMonth(date); // "January 2025"
formatBroadcastMonth(date, "MMM yy"); // "Jan 25"
```

### September-anchored broadcast year

```ts
import {
  getBroadcastYear,
  getBroadcastMonth,
  startOfBroadcastYear,
  endOfBroadcastYear,
} from "date-fns-broadcast";

const options = { yearStartMonth: 8 }; // September

const octDate = new Date(2024, 9, 15); // October 15, 2024
getBroadcastYear(octDate, options);  // 2024
getBroadcastMonth(octDate, options); // 2 (September is month 1)
startOfBroadcastYear(octDate, options); // 2024-08-26 (Monday on/before Sep 1, 2024)
endOfBroadcastYear(octDate, options);   // 2025-08-31

// A January date still belongs to the broadcast year that started
// the previous September.
const janDate = new Date(2025, 0, 15); // January 15, 2025
getBroadcastYear(janDate, options);  // 2024
getBroadcastMonth(janDate, options); // 5
```
