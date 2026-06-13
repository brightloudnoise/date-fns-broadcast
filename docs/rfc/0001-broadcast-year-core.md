# RFC 0001: Deep Broadcast Year core

> Status: accepted (implemented) — consolidates ~9 shallow year modules behind one internal core.

## Problem

The concept of a **Broadcast Year** is smeared across ~9 shallow modules that each re-derive the same primitives instead of leaning on a shared core. The friction isn't in any one file — it's in the seams between them.

**Shallow, tightly-coupled modules:** `getBroadcastYear`, `startOfBroadcastYear`, `endOfBroadcastYear`, `startOfBroadcastYearByNumber`, `countBroadcastWeeksInYear`, `eachBroadcastWeekOfYear`, `_internal.isBroadcast53WeekYear` — plus year-anchor math duplicated inside `getBroadcastWeek` and `startOfBroadcastQuarter`.

**Duplication / integration risk in the seams:**

- The **Anchor Date → Broadcast Year Start** expression `startOfBroadcastWeek(new Date(year, yearStartMonth, 1))` is copy-pasted across **6+ functions**. A fix to anchor handling must be applied in every copy or the boundaries silently disagree.
- The **53-Week Year** determination lives in `_internal`, but its *consequences* are re-implemented at distant call sites: the week clamp `Math.min(weekNumber, is53 ? 53 : 52)` in `getBroadcastWeek`, and the "Q4 spans 14 weeks" special case implicit in `endOfBroadcastQuarter`. The rule and its effects are not co-located.
- The `options?.yearStartMonth ?? DEFAULT_YEAR_START_MONTH` default-resolution line is repeated in ~9 files.
- **Redundant recomputation:** `startOfBroadcastQuarter` resolves the Broadcast Year Number *twice* — once directly via `getBroadcastYear`, and again inside `getBroadcastWeek` which calls `getBroadcastYear` itself.
- **Wrapper-to-wrapper import fan-out:** public modules import other public modules (`startOfBroadcastYear → getBroadcastYear`, `getBroadcastWeek → getBroadcastYear`, `startOfBroadcastQuarter → getBroadcastYear + getBroadcastWeek`), so understanding "what year/week is this date in" means bouncing through 3–4 files.

**Why it's hard to navigate/maintain:** a single anchor-month or 53-week bug can hide in any one of the duplicated copies, and the year boundary — the most subtle part of the domain — has no single source of truth. This is the foundational concept the Broadcast Month, Broadcast Quarter, and `each*` builders all transitively depend on.

## Proposed Interface

A deep **internal** core (`src/_broadcastYearCore.ts`) that the thin public wrappers delegate to. The public API stays one-function-per-module for tree-shaking; only the core is deepened.

Free functions threading a **resolved** `YearStartMonth` (default applied once, at the wrapper boundary), plus one descriptor for multi-fact callers:

```ts
// default resolution lives in exactly one place
resolveYearStartMonth(options?: BroadcastOptions): YearStartMonth

// primitives (year-number domain)
broadcastYearStart(year: number, ysm: YearStartMonth): Date   // Anchor Date -> Broadcast Year Start
broadcastYearOf(date: DateArg<Date>, ysm: YearStartMonth): number   // 53-week-aware classification
is53WeekYear(year: number, ysm: YearStartMonth): boolean

// composites
broadcastYearEnd(year: number, ysm: YearStartMonth): Date      // next start - 1ms
broadcastWeekCount(year: number, ysm: YearStartMonth): 52 | 53
broadcastWeeksOf(year: number, ysm: YearStartMonth): Date[]    // all Broadcast Week Starts, in order
broadcastWeekOf(date: DateArg<Date>, ysm: YearStartMonth): number  // 1..weekCount, clamped

// one-shot descriptor for callers needing several facts at once
interface BroadcastYearInfo {
  readonly year: number;       // Broadcast Year Number
  readonly start: Date;        // Broadcast Year Start
  readonly end: Date;
  readonly is53: boolean;
  readonly weekCount: 52 | 53;
}
broadcastYear(date: DateArg<Date>, ysm: YearStartMonth): BroadcastYearInfo  // classifies once
```

**Usage — wrappers collapse to "resolve, call, read one member":**

```ts
// getBroadcastYear
return broadcastYearOf(date, resolveYearStartMonth(options));

// endOfBroadcastYear
const ysm = resolveYearStartMonth(options);
return broadcastYearEnd(broadcastYearOf(date, ysm), ysm);

// countBroadcastWeeksInYear  (no longer materializes a 52-element array to read .length)
return broadcastWeekCount(year, resolveYearStartMonth(options));

// startOfBroadcastQuarter  (resolves the year ONCE via the descriptor)
const ysm = resolveYearStartMonth(options);
const { start, weekCount } = broadcastYear(date, ysm);
const weekNumber = Math.min(
  differenceInWeeks(startOfBroadcastWeek(date), start) + 1,
  weekCount,
);
const quarter = Math.ceil(Math.min(weekNumber, 52) / 13);
return addWeeks(start, (quarter - 1) * 13);
```

**Complexity hidden internally:** the anchor→start incantation; the three-branch 53-week-aware year classification; the 53-week determination; year end (`nextStart - 1ms`); week count (52/53); the week-list `addWeeks` walk (dropping the `new Date(year, ysm, 15)` mid-year probe hack in `eachBroadcastWeekOfYear`); the `differenceInWeeks` + clamp; and the default-resolution line.

