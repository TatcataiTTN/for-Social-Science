* ============================================================
* 第10单元 -- 探索性因子分析与聚类分析
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（EFA）+ vnm_truong_195_tong_hop.sav（聚类）
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. 探索性因子分析（EFA），固定为2个因子 ---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC
  /CRITERIA=FACTORS(2)
  /ROTATION=VARIMAX.
* 预期结果：h1-h3 载荷集中在一个因子上，a1-a3 载荷集中在另一个因子上
* （与用于模拟数据集的"兴趣"vs"焦虑"潜在结构一致）。
* 注：PSPP使用EXTRACTION=PC（主成分法），其载荷与Python中的
* "主轴因子法"不完全相同，但关于哪些变量属于哪个因子的结论是一致的。

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- 2. 基于5个学校层面WLE指标的K均值聚类分析 ---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3)
  /PRINT INITIAL.
* 预期结果：PSPP的聚类结果与Python（KMeans）不同，
* 这是由于K均值初始化策略不同所致 -- 这是课程中已说明的
* 已知差异，并非错误。

* ============================================================
* 注：轮廓系数（Silhouette，聚类质量评估指标）和多层次/SEM模型
* 没有对应的PSPP命令 -- 请见notebook
* 10_nhan_to_cum_zh.ipynb，其中用Python（scikit-learn）计算轮廓系数。
* ============================================================
