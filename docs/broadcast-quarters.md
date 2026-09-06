# Why a broadcast quarter is three months, not thirteen weeks

`startOfBroadcastQuarter` and friends bound **three broadcast months**. A quarter
is therefore 12, 13 or 14 weeks; only the four together are fixed at the year's
52 or 53. This is written down because it contradicts a very common claim — "a
broadcast quarter is 13 weeks" — and because the code used to implement that
claim.

## The evidence

The broadcast calendar standard defines **weeks and months**. It does not define
quarters.

| Source | Week | Month | Quarter |
|---|---|---|---|
| [TVB](https://www.tvb.org/research-measurement-analytics/research/tv-programming/broadcast-calendar-nielsen-survey-dates/) (TV industry bureau) | Mon–Sun | "ends on the last Sunday of the calendar month" | not mentioned |
| [TVB 2026 calendar (PDF)](https://www.tvb.org/wp-content/uploads/2025/11/Broadcast-Calendar-TVB-2026.pdf) | grid | 12 month blocks | **no quarter markings anywhere** |
| [TAB 2018 calendar (PDF)](https://www.tab.org/public/upload/files/misc/2018-tab-broadcast-calendar.pdf) | numbered 1–52 | 12 month blocks | no quarter markings |
| [Wikipedia](https://en.wikipedia.org/wiki/Broadcast_calendar) | Mon–Sun | "first week … contains the … first of the month" | silent |
| [Effective Media Services glossary](https://effectivemediaservices.com/glossary-of-terms) | — | "four- or five-week period … ending on the last Sunday of the month" | **"one of four three-[broadcast-month] periods starting in broadcast January (1st), April (2nd), July (3rd), or October (4th)"** |

Only the last defines a quarter structurally, and it defines it as three months.
Sources that say "13 weeks" also state the last-Sunday month rule, which
contradicts it in the years below — so 13 is a description of the common case,
not a definition.

## Why 13 cannot be the rule

Jan 1 → Apr 1 is 91 days in a leap year (exactly 13 weeks, so Q1 is always 13)
but 90 in a common year. When a common year opens on a Monday, April's block
starts on Mar 26 and Q1 loses a week.

**2018 is such a year, and it is in print.** The TAB calendar shows:

```
JANUARY   weeks 1–4    Jan 1  – Jan 28     4 weeks
FEBRUARY  weeks 5–8    Jan 29 – Feb 25     4 weeks
MARCH     weeks 9–12   Feb 26 – Mar 25     4 weeks   <-- 12 weeks for Jan+Feb+Mar
APRIL     weeks 13–17  Mar 26 – Apr 29     5 weeks
```

Forcing a 13-week Q1 would require broadcast March 2018 to run to Apr 1, which
contradicts "ends on the last Sunday of the calendar month".

This is the difference from a [4-4-5 or 4-5-4 retail
calendar](https://www.fulfil.io/blog/retail-calendar-guide-2025-4-5-4-vs-4-4-5-calendar-systems-explained/),
which *imposes* a month pattern precisely so every quarter is 13 weeks. The
broadcast calendar anchors months to Gregorian month-ends instead and lets the
quarter fall where it falls.

## Distribution, 2000–2100 (January anchor)

| Length | Count |
|---|---|
| 12 weeks | 11 |
| 13 weeks | 364 |
| 14 weeks | 29 |

The four quarters sum to the year's 52 or 53 in every one of the 101 years, on
both the January and September anchors.

Every 12-week quarter is a **Q1**: 2001, 2007, 2018, 2029, 2035, 2046, 2057,
2063, 2074, 2085, 2091.

**2029 is the sharpest test** if this is ever revisited — `12 13 14 13`. Its Q3
is 14 weeks in a *52*-week year, which the fixed reading cannot produce at all,
since it only reaches 14 by giving a 53rd week to Q4.

## Limits of this research

No source reachable at the time of writing labels quarter boundaries on a
published calendar for a divergent year. The conclusion rests on the structural
definition above, on the absence of any quarter concept in the published
standard, and on the arithmetic. A 2029, 2018, 2007 or 2001 calendar that marks
quarters would settle it outright.
