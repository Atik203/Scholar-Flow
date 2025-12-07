# ScholarFlow - Build All Documents
# Compiles both SRS and Project Report

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "ScholarFlow - Build All Documents" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$documents = @(
    @{Name="Software Requirements Specification (SRS)"; File="srs-main.tex"; Output="srs-main.pdf"},
    @{Name="Project Implementation Report"; File="main.tex"; Output="main.pdf"}
)

foreach ($doc in $documents) {
    Write-Host "Building: $($doc.Name)" -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Yellow
    
    if (-not (Test-Path $doc.File)) {
        Write-Host "ERROR: $($doc.File) not found!" -ForegroundColor Red
        continue
    }
    
    # Clean auxiliary files
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($doc.File)
    Remove-Item -Path "$baseName.aux", "$baseName.log", "$baseName.toc", "$baseName.lof", "$baseName.lot", "$baseName.out" -ErrorAction SilentlyContinue
    
    # Run pdflatex three times
    for ($i = 1; $i -le 3; $i++) {
        Write-Host "  Pass $i/3..." -NoNewline
        pdflatex -interaction=nonstopmode $doc.File | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host " ERROR!" -ForegroundColor Red
            Write-Host "  Check $baseName.log for details." -ForegroundColor Red
            break
        }
        Write-Host " Done!" -ForegroundColor Green
    }
    
    # Check result
    if (Test-Path $doc.Output) {
        Write-Host "  SUCCESS: $($doc.Output) generated!" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $($doc.Output) not generated!" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Generated Documents:" -ForegroundColor Green
foreach ($doc in $documents) {
    if (Test-Path $doc.Output) {
        $size = (Get-Item $doc.Output).Length / 1MB
        Write-Host "  ✓ $($doc.Output) ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($doc.Output) (FAILED)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Cleaning auxiliary files..." -ForegroundColor Yellow
Remove-Item -Path "*.aux", "*.log", "*.toc", "*.lof", "*.lot", "*.out", "*.bbl", "*.blg" -ErrorAction SilentlyContinue
Write-Host "Done!" -ForegroundColor Green

# Ask to open PDFs
Write-Host ""
$open = Read-Host "Open generated PDFs? (Y/N)"
if ($open -eq "Y" -or $open -eq "y") {
    foreach ($doc in $documents) {
        if (Test-Path $doc.Output) {
            Start-Process $doc.Output
        }
    }
}
