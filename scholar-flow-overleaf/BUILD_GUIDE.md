# ScholarFlow LaTeX Documents - Quick Start Guide

## 📁 Document Structure

This folder contains **TWO SEPARATE DOCUMENTS**:

### 1. Software Requirements Specification (SRS)

- **Source**: `srs-main.tex`
- **Output**: `srs-main.pdf`
- **Content**: Survey-based requirements analysis (Chapters 1-3)
- **Pages**: ~40-50 pages with 21 survey charts

### 2. Project Implementation Report

- **Source**: `main.tex`
- **Output**: `main.pdf`
- **Content**: Technical implementation details (Chapters 4-14)
- **Pages**: ~60-80 pages with code, ERD, screenshots

---

## 🚀 Quick Build Commands

### Build Everything (Recommended)

```powershell
.\build-all.ps1
```

This will compile both documents and show a summary.

### Build SRS Only

```powershell
.\build-srs.ps1
```

Generates: `srs-main.pdf`

### Build Project Report Only

```powershell
.\build.ps1
```

Generates: `main.pdf`

---

## 📊 What's Included

### SRS Document (`srs-main.pdf`)

✅ **Chapter 1: Introduction**

- Purpose, scope, target demographics
- Technology stack and constraints
- Definitions and references

✅ **Chapter 2: System Study & Information Gathering**

- Survey methodology (29 responses, 21 questions)
- Demographics: 86.2% undergrads, 67%+ CS/IT, 47.4% UIU
- Current tools: Google Drive 79.3%, Notion 37.9%, Zotero 27.6%
- Market validation: 72.4% need, 58.6% interest, 3.31/5 satisfaction
- **12 survey charts** (demographics, tools, pain points, market demand)

✅ **Chapter 3: System Analysis**

- Feature demand: AI summarization 82.7%, collaboration 62.1%, citations 65.5%
- **9 feature demand charts** (AI, collaboration, analytics, willingness to pay)
- Feasibility: Technical (HIGHLY FEASIBLE), Economic (FEASIBLE), Operational (FEASIBLE)
- SWOT Analysis: 6 strengths, 6 weaknesses, 7 opportunities, 7 threats
- Competitive analysis: ScholarFlow vs Zotero vs Mendeley vs Notion
- Strategic recommendations: Phase 1 UIU pilot, Phase 2 multi-campus expansion

### Project Report (`main.pdf`)

✅ Chapters 4-14: Introduction, Motivation, Similar Projects, Benchmarks, Features, ERD, Database Schema, SQL Queries, Screenshots, Limitations, Future Work, Conclusion

---

## 🔧 Requirements

### Software Needed

- **TeX Distribution**: TeX Live (Windows/Linux) or MacTeX (macOS)
- **Compiler**: pdflatex (included in TeX distributions)
- **PowerShell**: For build scripts (Windows 10+ has this built-in)

### LaTeX Packages Used

- geometry, graphicx, hyperref, xcolor, fancyhdr, tikz, pgfplots
- booktabs, longtable, tabularx, tcolorbox, enumitem
- All standard packages included in full TeX Live installation

### External Dependencies

- **Survey Charts**: 21 PNG files in `../response_image/` folder (1.png - 21.png)
- **Logo**: `images/logos/logo.png`
- **Screenshots**: `images/screenshots/` (for Project Report only)

---

## 🐛 Troubleshooting

### Charts Not Showing

```
Problem: Survey charts (response_image/*.png) not rendering
Solution: Verify path ../response_image/X.png is accessible from SRS/ folder
```

### Table Layout Issues

```
Problem: Revenue model table overflowing page width
Solution: Fixed in v1.1 - using fixed-width columns with \small font
```

### Missing References

```
Problem: ?? appearing in cross-references
Solution: Run pdflatex THREE times (build scripts do this automatically)
```

### Compilation Errors

```
Problem: pdflatex fails with errors
Solution: Check *.log file for details, ensure all packages installed
```

---

## 📝 File Organization

```
scholar-flow-overleaf/
├── srs-main.tex          # SRS main document
├── main.tex              # Project Report main document
├── build-srs.ps1         # Build SRS only
├── build.ps1             # Build Report only
├── build-all.ps1         # Build both documents
├── BUILD_GUIDE.md        # This file
│
├── SRS/                  # SRS chapters
│   ├── 01-introduction.tex
│   ├── 02-system-study.tex
│   ├── 03-system-analysis.tex
│   └── README.md         # Detailed SRS documentation
│
├── chapters/             # Project Report chapters
│   ├── 03-introduction.tex
│   ├── 04-motivation.tex
│   ├── ... (10 more chapters)
│   └── 14-conclusion.tex
│
├── images/
│   ├── logos/logo.png
│   ├── screenshots/      # For Project Report
│   └── diagrams/         # For Project Report
│
└── ../response_image/    # Survey charts (21 PNGs)
    ├── 1.png - 5.png     # Demographics
    ├── 6.png - 9.png     # Current landscape
    ├── 10.png - 12.png   # Market validation
    └── 13.png - 21.png   # Feature demand
```

---

## ✅ Quality Checklist

Before submitting, verify:

- [ ] Both PDFs compile without errors
- [ ] All 21 survey charts visible in SRS
- [ ] Tables fit within page margins
- [ ] Cross-references resolve (no ?? marks)
- [ ] List of Figures/Tables generated
- [ ] Hyperlinks work (GitHub, URLs)
- [ ] Page numbers sequential
- [ ] No orphan/widow lines

---

## 🎓 Document Standards

### SRS Document

- **Standard**: IEEE Std 830-1998
- **Structure**: Introduction → System Study → System Analysis
- **Focus**: Requirements gathering, market validation, feasibility
- **Audience**: Stakeholders, reviewers, project planners

### Project Report

- **Standard**: Academic lab report format
- **Structure**: Motivation → Design → Implementation → Results
- **Focus**: Technical implementation, database design, testing
- **Audience**: Course instructor, technical evaluators

---

## 📞 Support

**Project Leader**: Md. Atikur Rahaman  
**GitHub**: [@Atik203](https://github.com/Atik203)  
**Repository**: [Scholar-Flow](https://github.com/Atik203/Scholar-Flow)  
**Team**: Phantom Devs (4 members)  
**Course**: Database Management System Lab, Section I  
**University**: United International University (UIU)

For issues with:

- **SRS Content**: See `SRS/README.md`
- **Build Scripts**: Check PowerShell execution policy (`Set-ExecutionPolicy RemoteSigned`)
- **LaTeX Errors**: Review `*.log` files in this directory
- **Survey Data**: Verify `../response_image/` folder contains all 21 PNGs

---

**Last Updated**: December 8, 2025  
**Version**: 1.1  
**Status**: SRS Complete ✅ | Project Report In Progress 🚧

---

## 🚀 First Time Setup

```powershell
# 1. Navigate to the LaTeX folder
cd e:\PROJECT\Scholar-Flow\scholar-flow-overleaf

# 2. Verify files exist
dir srs-main.tex, main.tex

# 3. Check survey images
dir ..\response_image\*.png | Measure-Object
# Should show 21 files

# 4. Build everything
.\build-all.ps1

# 5. Check outputs
dir *.pdf
# Should show: srs-main.pdf and main.pdf
```

**That's it! Your documents are ready for submission.** 🎉
