# ScholarFlow LaTeX Project Report

## Overview

This directory contains the complete LaTeX source files for the ScholarFlow Project Report. The report is structured as a professional academic document with proper formatting, styling, and organization.

## Directory Structure

```
latex/
├── main.tex                    # Main LaTeX document with all packages and configuration
├── chapters/                   # Individual chapter files
│   ├── 01-group-details.tex
│   ├── 02-video-demo.tex
│   ├── 03-introduction.tex
│   ├── 04-motivation.tex
│   ├── 05-similar-projects.tex
│   ├── 06-benchmark-analysis.tex
│   ├── 07-feature-list.tex
│   ├── 08-erd.tex
│   ├── 09-database-schema.tex
│   ├── 10-sql-queries.tex
│   ├── 11-screenshots.tex
│   ├── 12-limitations.tex
│   ├── 13-future-work.tex
│   └── 14-conclusion.tex
├── appendices/                 # Appendix files
│   ├── a-tech-stack.tex
│   ├── b-api-endpoints.tex
│   └── c-environment-vars.tex
├── images/                     # All images and figures
│   ├── screenshots/
│   ├── diagrams/
│   └── logos/
├── references.bib              # Bibliography file
└── README.md                   # This file
```

## Prerequisites

### Required Software

1. **TeX Distribution:**
   - **Windows:** MiKTeX (https://miktex.org/) or TeX Live
   - **macOS:** MacTeX (https://www.tug.org/mactex/)
   - **Linux:** TeX Live (`sudo apt-get install texlive-full`)

2. **LaTeX Editor (Choose one):**
   - **TeXstudio** (Recommended for beginners): https://www.texstudio.org/
   - **Overleaf** (Online, no installation): https://www.overleaf.com/
   - **VS Code** with LaTeX Workshop extension
   - **TeXmaker**: https://www.xm1math.net/texmaker/

### Required LaTeX Packages

All packages are automatically installed by MiKTeX/TeX Live if missing. Key packages used:

- `geometry` - Page layout
- `graphicx` - Images and figures
- `hyperref` - Hyperlinks and PDF metadata
- `xcolor` - Custom colors
- `fancyhdr` - Headers and footers
- `titlesec` - Section styling
- `tocloft` - Table of contents styling
- `listings` - Code listings
- `tcolorbox` - Custom boxes
- `tikz` - Diagrams and graphics
- `pgfplots` - Charts and plots
- `booktabs` - Professional tables
- `fontawesome5` - Icons

## Compilation Instructions

### Method 1: Using TeXstudio (Recommended)

1. Open TeXstudio
2. Open `main.tex`
3. Click **Tools → Build & View** (or press F5)
4. The PDF will be generated and automatically opened

### Method 2: Using Command Line

#### Windows (PowerShell)

```powershell
cd E:\Scholar-Flow\latex
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

#### Linux/macOS

```bash
cd /path/to/Scholar-Flow/latex
pdflatex main.tex
bibtex main.tex
pdflatex main.tex
pdflatex main.tex
```

**Note:** Run `pdflatex` three times to ensure all references, table of contents, and cross-references are correctly resolved.

### Method 3: Using Overleaf (Online)

1. Go to https://www.overleaf.com/
2. Create a new blank project
3. Upload all files from the `latex/` directory
4. Set `main.tex` as the main document
5. Click **Recompile**

### Method 4: Using VS Code

1. Install the **LaTeX Workshop** extension
2. Open the `latex/` folder in VS Code
3. Open `main.tex`
4. Press `Ctrl+Alt+B` (Windows/Linux) or `Cmd+Option+B` (macOS)
5. The PDF will be generated and previewed

## Before Compilation Checklist

### Required Actions

- [ ] **Add Student IDs** in `chapters/01-group-details.tex`
- [ ] **Upload YouTube Video** and insert link in `chapters/02-video-demo.tex`
- [ ] **Add ERD Diagram** screenshot to `images/diagrams/erd-diagram.png`
- [ ] **Add Schema Diagram** screenshot to `images/diagrams/schema-diagram.png`
- [ ] **Add Application Screenshots** (70+ images) to `images/screenshots/`
- [ ] **Add Team Member Photos** (optional) to `images/team/`
- [ ] **Update Contact Information** if needed

### Placeholder Locations

Search for `[PLACEHOLDER` in all files to find locations requiring updates:

```powershell
# Windows PowerShell
Get-ChildItem -Recurse -Include *.tex | Select-String -Pattern "\[PLACEHOLDER"

# Linux/macOS
grep -r "\[PLACEHOLDER" *.tex chapters/*.tex appendices/*.tex
```

## Customization

### Changing Colors

Edit color definitions in `main.tex` (lines 45-51):

```latex
\definecolor{primaryblue}{RGB}{59, 130, 246}
\definecolor{secondarygreen}{RGB}{16, 185, 129}
\definecolor{accentorange}{RGB}{251, 146, 60}
```

### Changing Fonts

Add font package in `main.tex`:

```latex
\usepackage{lmodern}  % Latin Modern (default)
% or
\usepackage{times}    % Times New Roman
% or
\usepackage{helvet}   % Helvetica
```

### Adding Chapters

1. Create new file in `chapters/` (e.g., `15-new-chapter.tex`)
2. Add `\input{chapters/15-new-chapter}` in `main.tex`

## Troubleshooting

### Common Issues

#### 1. Missing Packages Error

```
! LaTeX Error: File `package-name.sty' not found.
```

**Solution:** Install missing package:

- **MiKTeX:** Will prompt to auto-install
- **TeX Live:** `tlmgr install package-name`

#### 2. Image Not Found

```
! LaTeX Error: File `image.png' not found.
```

**Solution:**

- Verify image exists in `images/` directory
- Use forward slashes in paths: `images/screenshots/login.png`
- Check file extension (PNG, JPG, PDF)

#### 3. Bibliography Not Compiling

**Solution:** Run in this exact order:

```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

#### 4. Table of Contents Not Updating

**Solution:** Delete auxiliary files and recompile:

```powershell
Remove-Item *.aux, *.toc, *.lof, *.lot, *.out
pdflatex main.tex
```

#### 5. Unicode Characters Not Rendering

**Solution:** Use XeLaTeX or LuaLaTeX instead of pdfLaTeX:

```bash
xelatex main.tex
```

### Compilation Errors

If you encounter errors:

1. **Read the error message** - line number indicates the issue
2. **Check for missing braces** - `{` must match `}`
3. **Verify all files exist** - especially in `\input{}` and `\includegraphics{}`
4. **Delete auxiliary files** - sometimes `.aux` files get corrupted
5. **Compile multiple times** - references need 2-3 passes to resolve

## Output Files

After successful compilation:

- **main.pdf** - Final project report (primary deliverable)
- **main.aux** - Auxiliary file (can be deleted)
- **main.log** - Compilation log (useful for debugging)
- **main.toc** - Table of contents data
- **main.lof** - List of figures data
- **main.lot** - List of tables data
- **main.out** - Hyperlink data

## File Size Optimization

To reduce PDF size:

1. **Compress images** before adding:

   ```bash
   # Using ImageMagick
   mogrify -resize 1920x1080 -quality 85 images/screenshots/*.png
   ```

2. **Use `pdflatex` with compression**:

   ```bash
   pdflatex -output-format=pdf14 main.tex
   ```

3. **Use Ghostscript** to compress final PDF:
   ```bash
   gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
      -dNOPAUSE -dQUIET -dBATCH -sOutputFile=main-compressed.pdf main.pdf
   ```

## Export Options

### Export to Word (DOCX)

```bash
# Using Pandoc
pandoc main.tex -o PROJECT_REPORT.docx
```

### Export to HTML

```bash
# Using TeX4ht
htlatex main.tex
```

### Export to Markdown

```bash
# Using Pandoc
pandoc main.tex -o PROJECT_REPORT.md
```

## Quality Checklist

Before final submission:

- [ ] All placeholders replaced with actual content
- [ ] All images added and properly referenced
- [ ] Table of contents accurate
- [ ] List of figures complete
- [ ] List of tables complete
- [ ] No compilation warnings or errors
- [ ] All hyperlinks functional
- [ ] Page numbers correct
- [ ] Bibliography properly formatted
- [ ] Spelling and grammar checked
- [ ] Consistent formatting throughout
- [ ] PDF metadata correct (title, author)

## Project Statistics

Run this to get document statistics:

```bash
# Word count (approximate)
texcount main.tex

# Page count
pdfinfo main.pdf | grep Pages

# Table count
grep -c "\\begin{table}" chapters/*.tex

# Figure count
grep -c "\\begin{figure}" chapters/*.tex
```

## Support and Resources

### LaTeX Documentation

- LaTeX Wikibook: https://en.wikibooks.org/wiki/LaTeX
- Overleaf Documentation: https://www.overleaf.com/learn
- TeX Stack Exchange: https://tex.stackexchange.com/

### Package Documentation

- CTAN (Package Repository): https://ctan.org/
- TikZ Manual: https://tikz.dev/
- Listings Manual: `texdoc listings`

### Color Schemes

- Coolors: https://coolors.co/
- Adobe Color: https://color.adobe.com/

## Contact

For questions or issues with the LaTeX compilation:

- **GitHub:** https://github.com/Atik203/Scholar-Flow
- **Email:** [INSERT_EMAIL]

## License

This LaTeX project is part of the ScholarFlow repository and follows the same license.

---

**Last Updated:** October 22, 2025  
**Version:** 1.1.9  
**Author:** Md. Atikur Rahaman
