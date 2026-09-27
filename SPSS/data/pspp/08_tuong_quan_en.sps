* ============================================================
* Module 08 -- Pearson Correlation & Partial Correlation
* Data: lop_hoc_240.sav + vnm_truong_195_tong_hop.sav
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Clean the study_hours outlier FIRST (same as Modules 04/05) ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. Pearson correlation: study hours vs Math score ---
CORRELATIONS VARIABLES=study_hours math
  /PRINT=TWOTAIL.
* Expected: r=0.582, r^2=0.338, p<0.001.

* --- 2. Spearman correlation (compared against Pearson) ---
* PSPP 2.1.1 does NOT support the NONPAR CORR command (verified, it
* errors with "NONPAR CORR is not yet implemented"). In real SPSS, use
* Analyze > Correlate > Bivariate and tick the Spearman box.
* Expected (computed in the notebook with scipy.stats.spearmanr):
* rho=0.554 (close to Pearson because the relationship is fairly linear).

* ============================================================
* Note: PARTIAL CORRELATION (section 4 on the web page, using
* vnm_truong_195_tong_hop.sav) needs the PARTIAL CORR command -- PSPP
* 2.1.1 does NOT support it either (verified, "PARTIAL CORR is not yet
* implemented"). See the 08_tuong_quan_en.ipynb notebook for the full
* run using the hand formula + scipy.stats.pearsonr.
* ============================================================
