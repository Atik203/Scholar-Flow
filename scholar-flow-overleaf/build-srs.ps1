# ScholarFlow SRS LaTeX Compilation Script
# Compiles the Software Requirements Specification document

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "ScholarFlow SRS Compilation Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "srs-main.tex")) {
    Write-Host "ERROR: srs-main.tex not found. Please run this script from the scholar-flow-overleaf/ directory." -ForegroundColor Red
    exit 1
}

Write-Host "[1/6] Cleaning auxiliary files..." -ForegroundColor Yellow
Remove-Item -Path "srs-main.aux", "srs-main.log", "srs-main.toc", "srs-main.lof", "srs-main.lot", "srs-main.out" -ErrorAction SilentlyContinue
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[2/6] First pdflatex run..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode srs-main.tex | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: pdflatex failed. Check srs-main.log for details." -ForegroundColor Red
    exit 1
}
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[3/6] Second pdflatex run (for references)..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode srs-main.tex | Out-Null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[4/6] Third pdflatex run (final)..." -ForegroundColor Yellow
pdflatex -interaction=nonstopmode srs-main.tex | Out-Null
Write-Host "  Done!" -ForegroundColor Green

Write-Host "[5/6] Checking for errors..." -ForegroundColor Yellow
if (Select-String -Path "srs-main.log" -Pattern "^!" -Quiet) {
    Write-Host "  WARNINGS: Compilation completed with errors. Check srs-main.log" -ForegroundColor Yellow
} else {
    Write-Host "  No errors detected!" -ForegroundColor Green
}

Write-Host "[6/6] Opening PDF..." -ForegroundColor Yellow
if (Test-Path "srs-main.pdf") {
    Start-Process "srs-main.pdf"
    Write-Host "  Done!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCCESS! SRS PDF generated: srs-main.pdf" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
} else {
    Write-Host "  ERROR: PDF not generated!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Cleaning auxiliary files..." -ForegroundColor Yellow
Remove-Item -Path "srs-main.aux", "srs-main.log", "srs-main.toc", "srs-main.lof", "srs-main.lot", "srs-main.out" -ErrorAction SilentlyContinue
Write-Host "Done! Auxiliary files cleaned." -ForegroundColor Green
