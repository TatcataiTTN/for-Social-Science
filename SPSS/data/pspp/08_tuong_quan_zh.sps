* ============================================================
* 第08单元 -- Pearson相关与偏相关
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav + vnm_truong_195_tong_hop.sav
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. 首先清理 study_hours 的离群值（与第04/05单元相同）---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. Pearson相关：学习时长 vs 数学成绩 ---
CORRELATIONS VARIABLES=study_hours math
  /PRINT=TWOTAIL.
* 预期结果：r=0.582, r^2=0.338, p<0.001。

* --- 2. Spearman相关（与Pearson对比）---
* PSPP 2.1.1 不支持 NONPAR CORR 命令（已验证，报错
* "NONPAR CORR is not yet implemented"）。在真正的SPSS中，使用
* Analyze > Correlate > Bivariate 并勾选Spearman选项。
* 预期结果（在notebook中用scipy.stats.spearmanr计算）：
* rho=0.554（与Pearson接近，因为关系相当线性）。

* ============================================================
* 注：偏相关（课程网页第4节，使用vnm_truong_195_tong_hop.sav）需要
* PARTIAL CORR命令 -- PSPP 2.1.1同样不支持（已验证，报错
* "PARTIAL CORR is not yet implemented"）。完整计算见
* 08_tuong_quan_zh.ipynb notebook（使用手动公式+scipy.stats.pearsonr）。
* ============================================================
