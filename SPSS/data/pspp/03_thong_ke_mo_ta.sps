* ============================================================
* Module 03 — Thong ke mo ta
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Du lieu thieu: kiem tra bien h2 ---
FREQUENCIES VARIABLES=h2
  /FORMAT=NOTABLE
  /MISSING=INCLUDE.
* Ket qua mong doi: 3 gia tri thieu / 240 (1.25%).

* --- 2. Tan so, %, bang cheo gioi tinh x phuong phap day ---
CROSSTABS TABLES=gender BY method
  /CELLS=COUNT ROW.
* Ket qua mong doi: Nam(n=121): Du an 63 (52.1%), Truyen thong 58 (47.9%)
*                    Nu (n=119): Du an 52 (43.7%), Truyen thong 67 (56.3%)

* --- 3. Xu huong trung tam & do phan tan cho diem Toan ---
FREQUENCIES VARIABLES=math
  /STATISTICS=MEAN MEDIAN MODE STDDEV VARIANCE RANGE MIN MAX
  /FORMAT=NOTABLE.

* --- 4. Boxplot diem Toan theo 3 truong (xem hinh dispersion that) ---
EXAMINE VARIABLES=math BY school
  /PLOT BOXPLOT
  /STATISTICS DESCRIPTIVES.
