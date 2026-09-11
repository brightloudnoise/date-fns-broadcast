#!/usr/bin/env bash
# Refuses a release unless CI's `ci` check passed on the exact commit being
# released.
#
# release-it runs locally and pushes the release commit straight to main,
# through the ruleset's admin bypass. So the ruleset stops nothing here, and
# without this a release could ship a commit CI never saw, or saw fail. `ci` is
# the aggregate job, so passing it means every timezone and Node leg passed.
set -euo pipefail

sha=$(git rev-parse HEAD)

# The latest run wins: a re-run adds a check run rather than replacing one.
if ! state=$(gh api "repos/{owner}/{repo}/commits/$sha/check-runs?check_name=ci" \
  --jq '.check_runs | sort_by(.started_at) | last
        | if . == null then "missing" else .status + ":" + (.conclusion // "") end'); then
  # GitHub answers 422 for a commit it has never seen, so this is almost
  # always an unpushed HEAD; gh's own message above says if it was auth.
  echo "Could not read CI for $sha. Push it and let CI finish before releasing." >&2
  exit 1
fi

case "$state" in
  completed:success)
    echo "ci passed on $sha"
    ;;
  missing)
    echo "No ci run for $sha. Push it and let CI finish before releasing." >&2
    exit 1
    ;;
  completed:*)
    echo "ci finished as '${state#completed:}' on $sha. Not releasing." >&2
    exit 1
    ;;
  *)
    echo "ci is still ${state%%:*} on $sha. Wait for it to finish." >&2
    exit 1
    ;;
esac
