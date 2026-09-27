* ============================================================
* 第03单元 -- 描述统计
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（240名学生，模拟数据）
* 注意：gender/method 的取值标签保留越南语原文（"Nam"、"Nữ"、
* "Dự án"、"Truyền thống"），因为 .sav 文件中实际存储的就是这些字符串
* -- 只有下面的注释被翻译成中文。语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. 缺失数据：检查变量 h2 ---
FREQUENCIES VARIABLES=h2
  /FORMAT=NOTABLE
  /MISSING=INCLUDE.
* 预期结果：缺失值3个 / 240（1.25%）。

* --- 2. 频数、百分比、性别×教学方法交叉表 ---
CROSSTABS TABLES=gender BY method
  /CELLS=COUNT ROW.
* 预期结果：男/"Nam"（n=121）："Du an" 63（52.1%），"Truyen thong" 58（47.9%）
*           女/"Nu"（n=119）："Du an" 52（43.7%），"Truyen thong" 67（56.3%）

* --- 3. 数学成绩的集中趋势与离散程度 ---
FREQUENCIES VARIABLES=math
  /STATISTICS=MEAN MEDIAN MODE STDDEV VARIANCE RANGE MIN MAX
  /FORMAT=NOTABLE.

* --- 4. 按3所学校分组的数学成绩箱线图 ---
EXAMINE VARIABLES=math BY school
  /PLOT BOXPLOT
  /STATISTICS DESCRIPTIVES.
