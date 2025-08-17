@echo off
setlocal ENABLEDELAYEDEXPANSION

rem ================================================================
rem Scholar-Flow Setup Script (Windows)
rem Provides a comprehensive bootstrap: dependency install, env files,
rem Prisma client + TypedSQL generation, optional migrations, build.
rem
rem Flags:
rem   --skip-build       Skip Turbo build step
rem   --migrate          Run prisma migrate dev automatically
rem   --no-migrate       Do NOT run or prompt for migrations
rem   --no-prisma        Skip prisma generate (not recommended)
rem   --non-interactive  Assume defaults; no pauses/prompts
rem   --force-env        Overwrite existing env files (creates backups)
rem ================================================================

echo ==========================================
echo      Scholar-Flow Setup Script (Windows)
echo ==========================================
echo.

rem -------------------- Parse Arguments --------------------
set SKIP_BUILD=0
set AUTO_MIGRATE=0
set NO_MIGRATE=0
set SKIP_PRISMA=0
set NON_INTERACTIVE=0
set FORCE_ENV=0

for %%A in (%*) do (
    if /I "%%~A"=="--skip-build" set SKIP_BUILD=1
    if /I "%%~A"=="--migrate" set AUTO_MIGRATE=1
    if /I "%%~A"=="--no-migrate" set NO_MIGRATE=1
    if /I "%%~A"=="--no-prisma" set SKIP_PRISMA=1
    if /I "%%~A"=="--non-interactive" set NON_INTERACTIVE=1
    if /I "%%~A"=="--force-env" set FORCE_ENV=1
)

if %AUTO_MIGRATE%==1 if %NO_MIGRATE%==1 (
    echo Cannot specify both --migrate and --no-migrate
    exit /b 1
)

rem -------------------- Pre-flight Checks --------------------
echo [1/8] Checking prerequisites...
where node >nul 2>&1 || ( echo Error: Node.js not found in PATH & exit /b 1 )
where yarn >nul 2>&1 || ( echo Error: Yarn not found in PATH (install Corepack enabled Yarn 4) & exit /b 1 )
where git >nul 2>&1 || echo Warning: Git not found (some scripts may rely on it)

for /f "tokens=1* delims=v" %%v in ('node -v') do set NODE_VER=%%w
for /f "tokens=1-3 delims=." %%a in ("%NODE_VER%") do (
    set NODE_MAJOR=%%a
)
if NOT DEFINED NODE_MAJOR (
    echo Warning: Could not parse Node version
) else (
    if !NODE_MAJOR! LSS 20 (
        echo Error: Node.js v20+ required (found %NODE_VER%)
        exit /b 1
    )
)

rem Confirm we are at repo root by checking for root package.json name
if NOT EXIST "package.json" (
    echo Error: package.json not found. Run from repository root.
    exit /b 1
)

findstr /C:"\"name\": \"scholar-flow\"" package.json >nul 2>&1 || (
    echo Warning: package.json name mismatch (continuing)
)

rem -------------------- Dependencies --------------------
echo.
echo [2/8] Installing dependencies with Yarn (Berry)...
call yarn install --immutable
if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies (yarn install)
        if %NON_INTERACTIVE%==0 pause
        exit /b 1
)

rem -------------------- Environment Files --------------------
echo.
echo [3/8] Setting up environment files...

call :HandleEnv "apps\backend" ".env" "apps\backend\.env.example" "BACKEND"
if errorlevel 1 exit /b 1
call :HandleEnv "apps\frontend" ".env.local" "apps\frontend\.env.example" "FRONTEND"
if errorlevel 1 exit /b 1

rem -------------------- Prisma Generate (Client + TypedSQL) --------------------
if %SKIP_PRISMA%==1 (
    echo.
    echo [4/8] Skipping Prisma generate (--no-prisma)
) else (
    echo.
    echo [4/8] Generating Prisma client (with TypedSQL)...
    call yarn db:generate
    if %errorlevel% neq 0 (
        echo Warning: Root db:generate script failed, attempting direct fallback...
        pushd apps\backend >nul
        call npx prisma generate --sql
        if %errorlevel% neq 0 (
            echo Warning: Prisma generate still failed. Ensure DATABASE_URL is valid.
        )
        popd >nul
    )
)

rem -------------------- Optional Migrations --------------------
set RUN_MIGRATIONS=0
if %NO_MIGRATE%==1 (
    set RUN_MIGRATIONS=0
) else if %AUTO_MIGRATE%==1 (
    set RUN_MIGRATIONS=1
) else if %NON_INTERACTIVE%==1 (
    set RUN_MIGRATIONS=0
) else (
    echo.
    echo [5/8] Run database migrations now? (y/N):
    set /p RUNMIG=
    if /I "!RUNMIG!"=="Y" set RUN_MIGRATIONS=1
)

