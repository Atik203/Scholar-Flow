# Software Requirements Specification (SRS) - ScholarFlow

## Overview

This folder contains the comprehensive Software Requirements Specification (SRS) document for the ScholarFlow platform, following IEEE Std 830-1998 guidelines and incorporating real survey data from 29 academic researchers.

## Document Structure

### Chapter 1: Introduction (`01-introduction.tex`)

- **1.1 Purpose**: Document objectives and intended audience
- **1.2 Project Scope**: Product perspective, features, target demographics, operating environment, constraints
- **1.3 Definitions, Acronyms, Abbreviations**: Complete terminology reference
- **1.4 References**: Technical documentation and survey sources
- **1.5 Overview of Document**: Chapter-by-chapter guide

**Key Highlights:**

- System architecture diagram with TikZ
- Technology stack table (Next.js 15, PostgreSQL, AWS S3, AI services)
- Target user demographics (86.2% undergraduates, 75.9% ages 22-25)
- Design constraints (performance, security, regulatory, resource, technical)

---

### Chapter 2: System Study & Information Gathering (`02-system-study.tex`)

- **2.1 Survey Methodology**: Design, structure, data collection (29 responses, 21 questions)
- **2.2 Demographic Analysis**: Role, field, academic level, age, university distribution
- **2.3 Current Tool Landscape**: Existing tools, satisfaction (3.31/5), pain points
- **2.4 Market Validation**: Need assessment (72.4%), product interest (58.6%), adoption likelihood

**Key Survey Findings:**

- 86.2% undergraduate students (primary target)
- 67%+ Computer Science/IT (tech-savvy adopters)
- 47.4% UIU concentration (pilot campus opportunity)
- 79.3% use Google Drive (fragmented workflows)
- 37.9% cite "lack of proper tools" as #1 pain point
- 82.7% want AI summarization (killer feature)

**Includes 12 Survey Chart Images:**

1. Role distribution (response_image/1.png)
2. Field of study (response_image/2.png)
3. Academic level (response_image/3.png)
4. Age distribution (response_image/4.png)
5. University distribution (response_image/5.png)
6. Current tools used (response_image/6.png)
7. Satisfaction levels (response_image/7.png)
8. Pain points (response_image/8.png)
9. Collaboration frequency (response_image/9.png)
10. Market need (response_image/10.png)
11. Product interest (response_image/11.png)
12. Adoption likelihood (response_image/12.png)

---

### Chapter 3: System Analysis (`03-system-analysis.tex`)

- **3.1 Feature Demand Analysis**: AI features, collaboration, analytics, citations, comparisons
- **3.2 Feature Prioritization Matrix**: P0 (Critical MVP), P1 (Enhancement), P2 (Phase 2)
- **3.3 Feasibility Analysis**: Technical, economic, operational assessments
- **3.4 SWOT Analysis**: Detailed strengths, weaknesses, opportunities, threats
- **3.5 Competitive Analysis**: ScholarFlow vs. Zotero vs. Mendeley vs. Notion
- **3.6 Strategic Recommendations**: Phase 1 UIU pilot, Phase 2 expansion, risk mitigation

**Key Feature Demand:**

- AI Summarization: 82.7% high interest (P0 - Critical)
- Real-Time Collaboration: 62.1% (P0 - Critical)
- Role-Based Access: 62.1% (P0 - Critical)
- Citation Export: 65.5% (P1 - Enhancement)
- AI Recommendations: 69.0% (P1 - Phase 2)
- Paper Comparison: 65.5% (P2 - Future)

**Includes 9 Feature Demand Charts:** 13. AI summarization (response_image/13.png) 14. AI recommendations (response_image/14.png) 15. Collaboration (response_image/15.png) 16. RBAC (response_image/16.png) 17. Personal analytics (response_image/17.png) 18. Progress tracking (response_image/18.png) 19. Citations (response_image/19.png) 20. Comparison (response_image/20.png) 21. Willingness to pay (response_image/21.png)

**Feasibility Results:**

- **Technical**: HIGHLY FEASIBLE (proven tech stack, low-risk integrations)
- **Economic**: FEASIBLE (freemium model, 58.6% willing to pay, break-even at 10-15 users)
- **Operational**: FEASIBLE WITH CONSTRAINTS (4-person team, UIU pilot focus)

**SWOT Summary:**

- **Strengths**: Deep user insight, 102 Figma screens, technical maturity, 82.7% AI demand
- **Weaknesses**: Zero brand awareness, resource constraints, privacy concerns
- **Opportunities**: Underserved market (37.9% lack tools), low switching costs (100% free tools)
- **Threats**: Google Drive 79.3%, Notion 37.9%, price sensitivity (41.4%)

---

## Survey Data Integration

All survey charts are referenced from `../response_image/` folder (21 PNG files):

- Demographics: 1.png - 5.png
- Current landscape: 6.png - 9.png
- Market validation: 10.png - 12.png
- Feature demand: 13.png - 20.png
- Willingness to pay: 21.png

Charts are embedded using:

```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.8\textwidth]{../response_image/X.png}
    \caption{Chart Description (n=29)}
    \label{fig:chart-name}
\end{figure}
```

---

