* ============================================================
* Module 10 — Phan tich nhan to & phan tich cum
* Du lieu: lop_hoc_240.sav (EFA) + vnm_truong_195_tong_hop.sav (cluster)
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Phan tich nhan to kham pha (EFA), co dinh 2 nhan to ---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC
  /CRITERIA=FACTORS(2)
  /ROTATION=VARIMAX.
* Ket qua mong doi: h1-h3 tai ro len 1 nhan to, a1-a3 tai ro len nhan to con lai
* (dung dinh tinh cau truc "hung thu" vs "lo au" da dung de tao du lieu).
* Luu y: PSPP dung EXTRACTION=PC (Principal Component), he so tai
* khong giong het 100% voi "principal axis factoring" trong Python,
* nhung ket luan ve nhom bien nao thuoc nhan to nao la giong nhau.

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- 2. Phan tich cum K-means tren 5 chi so WLE cap truong ---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3)
  /PRINT INITIAL.
* Ket qua mong doi: co cum PSPP se KHAC voi Python (KMeans) do khac
* chien luoc khoi tao K-means - day la dieu da biet truoc va giai
* thich trong bai, khong phai loi.

* ============================================================
* Ghi chu: chi so Silhouette (danh gia chat luong phan cum) va SEM/
* mo hinh da cap KHONG co lenh PSPP tuong duong - xem notebook
* 10_nhan_to_cum.ipynb de tinh Silhouette bang Python (scikit-learn).
* ============================================================
