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

out="$("$HERE/build-and-serve.sh" "${BUILD_ARGS[@]+"${BUILD_ARGS[@]}"}")"
rc=$?
if [ $rc -ne 0 ]; then
  echo "$out"
  echo "[lp] build or server step failed (exit $rc): nothing was walked" >&2
  exit $rc
fi
base="${out#LP_BASE_URL=}"
echo "[lp] walking $base"

node "$HERE/walkthrough.mjs" --base-url "$base" "${WALK_ARGS[@]+"${WALK_ARGS[@]}"}"
walk_rc=$?

"$HERE/build-and-serve.sh" --stop >/dev/null 2>&1
echo
cat "$HERE/out/report.txt" | tail -3
exit $walk_rc
