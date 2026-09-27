* ============================================================
* Module 09 -- Simple & Multiple Linear Regression
* Data: lop_hoc_240.sav (240 students, simulated dataset)
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Clean the study_hours outlier FIRST (same as Modules 04/05/08) ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. Simple regression: math ~ study_hours ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours.
* Expected: R2=0.338, B(study_hours)=2.51, p<0.001.

* --- 2. Multiple regression: math ~ study_hours + h1 + a1 ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours h1 a1.
* Expected: R2=0.495 (adjusted R2=0.488), F(3,236)=77.05, p<0.001.
* B: study_hours=2.49, h1=2.15, a1=-2.68 (Beta: 0.58, 0.23, -0.30).
* Verified to match Python (statsmodels) exactly.

* ============================================================
* Note: PSPP does NOT print VIF/Durbin-Watson/Shapiro-Wilk on the
* residuals directly inside this basic REGRESSION command -- the full
* assumption checks (VIF, Durbin-Watson, Shapiro-Wilk on residuals)
* are only computed in the notebook 09_hoi_quy_en.ipynb
* (statsmodels + scipy).
* ============================================================
