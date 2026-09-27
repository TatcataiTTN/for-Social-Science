* ============================================================
* Module 05 -- t-Tests (Independent, Paired)
* Data: lop_hoc_240.sav (240 students, simulated data)
* NOTE: value labels for gender/method stay in Vietnamese -- see 03 file.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- 1. Independent t-test: teaching method -> gain (significant) ---
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* Expected: Levene p=0.535 (>=0.05, read the "assumed" row).
*           t(238)=7.589, p<0.001. "Du an" M=8.66 SD=5.77 (n=115)
*           "Truyen thong" M=2.89 SD=6.00 (n=125).

* --- 2. Independent t-test: gender -> Math score (NOT significant) ---
T-TEST GROUPS=gender('Nam','Nữ')
  /VARIABLES=math
  /CRITERIA=CI(.95).
* Expected: Levene p=0.081 (close to the threshold, still read "assumed").
*           t(238)=-1.348, p=0.179 -> not significant.

* --- 3. Paired t-test: pretest vs posttest (same 240 students) ---
T-TEST PAIRS=pretest WITH posttest (PAIRED)
  /CRITERIA=CI(.95).
* Expected: mean difference=5.65, t(239)=13.37, p<0.001.
