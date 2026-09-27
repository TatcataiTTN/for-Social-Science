* ============================================================
* Module 01 — Thang do & ban chat du lieu dinh luong
* Du lieu: vnm_truong_195_tong_hop.sav (PISA 2025 VN, 195 truong)
* Muc dich: minh hoa 4 thang do bang chinh cac bien that trong bo du lieu.
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- Dinh danh (nominal): REGION chi la nhan khu vuc, khong co thu tu ---
FREQUENCIES VARIABLES=REGION
  /STATISTICS=NONE
  /FORMAT=NOTABLE.
FREQUENCIES VARIABLES=REGION.

* --- Thu bac (ordinal): SCHSIZE_Q la tu phan vi quoc te (1-4) ---
FREQUENCIES VARIABLES=SCHSIZE_Q.

* --- Khoang (interval): EDULEAD la chi so WLE, khong co 0 that ---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV MIN MAX.

* --- Ti le (ratio): W_NRASCHBWT co 0 that, lay ti so duoc ---
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MEAN STDDEV MIN MAX.

* Ghi chu: trong SPSS/PSPP, ca EDULEAD (khoang) va W_NRASCHBWT (ti le)
* deu duoc khai bao Measure = Scale trong Variable View - phan mem
* gop 2 thang do ly thuyet nay thanh 1 loai duy nhat (xem Module 01, muc 1).
