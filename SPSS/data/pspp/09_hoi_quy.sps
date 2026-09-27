* ============================================================
* Module 09 — Hoi quy tuyen tinh don & da bien
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Lam sach outlier study_hours TRUOC (giong Module 04/05/08) ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. Hoi quy don bien: math ~ study_hours ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours.
* Ket qua mong doi: R2=0.338, B(study_hours)=2.51, p<0.001.

* --- 2. Hoi quy da bien: math ~ study_hours + h1 + a1 ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours h1 a1.
* Ket qua mong doi: R2=0.495 (R2 hieu chinh=0.488), F(3,236)=77.05, p<0.001.
* B: study_hours=2.49, h1=2.15, a1=-2.68 (Beta: 0.58, 0.23, -0.30).
* Da kiem chung khop tuyet doi voi Python (statsmodels).

* ============================================================
* Ghi chu: PSPP KHONG in truc tiep VIF/Durbin-Watson/Shapiro-Wilk phan du
* trong lenh REGRESSION co ban nay - phan kiem tra gia dinh day du
* (VIF, Durbin-Watson, Shapiro-Wilk phan du) chi tinh duoc trong
* notebook 09_hoi_quy.ipynb (statsmodels + scipy).
* ============================================================
