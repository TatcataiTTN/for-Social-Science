* ============================================================
* Module 07 — Chi-square & kiem dinh phi tham so
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Chi-square: gioi tinh x phuong phap day (bang 2x2) ---
CROSSTABS TABLES=gender BY method
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT.
* Ket qua mong doi: dung dong "Continuity Correction" (da hieu chinh Yates):
* chi2(1)=1.37, p=0.243 -> khong co y nghia.

* --- 2. Chi-square: gioi tinh x truong (bang 2x3) ---
CROSSTABS TABLES=gender BY school
  /STATISTICS=CHISQ CC
  /CELLS=COUNT.
* Ket qua mong doi: chi2(2)=0.14, p=0.932, Cramer's V~0.024 -> khong co y nghia.

* --- 3. Mann-Whitney U: danh gia h1 theo gioi tinh ---
NPAR TESTS
  /M-W=h1 BY gender('Nam','Nữ')
  /MISSING ANALYSIS.
* Ket qua mong doi: U=6416, p=0.127 -> khong co y nghia.

* --- 4. Wilcoxon: so sanh 2 muc danh gia a1 va a2 (cung nguoi) ---
NPAR TESTS
  /WILCOXON=a1 WITH a2
  /MISSING ANALYSIS.
* Ket qua mong doi: p=0.920 -> hoan toan khong co khac biet (TB a1=2.908, a2=2.904).

* --- 5. Kruskal-Wallis: danh gia h1 theo 3 truong ---
NPAR TESTS
  /K-W=h1 BY school('A','C')
  /MISSING ANALYSIS.
* Ket qua mong doi: H=2.844, p=0.241 -> khong co y nghia.

* --- 6. Friedman: 3 muc danh gia a1, a2, a3 (cung 240 hoc sinh) ---
NPAR TESTS
  /FRIEDMAN=a1 a2 a3
  /MISSING ANALYSIS.
* Ket qua mong doi: chi2=0.555, p=0.758 -> khong co y nghia.
