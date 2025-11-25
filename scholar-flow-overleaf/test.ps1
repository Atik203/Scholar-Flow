# TEST COMPILATION - Run This First!

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ScholarFlow LaTeX - Quick Test" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Testing if LaTeX is installed..." -ForegroundColor Yellow
try {
    $pdflatexVersion = pdflatex --version 2>&1 | Select-Object -First 1
    Write-Host "  ✓ LaTeX found: $pdflatexVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ LaTeX NOT found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MiKTeX or TeXLive first:" -ForegroundColor Yellow
    Write-Host "  Windows: https://miktex.org/download" -ForegroundColor White
    Write-Host "  Or use Overleaf (online): https://www.overleaf.com/" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Testing if main.tex exists..." -ForegroundColor Yellow
if (Test-Path "main.tex") {
    Write-Host "  ✓ main.tex found" -ForegroundColor Green
} else {
    Write-Host "  ✗ main.tex NOT found!" -ForegroundColor Red
    Write-Host "  Please run this script from E:\Scholar-Flow\latex directory" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Checking chapter files..." -ForegroundColor Yellow
$chapterCount = (Get-ChildItem -Path "chapters" -Filter "*.tex").Count
Write-Host "  ✓ Found $chapterCount chapter files" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All checks passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready to compile! Run:" -ForegroundColor Yellow
Write-Host "  .\build.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or compile manually:" -ForegroundColor Yellow
Write-Host "  pdflatex main.tex" -ForegroundColor White
Write-Host "  bibtex main" -ForegroundColor White
Write-Host "  pdflatex main.tex" -ForegroundColor White
Write-Host "  pdflatex main.tex" -ForegroundColor White
Write-Host ""
