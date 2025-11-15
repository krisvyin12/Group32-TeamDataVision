# **Road Safety Enforcement Dashboard – Malaysia 2023**  
*COS30045 Data Visualisation Project – Stand-Up 3 & Final Submission*  
**Team 32** | Swinburne University of Technology  

---

## Team Members
| Name | Student ID |
|------|------------|
| **Krisvyin Selvaraja** | 
| **Kugendran Magesvaran** |
| **Ivan Jeremy Joseph** | 

**Tutorial**: [Day & Time]  
**Semester**: S1 2025  
**Submission Date**: Week 13

---

## Project Overview

This interactive dashboard visualises **road safety enforcement data in Malaysia (2023)**, focusing on:
- Fines issued by **state**
- Offence types (**speeding, mobile phone, seatbelt, etc.**)
- **Breath alcohol tests** and positive results
- Age group analysis

**Goal**: Help policymakers, researchers, and the public understand enforcement patterns and identify high-risk areas.

**Live Website**:  
[http://mercury.swin.edu.au/cos30045-s1-2025/103456789/](http://mercury.swin.edu.au/cos30045-s1-2025/103456789/) *(replace with your ID)*

---

## Visualisations (D3.js)

| # | Type | Description | Interactivity |
|---|------|-------------|---------------|
| 1 | **Animated Bar Chart** | Top 10 states by total fines | Filter by offence, play/pause animation |
| 2 | **Choropleth Map** *(in progress)* | Fines per capita by state | Hover tooltip, click to drill down |
| 3 | **Stacked Bar Chart** | Fines by age group × offence | Filter by state |

> All visualisations use **D3.v7**, responsive design, and accessibility features.

---

## Data Sources

| File | Source | Records | Key Fields |
|------|--------|--------|-----------|
| `fines_states.csv` | JPJ Malaysia (2023) | ~1.2M | state, offence, fine_amount, date |
| `fines_age.csv` | JPJ + MyCensus | ~900K | age_group, offence, count |
| `breath_test.csv` | PDRM Road Safety Division | ~450K | state, tests_conducted, positive |

**Data Governance**:
- Public domain (no PII)
- Cleaned in **KNIME**: removed duplicates, imputed missing age (median), normalized fines
- KNIME workflow: `/knime/road_safety_workflow.knwf`

---

## Technical Stack

- **Frontend**: HTML, CSS, D3.js (v7)
- **Data Processing**: KNIME Analytics Platform
- **Version Control**: Git + GitHub
- **Hosting**: Swinburne Mercury Server
- **IDE**: Visual Studio Code

---

## Folder Structure

```
/
├── index.html              ← Main page
├── main.js                 ← D3 visualisations + interactions
├── style.css               ← Responsive styling
├── data/
│   ├── fines_states.csv
│   ├── fines_age.csv
│   └── breath_test.csv
├── knime/
│   └── road_safety_workflow.knwf
├── design-book-draft.pdf   ← Project documentation
└── README.md               ← This file
```

---

## How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/krisvyin12/Group32-TeamDataVision.git
   ```
2. Open `index.html` in a browser (or use Live Server in VS Code)

> No build tools required — pure HTML/JS.

---

## Interactivity Features

- **Filter Panel**: Select offence type → real-time chart update
- **Animation Controls**: Play/Pause bar chart race
- **Tooltips**: Hover to see exact values
- **Responsive**: Works on mobile, tablet, desktop
- **Accessibility**: ARIA labels, colorblind-safe palette

---

## Design Principles Applied

| Principle | Implementation |
|---------|----------------|
| **Graphical Integrity** | Accurate scales, no truncated axes |
| **Data-Ink Ratio** | Minimal chart junk |
| **Color Use** | ColorBrewer (colorblind safe) |
| **Responsiveness** | Flexbox + media queries |

---

## Usability Testing (Planned – Week 13)

- 5 users (think-aloud protocol)
- Tasks: “Find state with highest mobile phone fines”, “Compare age groups”
- Tools: Google Forms + screen recording

---

## AI Declaration (Academic Integrity)

> **GenAI was used ethically and transparently.**

**Tools Used**:
- **ChatGPT / Grok**: Clarify D3 syntax, debug `enter/update/exit`, suggest KNIME nodes
- **Grammarly**: Proofread README and Design Book

**Not Used For**:
- Writing D3 code from scratch
- Generating visualisations
- Data analysis decisions

All code, design, and analysis were **reviewed, modified, and understood** by the team.

---

## Next Steps (Future Improvements)

- [ ] Add **choropleth map** with GeoJSON
- [ ] Year-over-year comparison slider
- [ ] Export chart as PNG
- [ ] Deploy with GitHub Pages backup

---

## References

- D3.js Documentation: https://d3js.org
- BITRE Road Safety Dashboard (inspiration)
- Tufte, E. (2001). *The Visual Display of Quantitative Information*
- KNIME Community Hub

---

**GitHub**: https://github.com/krisvyin12/Group32-TeamDataVision  
**Design Book**: `design-book-draft.pdf`

---

> **"Turning enforcement data into actionable insights."**  
> *Team 32 – DataVision