This is the **hybrid** of three explored designs: a minimal single-object factory, a maximally-flexible value object with quarter/navigation hooks, and a free-function core. Chosen because the library's whole contract is one tree-shakeable free function per module — free functions tree-shake best and match that grain — while a small descriptor object supplies the structural single-computation guarantee the multi-fact callers need. Speculative quarter/month/navigation members were deliberately dropped: candidates #2 (Broadcast Month) and #4 (Broadcast Quarter) will get their *own* cores built on this one, keeping each concept's logic in one place.

## Dependency Strategy

**Category 1 — In-process.** Pure date-fns math (`toDate`, `getYear`, `getDay`, `isLeapYear`, `differenceInWeeks`, `addWeeks`) plus the library's own `startOfBroadcastWeek`. No I/O, no async, no ports/mocks. The logic is simply merged into one internal module.

Organization (dependency order within the file): `resolveYearStartMonth` (sole consumer of `DEFAULT_YEAR_START_MONTH`) → primitives (`broadcastYearStart`, `is53WeekYear`) → classifier (`broadcastYearOf`) → composites → `broadcastYear` descriptor. `isBroadcast53WeekYear` moves behind `is53WeekYear`; `broadcastMonthAnchor` stays in `_internal.ts` (it's a *month* concern, Year-Start-agnostic). Import direction becomes acyclic: `date-fns` + `startOfBroadcastWeek` + `_internal` → `_broadcastYearCore` → public wrappers. The current wrapper-to-wrapper imports are removed.

## Testing Strategy

**Principle: replace, don't layer.** Behavior-preserving — no public output may change; the `*Sep.test.ts` 53-week suites must still pass unchanged.

**New boundary tests to write** (against the core, covering both the date-domain and year-number-domain entry points):
- Broadcast Year Number classification across year-rollover dates (date in the trailing days of the prior calendar year that belong to the next broadcast year, and vice versa), for both January and September anchors.
- 53-Week Year detection: Anchor Date on a Sunday; Anchor Date on a Saturday in a year whose nearest following February is a leap month; ordinary 52-week years.
- `broadcastYearStart`/`broadcastYearEnd` boundaries (Monday-aligned start; end is exactly next start − 1ms).
- `broadcastWeekCount` returns 52/53 correctly; `broadcastWeeksOf` length equals `weekCount` and the last week's end aligns with year end.
- `broadcastWeekOf` clamps to `weekCount` at the tail of a 53-week year.
- `broadcastYear()` descriptor returns values consistent with calling the individual primitives.

**Old tests to delete once boundary tests exist:** the overlapping year-rollover / 53-week assertions duplicated across `getBroadcastYear`, `startOfBroadcastYear`, `endOfBroadcastYear`, `startOfBroadcastYearByNumber`, `countBroadcastWeeksInYear`, and `eachBroadcastWeekOfYear` test files (incl. their `*Sep.test.ts` variants). Keep a thin smoke test per public wrapper asserting it delegates correctly; move the exhaustive boundary cases to the core suite.

**Test environment needs:** none — pure in-process, runs in the existing vitest suite.

## Implementation Recommendations

Durable guidance, independent of current file paths:

- **The core OWNS** the Broadcast Year boundary: the Anchor Date → Broadcast Year Start mapping, the 53-week-aware classification of a date to a Broadcast Year Number, the 53-Week Year rule, and everything derived from the year start/end (week count, week list, week-of-date). It is the single source of truth for "where does a broadcast year begin and end, and how long is it."
- **It HIDES** the duplicated anchor incantation, the 53-week math and its clamping consequences, the `nextStart - 1ms` end trick, the week-iteration loop, and the option-default resolution.
- **It EXPOSES** free functions over a *resolved* `YearStartMonth` (never the loose `BroadcastOptions` — resolution happens once, at the public boundary), plus a small immutable `BroadcastYearInfo` descriptor for callers needing several facts together.
- **Callers migrate** by replacing inline anchor/classification/53-week logic and cross-wrapper imports with a single import from the core: resolve the option once, then call the one function (or the descriptor) they need. No public signature changes.
- **Future cores build on this one:** Broadcast Month (candidate #2) and Broadcast Quarter (candidate #4) should get their own internal cores that consume this Year core rather than re-deriving the anchor — keeping each concept's logic single-sourced.

## Outcome

Implemented across three internal cores, all delegating downward, with public signatures unchanged:

- `src/_broadcastYearCore.ts` — the Broadcast Year (this RFC).
- `src/_broadcastMonthCore.ts` — the Broadcast Month identity (candidate #2): `broadcastMonthAnchor` (moved out of `_internal.ts`), `broadcastMonthNumber`, `broadcastMonthStartByOrdinal`.
- `src/_broadcastQuarterCore.ts` — the Broadcast Quarter (candidate #4): `quarterOfWeek`, `broadcastQuarterStart/End/Of`, and a `broadcastQuarter` descriptor; the "Q4 runs to the year end" 53-week case lives here, once.
- `src/_internal.ts` is now just `eachBroadcastWeekBetween`, the shared week-walk consumed by `broadcastWeeksOf` and the three `eachBroadcastWeekOf*` builders (candidate #3). The `absMonth` rollover math is single-sourced in `broadcastMonthStartByOrdinal`.

**Testing decision — layered, not replaced (deliberately diverges from the strategy above).** The public one-function-per-module wrappers must stay for tree-shaking, so they *are* the library's real boundary; their tests are genuine boundary coverage, not redundant internal-detail tests. The new core suites (`_broadcast{Year,Month,Quarter}Core.test.ts`) were added as net-new coverage of the consolidated logic, and the wrapper tests were retained. Full suite: 205 passing.

**Left as-is:** `renderBroadcastCalendar` keeps its own month loop (display logic; its `absMonth` use could later route through `broadcastMonthStartByOrdinal`, but the win is marginal and the string output is risk-sensitive).
</content>
</invoke>
