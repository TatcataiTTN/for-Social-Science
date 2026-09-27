* ============================================================
* Module 06 -- One-way ANOVA & Tukey Post Hoc
* Data: lop_hoc_240.sav (240 students, simulated data)
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. One-way ANOVA: Math score by 3 schools ---
ONEWAY math BY school
  /STATISTICS DESCRIPTIVES HOMOGENEITY
  /POSTHOC=TUKEY ALPHA(0.05).
* Expected: F(2,237)=5.87, p=0.003. Levene p=0.292 (>=0.05, homogeneous).
* Tukey: A-B gap 3.41 p=0.046 (significant); A-C gap 5.34 p=0.003 (significant);
*        B-C gap 1.93 p=0.427 (not significant).
* Homogeneous subsets: {A} alone, {B,C} together.

* ============================================================
* Note: TWO-WAY ANOVA (school x gender, section 4 on the web page) uses
* the UNIANOVA command -- PSPP 2.1.1 does NOT support it yet (verified,
* it errors with "UNIANOVA is not yet implemented"). See the
* 06_anova_en.ipynb notebook (statsmodels.formula.api.ols + anova_lm)
* to run the full two-way ANOVA + interaction effect.
* ============================================================
