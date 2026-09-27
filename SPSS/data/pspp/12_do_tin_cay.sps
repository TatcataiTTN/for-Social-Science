* ============================================================
* Module 12 — Do tin cay, do gia tri & dao duc nghien cuu
* Du lieu: lop_hoc_240.sav
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Cronbach's Alpha cho thang Hung thu (h1,h2,h3) ---
RELIABILITY
  /VARIABLES=h1 h2 h3
  /SCALE('Hung thu') ALL
  /MODEL=ALPHA
  /SUMMARY=TOTAL.
* Ket qua mong doi: Alpha=.71, item-total correlation h1=.57 h2=.49 h3=.54,
* alpha-if-deleted h1=.58 h2=.67 h3=.62.

* --- 2. Cronbach's Alpha cho thang Lo au (a1,a2,a3) ---
RELIABILITY
  /VARIABLES=a1 a2 a3
  /SCALE('Lo au') ALL
  /MODEL=ALPHA
  /SUMMARY=TOTAL.
* Ket qua mong doi: Alpha=.76.

* ============================================================
* Ghi chu: EFA (bang chung do gia tri cau truc) da chay o file
* 10_nhan_to_cum.sps - xem lai de doi chieu voi ket qua Alpha o day.
* Dao duc nghien cuu (muc 4 tren trang web) la noi dung khai niem,
* khong co lenh PSPP tuong ung.
* ============================================================
