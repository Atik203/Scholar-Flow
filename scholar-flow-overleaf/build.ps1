# ScholarFlow LaTeX Compilation Script
# Automates the full compilation process

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ScholarFlow LaTeX Compilation Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the latex directory
if (-not (Test-Path "main.tex")) {
    Write-Host "ERROR: main.tex not found. Please run this script from the latex/ directory." -ForegroundColor Red
    exit 1
}

Write-Host "[1/7] Cleaning auxiliary files..." -ForegroundColor Yellow
Remove-Item -Path "*.aux", "*.log", "*.toc", "*.lof", "*.lot", "*.out", "*.bbl", "*.blg" -ErrorAction SilentlyContinue
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[2/7] First pdflatex run..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode main.tex | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: pdflatex failed. Check main.log for details." -ForegroundColor Red
    exit 1
}
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[3/7] Running bibtex..." -ForegroundColor Yellow
bibtex main | Out-Null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[4/7] Second pdflatex run..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode main.tex | Out-Null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[5/7] Third pdflatex run (final)..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode main.tex | Out-Null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[6/7] Checking for errors..." -ForegroundColor Yellow
if (Select-String -Path "main.log" -Pattern "^!" -Quiet) {
    Write-Host "  WARNINGS: Compilation completed with errors. Check main.log" -ForegroundColor Red
} else {
    Write-Host "  No errors detected!" -ForegroundColor Green
}

Write-Host "[7/7] Opening PDF..." -ForegroundColor Yellow
if (Test-Path "main.pdf") {
    Start-Process "main.pdf"
    Write-Host "  Done!" -ForegroundColor Green
} else {
    Write-Host "  ERROR: main.pdf was not generated!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Compilation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Output: main.pdf" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review main.pdf" -ForegroundColor White
Write-Host "  2. Add missing screenshots to images/screenshots/" -ForegroundColor White
Write-Host "  3. Update placeholders in chapter files" -ForegroundColor White
Write-Host "  4. Recompile with: .\build.ps1" -ForegroundColor White
