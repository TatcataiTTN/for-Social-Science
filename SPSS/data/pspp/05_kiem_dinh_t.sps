* ============================================================
* Module 05 — Kiem dinh t (doc lap, bat cap)
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- 1. T-test doc lap: phuong phap day -> gain (co y nghia) ---
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* Ket qua mong doi: Levene p=0.535 (>=0.05, doc dong "assumed").
*                    t(238)=7.589, p<0.001. Du an M=8.66 SD=5.77 (n=115)
*                    Truyen thong M=2.89 SD=6.00 (n=125).

* --- 2. T-test doc lap: gioi tinh -> diem Toan (KHONG co y nghia) ---
T-TEST GROUPS=gender('Nam','Nữ')
  /VARIABLES=math
  /CRITERIA=CI(.95).
* Ket qua mong doi: Levene p=0.081 (gan nguong, van doc dong "assumed").
*                    t(238)=-1.348, p=0.179 -> khong co y nghia.

* --- 3. T-test bat cap: pretest vs posttest (cung 240 hoc sinh) ---
T-TEST PAIRS=pretest WITH posttest (PAIRED)
  /CRITERIA=CI(.95).
* Ket qua mong doi: chenh lech TB=5.65, t(239)=13.37, p<0.001.
