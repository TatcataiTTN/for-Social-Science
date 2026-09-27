* ============================================================
* Module 08 — Tuong quan Pearson & tuong quan rieng phan
* Du lieu: lop_hoc_240.sav + vnm_truong_195_tong_hop.sav
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Lam sach outlier study_hours TRUOC (giong Module 04/05) ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. Tuong quan Pearson: gio tu hoc vs diem Toan ---
CORRELATIONS VARIABLES=study_hours math
  /PRINT=TWOTAIL.
* Ket qua mong doi: r=0.582, r^2=0.338, p<0.001.

* --- 2. Tuong quan Spearman (doi chieu voi Pearson) ---
* PSPP 2.1.1 CHUA HO TRO lenh NONPAR CORR (da kiem tra, bao loi
* "NONPAR CORR is not yet implemented"). Trong SPSS that, dung
* Analyze > Correlate > Bivariate, tich them o Spearman.
* Ket qua mong doi (tinh trong notebook bang scipy.stats.spearmanr):
* rho=0.554 (gan Pearson vi quan he kha tuyen tinh).

* ============================================================
* Ghi chu: TUONG QUAN RIENG PHAN (muc 4 tren trang web, dung du lieu
* vnm_truong_195_tong_hop.sav) can lenh PARTIAL CORR - PSPP 2.1.1
* CHUA HO TRO lenh nay (da kiem tra, bao loi "PARTIAL CORR is not yet
* implemented"). Xem file notebook 08_tuong_quan.ipynb de chay day du
* bang cong thuc tay + scipy.stats.pearsonr.
* ============================================================
