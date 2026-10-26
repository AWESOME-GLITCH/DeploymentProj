#!/usr/bin/env bash
# Build the Learning Path app and serve it for the walkthrough.
#
# Several agents share this checkout, so two things matter here:
#   1. the build runs under /tmp/lp-build.lock, never on its own;
#   2. the server is given a hardlink snapshot of .next, not .next itself.
# Without (2) the next agent's build replaces the chunks under a running
# server and every page load dies with ChunkLoadError part way through a
# walkthrough. The snapshot is taken inside the same lock as the build, so it
# can never catch a half-written .next either.
#
# Usage:  scripts/lp/build-and-serve.sh [--port N] [--no-build] [--stop]
# Prints: the base URL on stdout as "LP_BASE_URL=http://127.0.0.1:<port>"

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$REPO/scripts/lp/out"
RUN="$REPO/scripts/lp/.run"
LOCK="${LP_BUILD_LOCK:-/tmp/lp-build.lock}"
LOCK_WAIT="${LP_LOCK_WAIT:-900}"
PORT="${LP_PORT:-0}"
DO_BUILD=1

while [ $# -gt 0 ]; do
  case "$1" in
    --port) PORT="$2"; shift 2 ;;
    --no-build) DO_BUILD=0; shift ;;
    --stop) STOP=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

mkdir -p "$OUT" "$RUN"

stop_server() {
  # Only ever kill the server this script started. Other agents' next-server
  # processes are left alone: a blanket pkill takes their work down with it.
  if [ -f "$RUN/server.pid" ]; then
    local pid; pid="$(cat "$RUN/server.pid")"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      pkill -P "$pid" 2>/dev/null
      kill "$pid" 2>/dev/null
      sleep 1
      kill -9 "$pid" 2>/dev/null
    fi
    rm -f "$RUN/server.pid"
  fi
  if [ -f "$RUN/snapshot.path" ]; then
    local snap; snap="$(cat "$RUN/snapshot.path")"
    case "$snap" in /tmp/lp-snapshot-*) rm -rf "$snap" ;; esac
    rm -f "$RUN/snapshot.path"
  fi
}

if [ "${STOP:-0}" = "1" ]; then stop_server; echo "stopped"; exit 0; fi

free_port() {
  local p
  for p in $(seq "${1:-3131}" "${2:-3160}"); do
    if ! (exec 3<>"/dev/tcp/127.0.0.1/$p") 2>/dev/null; then echo "$p"; return 0; fi
    exec 3<&- 2>/dev/null
  done
  return 1
}

# ---------------------------------------------------------------- typecheck
if [ "$DO_BUILD" = "1" ]; then
  echo "[lp] typecheck" >&2
  if ! npx tsc --noEmit >"$OUT/typecheck.log" 2>&1; then
    echo "[lp] TYPECHECK FAILED, see $OUT/typecheck.log" >&2
    tail -30 "$OUT/typecheck.log" >&2
    exit 10
  fi
  : >"$OUT/typecheck.log"

  # ------------------------------------------------------ build and snapshot
  SNAP="/tmp/lp-snapshot-$$"
  echo "[lp] build under $LOCK (waiting up to ${LOCK_WAIT}s)" >&2
  flock -w "$LOCK_WAIT" "$LOCK" -c "
    set -e
    cd '$REPO'
    CI=1 npx next build
    rm -rf '$SNAP'
    mkdir -p '$SNAP'
    cp -al '$REPO/.next' '$SNAP/.next'
  " >"$OUT/build.log" 2>&1
  rc=$?
  if [ $rc -ne 0 ]; then
    echo "[lp] BUILD FAILED (exit $rc), see $OUT/build.log" >&2
    tail -40 "$OUT/build.log" >&2
    rm -rf "$SNAP"
    exit 11
  fi

  cp "$REPO/package.json" "$SNAP/"
  [ -f "$REPO/next.config.js" ] && cp "$REPO/next.config.js" "$SNAP/"
  [ -d "$REPO/public" ] && cp -al "$REPO/public" "$SNAP/public"
  ln -sfn "$REPO/node_modules" "$SNAP/node_modules"
  echo "$SNAP" >"$RUN/snapshot.path"
  echo "[lp] snapshot at $SNAP" >&2
fi

# -------------------------------------------------------------------- serve
stop_server
SNAP="$(cat "$RUN/snapshot.path" 2>/dev/null)"
if [ -z "$SNAP" ] || [ ! -d "$SNAP/.next" ]; then
  echo "[lp] no snapshot to serve; run without --no-build" >&2
  exit 12
fi

if [ "$PORT" = "0" ]; then
  PORT="$(free_port 3131 3160)" || { echo "[lp] no free port in 3131-3160" >&2; exit 13; }
fi

echo "[lp] next start -p $PORT from the snapshot" >&2
( cd "$SNAP" && exec npx next start -p "$PORT" ) >"$OUT/server.log" 2>&1 &
echo $! >"$RUN/server.pid"

for _ in $(seq 1 60); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/learning-path" 2>/dev/null)"
  [ "$code" = "200" ] && { echo "LP_BASE_URL=http://127.0.0.1:$PORT"; exit 0; }
  sleep 1
done

echo "[lp] server did not answer on $PORT, see $OUT/server.log" >&2
tail -20 "$OUT/server.log" >&2
exit 14
