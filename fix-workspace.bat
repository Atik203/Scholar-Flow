@echo off
echo Cleaning up workspace...

REM Remove existing lockfile and node_modules
del yarn.lock 2>nul
rmdir /s /q node_modules 2>nul

REM Remove app-specific node_modules
rmdir /s /q apps\backend\node_modules 2>nul
rmdir /s /q apps\frontend\node_modules 2>nul

echo Installing dependencies...
yarn install

echo Setup complete!
pause
