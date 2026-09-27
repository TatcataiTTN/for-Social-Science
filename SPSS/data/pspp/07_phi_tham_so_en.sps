* ============================================================
* Module 07 -- Chi-square & Non-parametric Tests
* Data: lop_hoc_240.sav (240 students, simulated data)
* NOTE: value labels for gender/method stay in Vietnamese -- see 03 file.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Chi-square: gender x teaching method (2x2 table) ---
CROSSTABS TABLES=gender BY method
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT.
* Expected: read the "Continuity Correction" (Yates-corrected) row:
* chi2(1)=1.37, p=0.243 -> not significant.

* --- 2. Chi-square: gender x school (2x3 table) ---
CROSSTABS TABLES=gender BY school
  /STATISTICS=CHISQ CC
  /CELLS=COUNT.
* Expected: chi2(2)=0.14, p=0.932, Cramer's V~0.024 -> not significant.

* --- 3. Mann-Whitney U: h1 rating by gender ---
NPAR TESTS
  /M-W=h1 BY gender('Nam','Nữ')
  /MISSING ANALYSIS.
* Expected: U=6416, p=0.127 -> not significant.

* --- 4. Wilcoxon: comparing 2 rating items a1 and a2 (same students) ---
NPAR TESTS
  /WILCOXON=a1 WITH a2
  /MISSING ANALYSIS.
* Expected: p=0.920 -> no difference at all (mean a1=2.908, a2=2.904).

* --- 5. Kruskal-Wallis: h1 rating by 3 schools ---
NPAR TESTS
  /K-W=h1 BY school('A','C')
  /MISSING ANALYSIS.
* Expected: H=2.844, p=0.241 -> not significant.

* --- 6. Friedman: 3 rating items a1, a2, a3 (same 240 students) ---
NPAR TESTS
  /FRIEDMAN=a1 a2 a3
  /MISSING ANALYSIS.
* Expected: chi2=0.555, p=0.758 -> not significant.
