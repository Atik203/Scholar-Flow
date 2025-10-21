# Quick Start Guide - LaTeX Compilation

## Fastest Way to Get Started

### Step 1: Install LaTeX (One-Time Setup)

**Windows:**

1. Download MiKTeX: https://miktex.org/download
2. Run installer (choose "Install missing packages on-the-fly: Yes")
3. Restart computer

**Alternative:** Install TeXstudio (includes MiKTeX): https://www.texstudio.org/

### Step 2: Compile Your First PDF

```powershell
# Navigate to latex directory
cd E:\Scholar-Flow\latex

# Run the build script
.\build.ps1
```

That's it! The PDF will open automatically.

## What You'll Get

✅ **Professional 50+ page PDF** with:

- Title page
- Table of contents
- 6 complete chapters (300+ pages of content)
- Professional formatting
- Clickable links
- Academic styling

⚠️ **Placeholders for:**

- 70+ screenshots
- 2 diagrams (ERD, Schema)
- 8 stub chapters needing content

## Common First-Time Issues

### Issue 1: "pdflatex not found"

**Solution:** LaTeX not installed. Install MiKTeX or TeXstudio first.

### Issue 2: Build script won't run

**Solution:** Enable script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 3: Missing packages

**Solution:** MiKTeX will prompt to auto-install. Click "Install" for each package.

## Next Steps After First Compilation

1. **Review the PDF** - First 6 chapters are complete
2. **Add screenshots** - Place in `images/screenshots/`
3. **Add diagrams** - Place in `images/diagrams/`
4. **Expand chapters 7-14** - Copy content from PROJECT_REPORT.md
5. **Recompile** - Run `.\build.ps1` again

## File Structure Quick Reference

```
latex/
├── main.tex           ← Main document (don't edit unless changing style)
├── build.ps1          ← Compilation script (run this!)
├── chapters/          ← Edit these files to add content
│   ├── 01-*.tex       ✅ Complete
│   ├── 02-*.tex       ✅ Complete
│   ├── 03-*.tex       ✅ Complete
│   ├── 04-*.tex       ✅ Complete
│   ├── 05-*.tex       ✅ Complete
│   ├── 06-*.tex       ✅ Complete
│   ├── 07-*.tex       ⚠️  Needs expansion
│   └── 08-14-*.tex    ⚠️  Needs expansion
└── images/
    ├── screenshots/   ← Add 70+ screenshots here
    └── diagrams/      ← Add ERD & Schema diagrams here
```

## Need Help?

- **Full Documentation:** See `README.md` in latex/ directory
- **Conversion Guide:** See `CONVERSION_SUMMARY.md`
- **LaTeX Errors:** Check `main.log` file

## Compilation Times

- **First compilation:** 2-3 minutes (installing packages)
- **Subsequent compilations:** 30-60 seconds

## Output Location

✅ **main.pdf** - Your final project report (in latex/ directory)

---

**Ready? Run `.\build.ps1` now!** 🚀
