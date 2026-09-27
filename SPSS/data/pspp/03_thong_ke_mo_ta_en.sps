* ============================================================
* Module 03 -- Descriptive Statistics
* Data: lop_hoc_240.sav (240 students, simulated data)
* NOTE: value labels for gender/method stay in Vietnamese ("Nam", "Nu",
* "Du an", "Truyen thong") because that is what is literally stored in
* the .sav file -- only the comments below are translated to English.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Missing data: check variable h2 ---
FREQUENCIES VARIABLES=h2
  /FORMAT=NOTABLE
  /MISSING=INCLUDE.
* Expected: 3 missing values / 240 (1.25%).

* --- 2. Frequencies, %, crosstab gender x teaching method ---
CROSSTABS TABLES=gender BY method
  /CELLS=COUNT ROW.
* Expected: Male/"Nam"(n=121): "Du an" 63 (52.1%), "Truyen thong" 58 (47.9%)
*           Female/"Nu" (n=119): "Du an" 52 (43.7%), "Truyen thong" 67 (56.3%)

* --- 3. Central tendency & dispersion for Math score ---
FREQUENCIES VARIABLES=math
  /STATISTICS=MEAN MEDIAN MODE STDDEV VARIANCE RANGE MIN MAX
  /FORMAT=NOTABLE.

* --- 4. Boxplot of Math score by 3 schools (see the real dispersion figure) ---
EXAMINE VARIABLES=math BY school
  /PLOT BOXPLOT
  /STATISTICS DESCRIPTIVES.
