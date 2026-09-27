* ============================================================
* 第02单元 -- 抽样与样本量
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：vnm_truong_195_tong_hop.sav（PISA 2025 越南，195所学校）
* 目的：验证抽样权重如何改变结果。语法与越南语原版完全相同。
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- 第一步：EDULEAD 不加权平均值（每所学校计为1）---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.

* --- 第二步：应用抽样权重 W_NRASCHBWT ---
WEIGHT BY W_NRASCHBWT.
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.
* 预期结果：不加权平均值 = 0.7653（N=195）
*           加权平均值   = 0.7874（有效N=权重总和=7284.6）

* --- 第三步：检查权重本身的分布 ---
WEIGHT OFF.
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MIN MAX MEAN.
* 权重范围从1.0到617.2 -- 权重最高的学校代表的学生数约为权重最低学校的617倍。

* ============================================================
* 注：第02单元第4节的样本量表（Julious 2005 + Cohen 1988）在Python中用
* statsmodels.stats.power.TTestIndPower 计算 -- PSPP没有内置的检验力分
* 析命令，完整代码见 02_chon_mau_zh.ipynb notebook。
* ============================================================
