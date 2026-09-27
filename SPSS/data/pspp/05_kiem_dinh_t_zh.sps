* ============================================================
* 第05单元 -- t检验（独立样本、配对样本）
* 机器翻译提示：本文件注释由机器翻译生成，未经人工校对。
* 数据：lop_hoc_240.sav（240名学生，模拟数据）
* 注意：gender/method 取值标签保留越南语原文 -- 见03文件说明。
* 语法与越南语原版完全相同。
* ============================================================
GET FILE='../lop_hoc_240.sav'.
COMPUTE gain = posttest - pretest.
EXECUTE.

* --- 1. 独立样本t检验：教学方法 -> gain（显著）---
T-TEST GROUPS=method('Dự án','Truyền thống')
  /VARIABLES=gain
  /CRITERIA=CI(.95).
* 预期结果：Levene检验 p=0.535（>=0.05，读取"假设相等"一行）。
*           t(238)=7.589, p<0.001。"Du an" M=8.66 SD=5.77（n=115）
*           "Truyen thong" M=2.89 SD=6.00（n=125）。

* --- 2. 独立样本t检验：性别 -> 数学成绩（不显著）---
T-TEST GROUPS=gender('Nam','Nữ')
  /VARIABLES=math
  /CRITERIA=CI(.95).
* 预期结果：Levene检验 p=0.081（接近阈值，仍读取"假设相等"一行）。
*           t(238)=-1.348, p=0.179 -> 不显著。

* --- 3. 配对样本t检验：pretest vs posttest（同一240名学生）---
T-TEST PAIRS=pretest WITH posttest (PAIRED)
  /CRITERIA=CI(.95).
* 预期结果：平均差值=5.65, t(239)=13.37, p<0.001。
