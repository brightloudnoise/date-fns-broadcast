# Changelog

# [1.3.0](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.2.2...v1.3.0) (2026-09-06)

### Bug Fixes

* derive quarters from months, and year membership from its boundaries ([b73d8ce](https://github.com/brightloudnoise/date-fns-broadcast/commit/b73d8ce297c79161b910ca7d08b7ec15852aaaa9))

### BREAKING CHANGES

* quarter boundaries move for the affected quarters, and dates in
  the four boundary years change broadcast year. Consumers pinning quarter starts
  should re-derive them.

## [1.2.2](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.2.1...v1.2.2) (2026-09-05)

### Bug Fixes

* keep the caller's time zone through every date-keyed function ([e5b7f7f](https://github.com/brightloudnoise/date-fns-broadcast/commit/e5b7f7f26e18f8a476e6739bea1aa07f411219ab))

## [1.2.1](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.2.0...v1.2.1) (2026-09-05)


### Bug Fixes

* resolve the broadcast month that contains a date ([b46dda8](https://github.com/brightloudnoise/date-fns-broadcast/commit/b46dda838e90dfa107ef6eb1a0fc7b1163f86895))

# [1.2.0](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.1.1...v1.2.0) (2026-07-06)


### Features

* configurable broadcast year start month ([b36c385](https://github.com/brightloudnoise/date-fns-broadcast/commit/b36c3856925780a81de9b4f6bf07ec72fe5841c7))

## [1.1.1](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.1.0...v1.1.1) (2026-03-13)

# [1.1.0](https://github.com/brightloudnoise/date-fns-broadcast/compare/v1.0.3...v1.1.0) (2026-03-13)


### Features

* add countBroadcastWeeksInYear and countBroadcastWeeksInMonth ([c1265d8](https://github.com/brightloudnoise/date-fns-broadcast/commit/c1265d83ee681b81bd939760589675b09d7e94b2))
* add enumeration functions for broadcast periods ([dc65a5e](https://github.com/brightloudnoise/date-fns-broadcast/commit/dc65a5e01b9fb507e23bb8ba4d43bfe123cfceab))

## [1.0.3](https://github.com/brightloudnoise/date-fns-broadcast/compare/v.1.0.1...v1.0.3) (2026-03-12)
