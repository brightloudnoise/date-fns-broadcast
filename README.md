# date-fns-broadcast

A set of helper functions for working with broadcast calendar dates, built to be compatible with [date-fns](https://date-fns.org/).

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
- `formatBroadcastMonth(date, formatStr)` - Returns the broadcast month as a formatted string

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

## Examples
