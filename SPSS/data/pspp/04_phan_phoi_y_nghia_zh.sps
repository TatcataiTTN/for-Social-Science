* ============================================================
* 第04单元 -- 分布、统计显著性、效应量、检验力
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（240名学生，模拟数据）
* 注意：gender/method 取值标签保留越南语原文 -- 见03文件说明。
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. 首先清理 study_hours 的离群值（1名学生把"4.8"打成了"48"）---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.
* （对应课程网页中的图形界面操作：Transform > Compute Variable，
*  Target=study_hours，Numeric Expression=study_hours/10，
*  If...条件"Include if case satisfies condition"：study_hours > 20。）

* --- 1. 数学平均分的95%置信区间 ---
DESCRIPTIVES VARIABLES=math
  /STATISTICS=MEAN STDDEV SEMEAN.
* 预期结果：平均值=47.91，标准误=0.625 -> 95%置信区间=[46.68; 49.14]。

* --- 2. study_hours（已清理）和 pretest 的偏度/峰度 ---
EXAMINE VARIABLES=study_hours pretest
  /STATISTICS DESCRIPTIVES
  /PLOT NPPLOT.
* 预期结果：study_hours 偏度=+0.658（标准误=0.157）-> 显著偏斜，
*           Shapiro-Wilk W=0.969，p<0.001。
*           pretest 偏度=-0.097 -> 在范围内，Shapiro-Wilk p=0.117。

* --- 3. Cohen's d：教学方法 -> 成绩提升幅度 ---
COMPUTE gain = posttest - pretest.
EXECUTE.
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* d = (8.66-2.89)/合并标准差 = 0.981（从输出的各组M、SD、N手动计算）。

* --- 4. Eta^2：学校 -> 数学成绩 ---
ONEWAY math BY school
  /STATISTICS DESCRIPTIVES.
* eta^2 = 组间平方和/总平方和 = 1056.82/22374.01 = 0.047（从方差分析表手动计算）。
