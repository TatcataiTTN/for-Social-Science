* ============================================================
* 第11单元 -- 选择正确的统计检验（综合复习）
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 网页上已定义的6种情境，用第05-10单元学过的确切语法重新运行。
* 没有新的分析 -- 仅为复习。
* ============================================================
GET FILE='../lop_hoc_240.sav'.
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- 情境1：单因素方差分析ANOVA（第06单元）---
ONEWAY math BY school /STATISTICS DESCRIPTIVES /POSTHOC=TUKEY.

* --- 情境2：配对t检验（第05单元）---
T-TEST PAIRS=pretest WITH posttest (PAIRED).

* --- 情境3：Kruskal-Wallis检验（第07单元）---
NPAR TESTS /K-W=h1 BY school('A','C').

* --- 情境4a：Pearson相关系数r（第08单元）---
CORRELATIONS VARIABLES=study_hours math.
* 情境4b：简单线性回归（第09单元）
REGRESSION /DEPENDENT math /METHOD=ENTER study_hours.

* --- 情境5：因子分析（第10单元）---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC /CRITERIA=FACTORS(2) /ROTATION=VARIMAX.

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.
* --- 情境6：聚类分析（第10单元）---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3).

* ============================================================
* 注：本文件为复习文件，没有新分析 -- 全部语法与结果已在
* 第05-10单元各自的.sps文件中完整验证过（如需详细核对请回看那些文件）。
* ============================================================