## Document Formatting

### LaTeX Packages Used

- **tikz, pgfplots**: System architecture diagrams
- **tabularx, booktabs, longtable**: Feature matrices and comparison tables
- **tcolorbox**: Highlighted value propositions and strategic insights
- **graphicx**: Survey chart embeddings
- **hyperref**: Cross-references and external links

### Color Scheme

- **primaryblue**: RGB(59, 130, 246) - Headings, diagrams, tables
- **secondarygreen**: RGB(16, 185, 129) - Success indicators
- **accentorange**: RGB(251, 146, 60) - Warnings, priorities
- **lightgray**: RGB(243, 244, 246) - Table backgrounds
- **codebg**: RGB(248, 250, 252) - Code snippets

### Custom Commands

- `\projectname`: **ScholarFlow**
- `\version`: v1.1.9
- `\feature{name}`: Bold feature names
- `\tech{name}`: Typewriter tech terms
- `\code{snippet}`: Inline code highlighting

---

## Compilation Instructions

### Prerequisites

```bash
# Install TeX Live (Windows/Linux) or MacTeX (macOS)
# Ensure pdflatex, bibtex, and required packages are installed
```

### Build Process

#### Option 1: Build SRS Only

```powershell
# From scholar-flow-overleaf directory
.\build-srs.ps1
```

#### Option 2: Build Project Report Only

```powershell
# From scholar-flow-overleaf directory
.\build.ps1
```

#### Option 3: Build Both Documents

```powershell
# From scholar-flow-overleaf directory
.\build-all.ps1
```

#### Manual Compilation (SRS)

```powershell
cd scholar-flow-overleaf
pdflatex srs-main.tex
pdflatex srs-main.tex  # Second pass for cross-references
pdflatex srs-main.tex  # Third pass for list of figures/tables
```

### Output

- **SRS PDF**: `srs-main.pdf` (Software Requirements Specification - Chapters 1-3)
- **Report PDF**: `main.pdf` (Project Implementation Report - Chapters 4-14)
- **Both documents are now separate and independent**

---

## Data Sources

### Survey

- **Platform**: Google Forms
- **Period**: November - December 2025
- **Responses**: 29 academic researchers
- **Universities**: 10 (UIU 47.4%, NSU, AIUB, BRAC, DU, etc.)
- **Questions**: 21 (5 demographics + 10 feature priorities + 6 adoption)

### External References

1. IEEE Std 830-1998 (SRS standard)
2. Next.js 15 Documentation
3. PostgreSQL 14 Documentation
4. Prisma ORM Documentation
5. AWS S3 Developer Guide
6. Google Gemini API
7. OpenAI API Reference
8. Stripe API Documentation
9. ScholarFlow Feasibility Presentation (FEASIBILITY_PRESENTATION.md)
10. ScholarFlow GitHub Repository

---

## Quality Assurance

### Validation Checklist

- ✅ All 21 survey charts properly embedded with captions
- ✅ Tables use consistent formatting (tabularx, booktabs)
- ✅ TikZ diagrams compile without errors
- ✅ Cross-references resolve correctly (\ref, \label)
- ✅ Hyperlinks functional (URLs, GitHub, survey data)
- ✅ Color scheme consistent across chapters
- ✅ IEEE 830-1998 structure followed
- ✅ Technical terminology defined in Chapter 1.3
- ✅ Strategic recommendations actionable and data-driven

### Peer Review Notes

- Ensure `response_image/` folder is accessible from LaTeX compiler path
- If charts don't render, verify relative path: `../response_image/X.png`
- For large-scale printing, consider increasing figure widths from 0.8 to 0.9 textwidth
- SWOT analysis tables may need landscape orientation (`\begin{landscape}...\end{landscape}`) for printing

---

## Maintenance

### Adding New Chapters

1. Create `SRS/0X-chapter-name.tex`
2. Add `\input{SRS/0X-chapter-name}` in `srs-main.tex`
3. Update this README with chapter summary

### Updating Survey Data

1. Replace PNG files in `response_image/` folder
2. Update captions in relevant `.tex` files (02-system-study, 03-system-analysis)
3. Recompile document to refresh embeddings

### Version History

- **v1.0** (Dec 8, 2025): Initial SRS chapters 1-3 based on 29-response survey
- **v1.1** (Dec 8, 2025): Fixed revenue model table, separated SRS from Project Report into independent documents
- **Future**: Add chapters 4-6 (System Design, Implementation, Testing)

---

## Contact & Support

**Project Leader**: Md. Atikur Rahaman  
**GitHub**: [@Atik203](https://github.com/Atik203)  
**Repository**: [Scholar-Flow](https://github.com/Atik203/Scholar-Flow)  
**Team**: Phantom Devs (4 members)  
**Course**: Database Management System Lab, Section I  
**University**: United International University (UIU)

For questions about SRS content, survey methodology, or data interpretation, refer to `figma-make/FEASIBILITY_PRESENTATION.md` or contact the project team.

---

**Last Updated**: December 8, 2025  
**Document Status**: Chapters 1-3 Complete ✅ | Chapters 4-10 Pending  
**Next Steps**: System Design (ERD, Database Schema, API Specifications)
