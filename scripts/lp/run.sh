#!/usr/bin/env bash
# One command for the heartbeat: typecheck, build under the lock, serve a
# snapshot, walk the app in light and dark, write the report, stop the server.
#
#   scripts/lp/run.sh              full run
#   scripts/lp/run.sh --no-build   reuse the snapshot already served
#   scripts/lp/run.sh --themes light
#
# Exit: 0 all screens pass, 1 at least one screen failed, 10 typecheck broke,
# 11 the build broke, 12-14 the server would not come up.

set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
cd "$REPO"

BUILD_ARGS=()
WALK_ARGS=()
while [ $# -gt 0 ]; do
  case "$1" in
    --no-build) BUILD_ARGS+=(--no-build); shift ;;
    --port) BUILD_ARGS+=(--port "$2"); shift 2 ;;
    --themes) WALK_ARGS+=(--themes "$2"); shift 2 ;;
    --keep) WALK_ARGS+=(--keep); shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

# A dozen agents write this checkout while we build, so a build that fails on a
# file someone is part way through saving is routine and clears on its own
# within a minute or two. Retry a failed build twice before calling it a break,
# and keep the first error so a real one is still reported with its own text.
# A genuine break fails all three attempts and costs 2 extra minutes; a
# mid-write one no longer costs the heartbeat its whole walk.
attempts="${LP_BUILD_ATTEMPTS:-3}"
rc=0
for try in $(seq 1 "$attempts"); do
  out="$("$HERE/build-and-serve.sh" "${BUILD_ARGS[@]+"${BUILD_ARGS[@]}"}")"
  rc=$?
  [ $rc -eq 0 ] && break
  if [ $rc -ne 11 ] || [ "$try" -ge "$attempts" ]; then break; fi
  [ "$try" = "1" ] && cp "$HERE/out/build.log" "$HERE/out/build-first-failure.log" 2>/dev/null
  echo "[lp] build attempt $try failed; a file may be mid-write, retrying in 60s" >&2
  sleep 60
done
if [ $rc -ne 0 ]; then
  echo "$out"
  echo "[lp] build or server step failed (exit $rc) after $attempts attempt(s): nothing was walked" >&2
  echo "[lp] first failure: $HERE/out/build-first-failure.log, last: $HERE/out/build.log" >&2
  exit $rc
fi
if [ "${try:-1}" != "1" ]; then
  echo "[lp] build passed on attempt $try (the earlier failure was a mid-write file, see out/build-first-failure.log)" >&2
fi
base="${out#LP_BASE_URL=}"
echo "[lp] walking $base"

node "$HERE/walkthrough.mjs" --base-url "$base" "${WALK_ARGS[@]+"${WALK_ARGS[@]}"}"
walk_rc=$?

"$HERE/build-and-serve.sh" --stop >/dev/null 2>&1
echo
cat "$HERE/out/report.txt" | tail -3
exit $walk_rc
