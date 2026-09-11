# CI runs the suite in three machine time zones, against data in two

CI runs the tests with `TZ` set to UTC, America/Toronto and Australia/Sydney, and `_zonePreservation.test.ts` runs every case for both Sydney and Toronto data. The defect this library has shipped twice (v1.2.0, v1.2.1) is a date-keyed function that builds a boundary on the machine's clock, or returns a plain `Date` for a `TZDate`. It only shows when the machine's zone differs from the data's, and a runner is always UTC. But more machine zones alone do not fix that: whichever machine zone matches the test's data zone can barely see the bug. Running the current zone test against the released sources, failures out of 30 per data zone:

| release | machine zone | Sydney data | Toronto data |
|---------|--------------|-------------|--------------|
| 1.2.0   | UTC          | 19          | 19           |
| 1.2.0   | Toronto      | 19          | 9            |
| 1.2.0   | Sydney       | 9           | 19           |
| 1.2.1   | UTC          | 22          | 22           |
| 1.2.1   | Toronto      | 22          | 10           |
| 1.2.1   | Sydney       | 10          | 22           |

With Sydney data only, the Sydney machine zone saw 9–10 failures. Two data zones on opposite sides of UTC, with opposite DST phases, give every machine zone one to disagree with. UTC is the runner default, Toronto is the development machine, and Sydney is east of UTC with southern-hemisphere DST. The matrix also runs Node 22 next to 24, because TZDate resolves zones through the Intl data that ships with Node. A separate job installs date-fns 4.0.0, because `peerDependencies` promises `>=4.0.0` while the lockfile pins a later 4.x. The only required check is the aggregate `ci` job, so matrix legs can change without editing the ruleset, and `pnpm release` refuses a commit whose `ci` did not pass.
