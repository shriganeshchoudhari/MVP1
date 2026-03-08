#!/usr/bin/env bash
# =============================================================================
# scripts/run_all.sh — HDFC Xpress BizFinance E2E Test Runner
# Usage:
#   ./scripts/run_all.sh              → run all suites on UAT
#   ./scripts/run_all.sh sit          → run all suites on SIT
#   ./scripts/run_all.sh uat login    → run only login tests on UAT
#   ./scripts/run_all.sh uat modules  → run module tests on UAT
#   ./scripts/run_all.sh uat journey  → run journey tests on UAT
# =============================================================================
set -euo pipefail

ENV="${1:-uat}"
SUITE="${2:-all}"
ENV_FILE=".env.${ENV}"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found. Create it from .env.uat template."
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  HDFC Xpress BizFinance — Playwright E2E Runner          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo "  Environment : $ENV  ($ENV_FILE)"
echo "  Suite       : $SUITE"
echo "  Date        : $(date)"
echo ""

PW="node --env-file $ENV_FILE node_modules/.bin/playwright test"
PASS=0
FAIL=0

run_suite() {
    local name="$1"
    local spec="$2"
    echo "──────────────────────────────────────────────────────────"
    echo "  Running: $name"
    echo "──────────────────────────────────────────────────────────"
    if $PW "$spec" --reporter=html; then
        echo "  ✅  $name PASSED"
        PASS=$((PASS + 1))
    else
        echo "  ❌  $name FAILED"
        FAIL=$((FAIL + 1))
    fi
    echo ""
}

case "$SUITE" in
    login)
        run_suite "Login & OTP Tests"   "tests/login.spec.js"
        ;;
    modules)
        run_suite "Module Tests"        "tests/modules/"
        ;;
    journey)
        run_suite "Full Journey Tests"  "tests/journey.spec.js"
        ;;
    all|*)
        run_suite "Login & OTP Tests"   "tests/login.spec.js"
        run_suite "Module Tests"        "tests/modules/"
        run_suite "Full Journey Tests"  "tests/journey.spec.js"
        ;;
esac

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  SUMMARY: $PASS passed  |  $FAIL failed                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  HTML Report: playwright-report/index.html"
echo "  Open with : npx playwright show-report"
echo ""

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
