* ============================================================
* Module 06 — ANOVA mot chieu & hau kiem Tukey
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. ANOVA mot chieu: diem Toan theo 3 truong ---
ONEWAY math BY school
  /STATISTICS DESCRIPTIVES HOMOGENEITY
  /POSTHOC=TUKEY ALPHA(0.05).
* Ket qua mong doi: F(2,237)=5.87, p=0.003. Levene p=0.292 (>=0.05, dong nhat).
* Tukey: A-B chenh 3.41 p=0.046 (co y nghia); A-C chenh 5.34 p=0.003 (co y nghia);
*        B-C chenh 1.93 p=0.427 (khong co y nghia).
* Nhom dong nhat: {A} rieng, {B,C} chung mot nhom.

* ============================================================
* Ghi chu: ANOVA HAI CHIEU (truong x gioi tinh, muc 4 tren trang web)
* dung lenh UNIANOVA - PSPP 2.1.1 CHUA HO TRO lenh nay (da kiem tra,
* bao loi "UNIANOVA is not yet implemented"). Xem file notebook
* 06_anova.ipynb (statsmodels.formula.api.ols + anova_lm) de chay
* day du ANOVA hai chieu + hieu ung tuong tac.
* ============================================================