if %RUN_MIGRATIONS%==1 (
    echo Running prisma migrate dev...
    pushd apps\backend >nul
    call npx prisma migrate dev
    if %errorlevel% neq 0 (
        echo Warning: Migrations failed. You can retry manually: yarn db:migrate
    )
    popd >nul
) else (
    echo Skipping migrations.
)

rem -------------------- Build (optional) --------------------
if %SKIP_BUILD%==1 (
    echo.
    echo [6/8] Skipping build (--skip-build)
) else (
    echo.
    echo [6/8] Building project with Turbo (may take a moment)...
    call yarn build
    if %errorlevel% neq 0 (
        echo Warning: Build failed. Review errors before proceeding.
    )
)

rem -------------------- Smoke Test (Prisma) --------------------
echo.
echo [7/8] Optional Prisma smoke test (checks basic connectivity)...
if %NON_INTERACTIVE%==1 (
    echo   Skipped (non-interactive mode)
) else (
    set /p RUNSMOKE=Run quick Prisma smoke test? (y/N): 
    if /I "!RUNSMOKE!"=="Y" (
        node scripts\prismaSmokeTest.cjs 2>nul
        if !errorlevel! neq 0 (
            echo   Smoke test failed (non-fatal). Check DB or environment.
        ) else (
            echo   Smoke test passed.
        )
    )
)

rem -------------------- Summary --------------------
echo.
echo [8/8] Setup complete!
echo.
echo Summary:
echo  - Env files: backend(.env), frontend(.env.local)
echo  - Prisma client: %SKIP_PRISMA%==1? Skipped : Generated (check warnings above)
echo  - Migrations run: %RUN_MIGRATIONS%
echo  - Build executed: %SKIP_BUILD%==0? Yes : No
echo.
echo Next steps:
echo   1. Start dev servers: yarn dev
echo   2. (If not run) Apply migrations later: yarn db:migrate
echo   3. Open http://localhost:3000 (frontend) and backend on http://localhost:5000
echo   4. Review SCHEMA.md and prisma/sql for data model & typed queries
echo.
if %NON_INTERACTIVE%==0 pause
exit /b 0

rem -------------------- Helper Functions --------------------
:HandleEnv
rem %1=dir %2=filename %3=examplePath %4=TAG
set TARGET_DIR=%~1
set TARGET_FILE=%~2
set EXAMPLE=%~3
set TAG=%~4
set FULL=%TARGET_DIR%\%TARGET_FILE%

if EXIST "%FULL%" (
    if %FORCE_ENV%==1 (
        call :BackupEnv "%FULL%"
    ) else (
        echo %TAG% env already exists: %FULL%
        goto :EOF
    )
)

if EXIST "%EXAMPLE%" (
    copy "%EXAMPLE%" "%FULL%" >nul
    echo %TAG% env created from example (%TARGET_FILE%)
) else (
    echo Creating basic %TAG% env (%TARGET_FILE%)
    if /I "%TAG%"=="BACKEND" (
        (
            echo NODE_ENV=development
            echo PORT=5000
            echo DATABASE_URL=postgresql://username:password@localhost:5432/scholar_flow
            echo DIRECT_DATABASE_URL=postgresql://superuser:password@localhost:5432/postgres
            echo NEXTAUTH_SECRET=your-nextauth-secret-key
            echo EXPIRES_IN=1d
            echo REFRESH_TOKEN_SECRET=your-refresh-token-secret
            echo REFRESH_TOKEN_EXPIRES_IN=7d
            echo FRONTEND_URL=http://localhost:3000
            echo USE_PGVECTOR=true
        ) > "%FULL%"
    ) else (
        (
            echo NEXTAUTH_SECRET=your-nextauth-secret-key
            echo NEXTAUTH_URL=http://localhost:3000
            echo NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
            echo DATABASE_URL=postgresql://username:password@localhost:5432/scholar_flow
        ) > "%FULL%"
    )
    echo %TAG% env created with defaults
)
goto :EOF

:BackupEnv
set SRC=%~1
set N=1
set BAK=%SRC%.bak
if EXIST "%BAK%" (
    :FindBak
    set BAK=%SRC%.bak%N%
    if EXIST "%BAK%" (
        set /a N+=1
        goto :FindBak
    )
)
copy "%SRC%" "%BAK%" >nul
echo Backed up existing env to %BAK%
goto :EOF
