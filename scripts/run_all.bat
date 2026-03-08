@echo off
REM =============================================================================
REM scripts\run_all.bat — HDFC Xpress BizFinance E2E Test Runner (Windows)
REM Usage:
REM   run_all.bat              -> run all suites on UAT
REM   run_all.bat sit          -> run all suites on SIT
REM   run_all.bat uat login    -> run only login tests
REM   run_all.bat uat modules  -> run module tests
REM   run_all.bat uat journey  -> run journey tests
REM =============================================================================
setlocal enabledelayedexpansion

set "ENV=%~1"
if "%ENV%"=="" set "ENV=uat"

set "SUITE=%~2"
if "%SUITE%"=="" set "SUITE=all"

set "ENV_FILE=.env.%ENV%"
set "PASS=0"
set "FAIL=0"

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  HDFC Xpress BizFinance — Playwright E2E Runner          ║
echo ╚══════════════════════════════════════════════════════════╝
echo   Environment : %ENV%  (%ENV_FILE%)
echo   Suite       : %SUITE%
echo.

if not exist "%ENV_FILE%" (
    echo ERROR: %ENV_FILE% not found. Create it from .env.uat template.
    exit /b 1
)

set "PW=node --env-file %ENV_FILE% node_modules\.bin\playwright test"

REM ── Helper: run a suite ──────────────────────────────────────────────────────
:run_login
if "%SUITE%"=="login" goto :do_login
if "%SUITE%"=="all"   goto :do_login
goto :run_modules

:do_login
echo ──────────────────────────────────────────────────────────
echo   Running: Login and OTP Tests
echo ──────────────────────────────────────────────────────────
%PW% tests\login.spec.js --reporter=html
if %ERRORLEVEL%==0 (
    echo   OK  Login Tests PASSED
    set /a PASS+=1
) else (
    echo   FAIL Login Tests FAILED
    set /a FAIL+=1
)
echo.

:run_modules
if "%SUITE%"=="modules" goto :do_modules
if "%SUITE%"=="all"     goto :do_modules
goto :run_journey

:do_modules
echo ──────────────────────────────────────────────────────────
echo   Running: Module Tests
echo ──────────────────────────────────────────────────────────
%PW% tests\modules\ --reporter=html
if %ERRORLEVEL%==0 (
    echo   OK  Module Tests PASSED
    set /a PASS+=1
) else (
    echo   FAIL Module Tests FAILED
    set /a FAIL+=1
)
echo.

:run_journey
if "%SUITE%"=="journey" goto :do_journey
if "%SUITE%"=="all"     goto :do_journey
goto :summary

:do_journey
echo ──────────────────────────────────────────────────────────
echo   Running: Full Journey Tests
echo ──────────────────────────────────────────────────────────
%PW% tests\journey.spec.js --reporter=html
if %ERRORLEVEL%==0 (
    echo   OK  Journey Tests PASSED
    set /a PASS+=1
) else (
    echo   FAIL Journey Tests FAILED
    set /a FAIL+=1
)
echo.

:summary
echo ╔══════════════════════════════════════════════════════════╗
echo ║  SUMMARY: %PASS% passed  ^|  %FAIL% failed
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo   HTML Report : playwright-report\index.html
echo   Open with   : npx playwright show-report
echo.

if %FAIL%==0 ( exit /b 0 ) else ( exit /b 1 )
