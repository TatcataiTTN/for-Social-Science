* ========= BUỔI 1 (PISA 2025 · Việt Nam): MÔ TẢ & TƯƠNG QUAN =========.
* Đơn vị phân tích: 195 TRƯỜNG. Chạy từ thư mục pspp/.
GET FILE='../du_lieu/vnm_truong_195_tong_hop.sav'.

* 1. Cấu trúc mẫu: vùng, loại trường, quy mô cộng đồng.
FREQUENCIES VARIABLES=vung PRIVATESCH SC001Q01TA SCHSIZE_Q /BARCHART.

* 2. Các chỉ số môi trường trường học (WLE): trung bình, độ lệch, hình dạng.
DESCRIPTIVES VARIABLES=EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP AVLRSOFT ENCOURPG sci_mean
  /STATISTICS=MEAN STDDEV MIN MAX SKEWNESS KURTOSIS.

* 3. Tìm ngoại lai (ID = mã trường để biết trường nào).
EXAMINE VARIABLES=DIGPREP ENCOURPG EDULEAD
  /ID=CNTSCHID
  /STATISTICS=DESCRIPTIVES EXTREME(3)
  /PLOT=BOXPLOT HISTOGRAM.

* 4. Trung bình theo nhóm (bẫy: so sánh chỉ bằng trung bình).
MEANS TABLES=sci_mean EDULEAD BY PRIVATESCH
  /CELLS=COUNT MEAN STDDEV.

* 5. Tương quan giữa các chỉ số + điểm Khoa học TB của trường.
CORRELATIONS VARIABLES=EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP AVLRSOFT ENCOURPG sci_mean
  /PRINT=TWOTAIL NOSIG.
GRAPH /SCATTERPLOT(BIVARIATE)=EDUSHORT WITH STAFFSHORT.

* 6. Cấp học sinh: thời gian trả lời bảng hỏi (giây) — dữ liệu thời gian thường lệch phải.
GET FILE='../du_lieu/vnm_hocsinh_7368.sav'.
DESCRIPTIVES VARIABLES=qq_time EFFORT_TT sci_mc math_mc read_mc ldw_mc
  /STATISTICS=MEAN STDDEV MIN MAX SKEWNESS.
EXAMINE VARIABLES=qq_time /PLOT=BOXPLOT HISTOGRAM /STATISTICS=DESCRIPTIVES EXTREME(5) /ID=CNTSTUID.
