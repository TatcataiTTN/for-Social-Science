* ============================================================
* Module 02 — Chon mau & co mau
* Du lieu: vnm_truong_195_tong_hop.sav (PISA 2025 VN, 195 truong)
* Muc dich: kiem chung that trong so mau (weight) lam thay doi ket qua the nao.
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- Buoc 1: trung binh EDULEAD KHONG trong so (moi truong tinh = 1) ---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.

* --- Buoc 2: ap trong so mau W_NRASCHBWT ---
WEIGHT BY W_NRASCHBWT.
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.
* Ket qua mong doi: mean KHONG trong so = 0.7653 (N=195)
*                    mean CO trong so    = 0.7874 (N hieu dung = tong trong so = 7284.6)

* --- Buoc 3: kiem tra do bien thien cua trong so ---
WEIGHT OFF.
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MIN MAX MEAN.
* Trong so dao dong tu 1.0 toi 617.2 - truong dai dien nhieu hoc sinh nhat
* co "quyen so" gap 617 lan truong dai dien it nhat.

* ============================================================
* Ghi chu: bang tinh CO MAU (Julious 2005 + Cohen 1988) o Module 02
* muc 4 duoc tinh bang statsmodels.stats.power.TTestIndPower trong Python -
* PSPP KHONG co lenh power-analysis tich hop san, xem file notebook
* 02_chon_mau.ipynb de xem code tinh day du.
* ============================================================
