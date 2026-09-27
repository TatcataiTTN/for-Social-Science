* ============================================================
* Module 04 -- Distributions, Significance, Effect Size, Power
* Data: lop_hoc_240.sav (240 students, simulated data)
* NOTE: value labels for gender/method stay in Vietnamese -- see 03 file.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Clean the study_hours outlier FIRST (1 student typed "48" for "4.8") ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.
* (Matches the GUI steps in the lesson: Transform > Compute Variable,
*  Target=study_hours, Numeric Expression=study_hours/10,
*  If... "Include if case satisfies condition": study_hours > 20.)

* --- 1. 95% confidence interval for mean Math score ---
DESCRIPTIVES VARIABLES=math
  /STATISTICS=MEAN STDDEV SEMEAN.
* Expected: mean=47.91, SE=0.625 -> CI95%=[46.68; 49.14].

* --- 2. Skewness/kurtosis for study_hours (cleaned) and pretest ---
EXAMINE VARIABLES=study_hours pretest
  /STATISTICS DESCRIPTIVES
  /PLOT NPPLOT.
* Expected: study_hours skew=+0.658 (SE=0.157) -> meaningfully skewed,
*           Shapiro-Wilk W=0.969, p<0.001.
*           pretest skew=-0.097 -> within range, Shapiro-Wilk p=0.117.

* --- 3. Cohen's d: teaching method -> score gain ---
COMPUTE gain = posttest - pretest.
EXECUTE.
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* d = (8.66-2.89)/s_pooled = 0.981 (compute by hand from M, SD, N per group in the output).

* --- 4. Eta^2: school -> Math score ---
ONEWAY math BY school
  /STATISTICS DESCRIPTIVES.
* eta^2 = SSbetween/SStotal = 1056.82/22374.01 = 0.047 (compute by hand from the ANOVA table).
