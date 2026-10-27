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

# One id for this run's build, its server and its --stop, so build-and-serve.sh
# keeps its pid and snapshot under .run/$LP_RUN_ID and cannot reach into a walk
# another agent is in the middle of. See the header of build-and-serve.sh.
export LP_RUN_ID="${LP_RUN_ID:-$$}"

# run.sh takes /tmp/lp-build.lock itself, around the build only. Wrapping the
# whole script in `flock /tmp/lp-build.lock scripts/lp/run.sh` therefore
# self-deadlocks: the inner flock waits for a lock its own parent is holding
# and will not release until the script it is waiting for returns. The pair sit
# there for the full timeout and starve every other agent's build, which is
# what happened at 07:30 on 27 Oct. Detect an ancestor holding the lock and
# switch to a private one: the outer flock is already serialising us, so the
# inner lock has nothing left to do.
lock_held_by_ancestor() {
  local target pid
  target="$(readlink -f "${LP_BUILD_LOCK:-/tmp/lp-build.lock}" 2>/dev/null)" || return 1
  [ -n "$target" ] || return 1
  pid=$PPID
  while [ -n "$pid" ] && [ "$pid" -gt 1 ] 2>/dev/null; do
    local fd
    for fd in /proc/$pid/fd/*; do
      [ "$(readlink -f "$fd" 2>/dev/null)" = "$target" ] && return 0
    done
    pid="$(awk '{print $4}' "/proc/$pid/stat" 2>/dev/null)" || return 1
  done
  return 1
}
if lock_held_by_ancestor; then
  echo "[lp] a parent process already holds ${LP_BUILD_LOCK:-/tmp/lp-build.lock}." >&2
  echo "[lp] run.sh locks the build itself, so do not wrap it in flock. Using a private lock for this run." >&2
  export LP_BUILD_LOCK="/tmp/lp-build-nested-$LP_RUN_ID.lock"
fi

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

# A dozen agents write this checkout while we build, so a step that fails on a
# file someone is part way through saving is routine and clears on its own
# within a minute or two. Retry a failed typecheck or build twice before calling
# it a break, and keep the first error so a real one is still reported with its
# own text. A genuine break fails all three attempts and costs 2 extra minutes;
# a mid-write one no longer costs the heartbeat its whole walk.
#
# Typecheck (10) is retried as well as build (11). On 27 Oct a sweep caught two
# red files at once: ATM_A2_MED_0008.tsx, broken for 45 minutes and genuine, and
# ATM_A2_RDG_0006.tsx, mid-write and clean again two minutes later. Only one
# deserved a ticket, and the run has to be able to tell them apart on its own.
attempts="${LP_BUILD_ATTEMPTS:-3}"
rc=0
# Last heartbeat's copies would otherwise read as this one's evidence.
rm -f "$HERE/out/typecheck-first-failure.log" "$HERE/out/build-first-failure.log"
for try in $(seq 1 "$attempts"); do
  out="$("$HERE/build-and-serve.sh" "${BUILD_ARGS[@]+"${BUILD_ARGS[@]}"}")"
  rc=$?
  [ $rc -eq 0 ] && break
  if { [ $rc -ne 10 ] && [ $rc -ne 11 ]; } || [ "$try" -ge "$attempts" ]; then break; fi
  if [ "$try" = "1" ]; then
    [ $rc -eq 10 ] && cp "$HERE/out/typecheck.log" "$HERE/out/typecheck-first-failure.log" 2>/dev/null
    [ $rc -eq 11 ] && cp "$HERE/out/build.log" "$HERE/out/build-first-failure.log" 2>/dev/null
  fi
  step=build; [ $rc -eq 10 ] && step=typecheck
  echo "[lp] $step attempt $try failed; a file may be mid-write, retrying in 60s" >&2
  sleep 60
done
if [ $rc -ne 0 ]; then
  echo "$out"
  echo "[lp] typecheck, build or server step failed (exit $rc) after $attempts attempt(s): nothing was walked" >&2
  # The diff between the first and the last failure is the whole point: errors
  # in both are a real break and belong on a ticket, errors only in the first
  # were somebody mid-save and belong nowhere.
  for s in typecheck build; do
    [ -f "$HERE/out/$s-first-failure.log" ] &&
      echo "[lp] $s first failure: $HERE/out/$s-first-failure.log, last: $HERE/out/$s.log" >&2
  done
  exit $rc
fi
if [ "${try:-1}" != "1" ]; then
  echo "[lp] passed on attempt $try (the earlier failure was a mid-write file, see out/*-first-failure.log)" >&2
fi
base="${out#LP_BASE_URL=}"
echo "[lp] walking $base"

node "$HERE/walkthrough.mjs" --base-url "$base" "${WALK_ARGS[@]+"${WALK_ARGS[@]}"}"
walk_rc=$?

"$HERE/build-and-serve.sh" --stop >/dev/null 2>&1
echo
cat "$HERE/out/report.txt" | tail -3
exit $walk_rc
