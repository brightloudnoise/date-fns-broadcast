# date-fns-broadcast

A date-fns extension library for broadcast calendar arithmetic — week-aligned months, 4-4-5 quarters, and a configurable year-start month.

## Overview

A broadcast calendar is a week-aligned calendar: every month contains only complete Monday–Sunday weeks, grouped into 13-week quarters that follow a 4-4-5 pattern. A broadcast year therefore holds 52 or 53 whole weeks rather than 365/366 days.

- **Weeks** run Monday through Sunday.
- **Months** never split a week; a broadcast month starts on the Monday on/before the 1st of its calendar month and ends on the last Sunday of that calendar month.
- **Quarters** are 13 weeks, structured 4-4-5 (weeks per month).
- **Years** start near the first of the **Year Start Month** and contain 52 or 53 weeks.

## Design decisions

- **Default year start is January (`yearStartMonth: 0`).** Pass `{ yearStartMonth: 8 }` for a September-anchored year. January and September are the only well-tested, documented values.
- **`YearStartMonth` is typed as the full `0 | 1 | … | 11` union**, not a named subset like `0 | 8`. The boundary/53-week algorithm is correct for any anchor month, and narrowing the type now would be a breaking change to widen later. See [docs/adr/0001-year-start-month-type.md](docs/adr/0001-year-start-month-type.md).
- **A function accepts `BroadcastOptions` if and only if its output depends on where the broadcast year starts.** Year-relative helpers (`getBroadcastMonth`, `getBroadcastQuarter`, `getBroadcast{Week,Year}`, the `each*`/`startOf*`/`endOf*` year/quarter helpers, `countBroadcastWeeksInYear`, `renderBroadcastCalendar`) take it. Year-start-agnostic primitives (`startOf/endOfBroadcastWeek`, `startOf/endOfBroadcastMonth`, `countBroadcastWeeksInMonth`, `eachBroadcastWeekOfMonth`, `formatBroadcastMonth`) do not.

## Glossary

### Calendar systems

| Term | Definition | Avoid |
|------|-----------|-------|
| **Broadcast Calendar** | A week-aligned calendar where months contain only complete Mon–Sun weeks, following the 4-4-5 structure | "broadcast calendar system" |
| **Gregorian Calendar** | The standard civil calendar with months of 28–31 days and no week-alignment constraint | "standard/regular calendar" |
| **Fiscal Calendar** | A 12-month accounting year whose start date is chosen by an organization; may or may not be week-aligned | "accounting calendar" |

### Broadcast year

| Term | Definition | Avoid |
|------|-----------|-------|
| **Broadcast Year** | A 52- or 53-week period anchored to a Year Start Month, named after the calendar year its Anchor Date falls in | "broadcast calendar year" |
| **Year Start Month** | The calendar month (0 = January … 11 = December) whose first day anchors the Broadcast Year Start; defaults to January (0) | "anchor/fiscal start month" |
| **Anchor Date** | The first day of the Year Start Month (e.g. Jan 1 or Sep 1), used to compute the Broadcast Year Start | "year anchor", "reference date" |
| **Broadcast Year Start** | The Monday of (or immediately preceding) the Anchor Date; the first day of the Broadcast Year | "start of broadcast year" |
| **Broadcast Year Number** | The calendar year the Anchor Date belongs to (the year starting Sep 2024 is broadcast year 2024), not the year it ends in | "broadcast year label" |
| **53-Week Year** | A Broadcast Year containing 53 weeks: when the Anchor Date falls on a Sunday, or on a Saturday in a year whose nearest following February is a leap month | "long year" |

### Subdivisions

| Term | Definition | Avoid |
|------|-----------|-------|
| **Broadcast Week** | A seven-day Monday–Sunday period; the atomic unit of the calendar | bare "week" |
| **Broadcast Week Number** | The ordinal position of a Broadcast Week within its Broadcast Year (1–53) | bare "week number" |
| **Broadcast Month** | A calendar month expressed as complete Broadcast Weeks only | "broadcast calendar month" |
| **Broadcast Month Number** | The ordinal position of a Broadcast Month within its Broadcast Year (1–12); month 1 = Year Start Month | bare "month number" |
| **Broadcast Quarter** | A 13-week block; Q1 = weeks 1–13, Q2 = 14–26, Q3 = 27–39, Q4 = 40–52/53 | bare "quarter" |
| **4-4-5 Pattern** | The month structure within a quarter: the first two months have 4 weeks each, the third has 5 | "quarter structure" |

### Configuration

| Term | Definition | Avoid |
|------|-----------|-------|
| **BroadcastOptions** | The options object configuring calendar behaviour; currently carries `yearStartMonth` | bare "options/config" |
| **`yearStartMonth`** | The `BroadcastOptions` field selecting the Year Start Month (`0`–`11`, default `0` = January) | "start/anchor month" |

## Relationships

- A Broadcast Year divides into exactly 4 Broadcast Quarters.
- A Broadcast Quarter divides into exactly 3 Broadcast Months following the 4-4-5 pattern.
- A Broadcast Month contains 4 or 5 Broadcast Weeks.
- A Broadcast Year contains 52 or 53 Broadcast Weeks; the extra week occurs only in a 53-Week Year.
- The Broadcast Year Number matches the calendar year of the Anchor Date, not the year the broadcast year ends.

## Terminology cautions

- **"year"** and **"month"** are overloaded: a date-fns calendar year/month vs. a Broadcast Year/Month. Always qualify — *calendar year* vs *broadcast year*, *calendar month* vs *broadcast month*.
