* ============================================================
* 第07单元 -- 卡方检验与非参数检验
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（240名学生，模拟数据）
* 注意：gender/method 取值标签保留越南语原文 -- 见03文件说明。
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. 卡方检验：性别×教学方法（2x2表）---
CROSSTABS TABLES=gender BY method
  /STATISTICS=CHISQ PHI
  /CELLS=COUNT.
* 预期结果：读取"Continuity Correction"（耶茨校正）一行：
* chi2(1)=1.37, p=0.243 -> 不显著。

* --- 2. 卡方检验：性别×学校（2x3表）---
CROSSTABS TABLES=gender BY school
  /STATISTICS=CHISQ CC
  /CELLS=COUNT.
* 预期结果：chi2(2)=0.14, p=0.932, Cramer's V~0.024 -> 不显著。

* --- 3. Mann-Whitney U检验：h1评分按性别分组 ---
NPAR TESTS
  /M-W=h1 BY gender('Nam','Nữ')
  /MISSING ANALYSIS.
* 预期结果：U=6416, p=0.127 -> 不显著。

* --- 4. Wilcoxon检验：比较a1和a2两项评分（同一学生）---
NPAR TESTS
  /WILCOXON=a1 WITH a2
  /MISSING ANALYSIS.
* 预期结果：p=0.920 -> 完全没有差异（a1平均值=2.908, a2平均值=2.904）。

* --- 5. Kruskal-Wallis检验：h1评分按3所学校分组 ---
NPAR TESTS
  /K-W=h1 BY school('A','C')
  /MISSING ANALYSIS.
* 预期结果：H=2.844, p=0.241 -> 不显著。

* --- 6. Friedman检验：a1、a2、a3三项评分（同一240名学生）---
NPAR TESTS
  /FRIEDMAN=a1 a2 a3
  /MISSING ANALYSIS.
* 预期结果：chi2=0.555, p=0.758 -> 不显著。
