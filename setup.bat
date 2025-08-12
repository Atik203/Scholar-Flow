@echo off
echo ==========================================
echo      Scholar-Flow Setup Script (Windows)
echo ==========================================
echo.

echo [1/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/5] Setting up environment files...

if not exist "apps\backend\.env" (
    if exist "apps\backend\.env.example" (
        copy "apps\backend\.env.example" "apps\backend\.env"
        echo Backend .env file created from example
    ) else (
        echo Creating basic backend .env file...
        (
            echo NODE_ENV=development
            echo PORT=5000
            echo DATABASE_URL=postgresql://username:password@localhost:5432/scholar_flow
            echo JWT_SECRET=your-super-secret-jwt-key-here
            echo EXPIRES_IN=1d
            echo REFRESH_TOKEN_SECRET=your-refresh-token-secret
            echo REFRESH_TOKEN_EXPIRES_IN=7d
            echo FRONTEND_URL=http://localhost:3000
        ) > "apps\backend\.env"
        echo Basic backend .env file created
    )
)

if not exist "apps\frontend\.env.local" (
    if exist "apps\frontend\.env.example" (
        copy "apps\frontend\.env.example" "apps\frontend\.env.local"
        echo Frontend .env.local file created from example
    ) else (
        echo Creating basic frontend .env.local file...
        (
            echo NEXTAUTH_SECRET=your-nextauth-secret-key
            echo NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
            echo DATABASE_URL=postgresql://username:password@localhost:5432/scholar_flow
        ) > "apps\frontend\.env.local"
        echo Basic frontend .env.local file created
    )
)

echo.
echo [3/5] Generating Prisma client...
cd apps\backend
call npx prisma generate
if %errorlevel% neq 0 (
    echo Warning: Prisma generate failed. Make sure your database is configured.
)
cd ..\..

echo.
echo [4/5] Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Warning: Build failed. Check for any configuration issues.
)

echo.
echo [5/5] Setup complete!
echo.
echo Next steps:
echo 1. Configure your database connection in apps\backend\.env
echo 2. Run database migrations: npm run db:migrate
echo 3. Start development servers: npm run dev
echo.
echo For more details, see DEVELOPMENT.md
echo.
pause
