* ============================================================
* Module 04 — Phan phoi, y nghia thong ke, effect size, power
* Du lieu: lop_hoc_240.sav (240 hoc sinh, du lieu gia lap)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. Lam sach outlier study_hours TRUOC (1 hoc sinh go nham 48 thanh 4.8) ---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.
* (Khop dung huong dan GUI tren trang: Transform > Compute Variable,
*  Target=study_hours, Numeric Expression=study_hours/10,
*  If... "Include if case satisfies condition": study_hours > 20.)

* --- 1. Khoang tin cay 95% cho diem Toan trung binh ---
DESCRIPTIVES VARIABLES=math
  /STATISTICS=MEAN STDDEV SEMEAN.
* Ket qua mong doi: mean=47.91, SE=0.625 -> CI95%=[46.68; 49.14].

* --- 2. Skewness/kurtosis cho study_hours (da lam sach) va pretest ---
EXAMINE VARIABLES=study_hours pretest
  /STATISTICS DESCRIPTIVES
  /PLOT NPPLOT.
* Ket qua mong doi: study_hours skew=+0.658 (SE=0.157) -> lech co y nghia,
*                    Shapiro-Wilk W=0.969, p<0.001.
*                    pretest skew=-0.097 -> trong nguong, Shapiro-Wilk p=0.117.

* --- 3. Cohen's d: phuong phap day -> muc tang diem (gain) ---
COMPUTE gain = posttest - pretest.
EXECUTE.
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* d = (8.66-2.89)/s_pooled = 0.981 (tinh tay tu M, SD, N moi nhom trong output).

* --- 4. Eta^2: truong -> diem Toan ---
ONEWAY math BY school
  /STATISTICS DESCRIPTIVES.
* eta^2 = SSbetween/SStotal = 1056.82/22374.01 = 0.047 (tinh tay tu bang ANOVA).
