* ============================================================
* 第01单元 -- 数据测量量表与定量数据的本质
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：vnm_truong_195_tong_hop.sav（PISA 2025 越南，195所学校）
* 目的：用真实变量说明四种测量量表。语法与越南语原版完全相同。
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- 定类量表：REGION 只是地区标签，无顺序 ---
FREQUENCIES VARIABLES=REGION
  /STATISTICS=NONE
  /FORMAT=NOTABLE.
FREQUENCIES VARIABLES=REGION.

* --- 定序量表：SCHSIZE_Q 是国际四分位数（1-4）---
FREQUENCIES VARIABLES=SCHSIZE_Q.

* --- 定距量表：EDULEAD 是WLE指数，没有真正的零点 ---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV MIN MAX.

* --- 定比量表：W_NRASCHBWT 有真正的零点，比率有意义 ---
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MEAN STDDEV MIN MAX.

* 注：在SPSS/PSPP中，EDULEAD（定距）和 W_NRASCHBWT（定比）在 Variable
* View 中都被声明为 Measure = Scale -- 软件把这两种理论上不同的量表合并
* 为一类（见第01单元第1节）。
