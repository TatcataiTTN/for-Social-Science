* ============================================================
* Module 11 — Chon dung kiem dinh thong ke (on tap tong hop)
* 6 tinh huong da xac dinh o trang web, chay lai bang dung cu phap
* da hoc o Module 05-10. Khong co phan tich moi.
* ============================================================
GET FILE='../lop_hoc_240.sav'.
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- Tinh huong 1: ANOVA mot chieu (Module 06) ---
ONEWAY math BY school /STATISTICS DESCRIPTIVES /POSTHOC=TUKEY.

* --- Tinh huong 2: T-test bat cap (Module 05) ---
T-TEST PAIRS=pretest WITH posttest (PAIRED).

* --- Tinh huong 3: Kruskal-Wallis (Module 07) ---
NPAR TESTS /K-W=h1 BY school('A','C').

* --- Tinh huong 4a: Pearson r (Module 08) ---
CORRELATIONS VARIABLES=study_hours math.
* Tinh huong 4b: hoi quy don bien (Module 09)
REGRESSION /DEPENDENT math /METHOD=ENTER study_hours.

* --- Tinh huong 5: Phan tich nhan to (Module 10) ---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC /CRITERIA=FACTORS(2) /ROTATION=VARIMAX.

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.
* --- Tinh huong 6: Phan tich cum (Module 10) ---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3).

* ============================================================
* Ghi chu: day la file ON TAP, khong co phan tich moi - tat ca
* cu phap va ket qua da duoc kiem chung day du o cac file .sps
* rieng cua Module 05-10 (xem lai neu can doi chieu chi tiet).
* ============================================================
