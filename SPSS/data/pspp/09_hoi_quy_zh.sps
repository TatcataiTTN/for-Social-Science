* ============================================================
* 第09单元 -- 简单线性回归与多元线性回归
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（240名学生，模拟数据集）
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 0. 首先清理 study_hours 的离群值（与第04/05/08单元相同）---
DO IF (study_hours > 20).
COMPUTE study_hours = study_hours / 10.
END IF.
EXECUTE.

* --- 1. 简单回归：math ~ study_hours ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours.
* 预期结果：R2=0.338, B(study_hours)=2.51, p<0.001。

* --- 2. 多元回归：math ~ study_hours + h1 + a1 ---
REGRESSION
  /DEPENDENT math
  /METHOD=ENTER study_hours h1 a1.
* 预期结果：R2=0.495（调整后R2=0.488），F(3,236)=77.05, p<0.001。
* B系数：study_hours=2.49, h1=2.15, a1=-2.68（Beta系数：0.58, 0.23, -0.30）。
* 已与Python（statsmodels）完全核对一致。

* ============================================================
* 注：本基础REGRESSION命令中，PSPP不会直接输出VIF/Durbin-Watson/
* 残差Shapiro-Wilk检验 -- 完整的假设检验（VIF、Durbin-Watson、
* 残差Shapiro-Wilk）仅在notebook 09_hoi_quy_zh.ipynb中计算
* （使用statsmodels + scipy）。
* ============================================================
