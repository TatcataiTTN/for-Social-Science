* ============================================================
* Module 11 -- Choosing the right statistical test (comprehensive review)
* 6 scenarios already defined on the web page, re-run with the exact
* syntax learned in Modules 05-10. No new analysis -- review only.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- Scenario 1: one-way ANOVA (Module 06) ---
ONEWAY math BY school /STATISTICS DESCRIPTIVES /POSTHOC=TUKEY.

* --- Scenario 2: paired t-test (Module 05) ---
T-TEST PAIRS=pretest WITH posttest (PAIRED).

* --- Scenario 3: Kruskal-Wallis (Module 07) ---
NPAR TESTS /K-W=h1 BY school('A','C').

* --- Scenario 4a: Pearson r (Module 08) ---
CORRELATIONS VARIABLES=study_hours math.
* Scenario 4b: simple linear regression (Module 09)
REGRESSION /DEPENDENT math /METHOD=ENTER study_hours.

* --- Scenario 5: factor analysis (Module 10) ---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC /CRITERIA=FACTORS(2) /ROTATION=VARIMAX.

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.
* --- Scenario 6: cluster analysis (Module 10) ---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3).

* ============================================================
* Note: this is a REVIEW file, no new analysis -- all syntax and
* results were already verified in full in the individual .sps files
* of Modules 05-10 (go back to those for detailed cross-checks).
* ============================================================
