# TASKS — for-Social-Science / SPSS (theo dõi xuyên suốt nhiều phiên)

Trạng thái: 🟢 xong · 🟡 đang làm · ⚪ chưa làm. Cập nhật file này mỗi khi hoàn thành một task.

## Epic 0 — Hạ tầng (làm 1 lần, chặn mọi thứ khác)
- 🟢 0.1 Tạo repo `TatcataiTTN/for-Social-Science`, bật Pages (branch `main`, path `/`)
- 🟢 0.2 Khung site tĩnh: `index.html` (trang chủ đa ngôn ngữ), `SPSS/index.html` (danh mục module)
- 🟢 0.3 Banner xin lỗi/miễn trừ trách nhiệm AI-generated — đặt ở MỌI trang, 3 ngôn ngữ
- 🟢 0.4 Bộ chọn ngôn ngữ VI/EN/ZH dùng chung (header component)
- 🟢 0.5 Quy ước thư mục: `SPSS/modules/<NN-slug>/{vi,en,zh}.html`, `SPSS/assets/`, `SPSS/data/`
- ⚪ 0.6 Trang "Bộ dữ liệu" tổng hợp: liệt kê mọi `.sav`/`.csv`/`.ipynb` kèm nút tải + mở Colab/nbviewer
- ⚪ 0.7 Script kiểm thử 3 lớp (đối chiếu nội dung, mở bằng puppeteer, curl production) — xem Giai đoạn 6 skill

## Epic 1 — Khung nội dung (ánh xạ vào Cohen et al., *Research Methods in Education*, ed.8, ch.38–44)
- 🟢 1.1 Đọc mục lục, chốt bản đồ 12 module (đã làm, xem bên dưới)
- ⚪ 1.2 Với MỖI module: đọc kỹ đúng trang chương tương ứng trong PDF (không suy diễn), trích ý + ví dụ + số liệu thật của sách
- ⚪ 1.3 Đối chiếu với 8 tài liệu HNUE (Bài 16–24) để lấy quy trình bấm SPSS từng bước thật (không bịa menu)

### Bản đồ 12 module (nguồn: sách, chương 12,14,38–44 + tài liệu HNUE)
| # | Module | Nguồn sách | Nguồn HNUE | Trạng thái |
|---|---|---|---|---|
| 01 | Thang đo & bản chất dữ liệu định lượng | ch.38 (38.2–38.5) | !Huong dan SPSS.docx | ⚪ |
| 02 | Chọn mẫu & cỡ mẫu | ch.12 | — | ⚪ |
| 03 | Thống kê mô tả (tần số, xu hướng trung tâm, phân tán) | ch.40 | Video 9 (làm sạch) | ⚪ |
| 04 | Phân phối, giả thuyết, ý nghĩa thống kê, effect size, power | ch.38.6–38.10, ch.39 | — | ⚪ |
| 05 | Kiểm định t (độc lập, bắt cặp, một mẫu) | ch.41.2 | Bài 16-17 | ⚪ |
| 06 | ANOVA một/hai chiều + hậu kiểm | ch.41.3 | Bài 19 | ⚪ |
| 07 | Chi-square & kiểm định phi tham số (Mann-Whitney, Wilcoxon, Kruskal-Wallis, Friedman) | ch.41.4–41.7 | Bài 18 | ⚪ |
| 08 | Tương quan Pearson & tương quan riêng phần | ch.40.5–40.6 | Bài 22 | ⚪ |
| 09 | Hồi quy tuyến tính đơn & đa biến, chuẩn hoá điểm | ch.42 | Bài 23, 24 | ⚪ |
| 10 | Phân tích nhân tố, phân tích cụm, SEM/đa cấp (giới thiệu) | ch.43 | — | ⚪ |
| 11 | Chọn đúng kiểm định thống kê (cây quyết định) | ch.44 | — | ⚪ |
| 12 | Độ tin cậy, độ giá trị & đạo đức nghiên cứu | ch.14, ch.40.7 | — | ⚪ |

## Epic 2 — Sản xuất slide (mỗi module = 1 sub-task, lặp lại cho 12 module × 3 ngôn ngữ)
Quy trình chuẩn cho MỖI module (ghi rõ để làm lặp lại được across sessions):
1. ⚪ Viết `gen_deck.py` cho module (dùng chung helper layout ở `SPSS/_shared/deckgen.py`)
2. ⚪ Bản tiếng Việt (gốc, viết tay nội dung, không dịch máy)
3. ⚪ Bản tiếng Anh (dịch có biên tập, không phải Google dịch thô — ghi rõ "human-reviewed translation")
4. ⚪ Bản tiếng Trung (Google Translate API/dịch máy thô, dán banner "机器翻译" rõ ràng, KHÔNG chỉnh sửa tay)
5. ⚪ Ít nhất 1 sơ đồ SVG minh hoạ khái niệm cốt lõi của module (không phải trang trí)
6. ⚪ 1 ví dụ số liệu thật (từ `Lop_rieng_SPSS/` hoặc `Lop_rieng_SPSS_v2_PISA2025/`), không bịa số
7. ⚪ Quy trình SPSS từng bước (ảnh chụp màn hình cắt từ tài liệu HNUE nếu có, ghi nguồn)
8. ⚪ Link mở dữ liệu: `.ipynb` (nbviewer/Colab) + `.sav`/`.sps` (tải trực tiếp từ repo)
9. ⚪ 5 câu hỏi tự kiểm tra (MCQ, chấm client-side, audit bias vị trí/độ dài/order theo `references/pitfalls.md`)
10. ⚪ QA hoạt hoạ theo quy trình 4 bước của skill html-slide-deck-engineering (nếu module có animation)
Trạng thái từng module: xem cột "Trạng thái" ở bảng Epic 1 — cập nhật khi cả 10 bước xong.

## Epic 3 — Sơ đồ pipeline (drawio)
- 🟢 3.1 `pipeline_tong_the.drawio` — quy trình NC định lượng: câu hỏi → thiết kế → mẫu → thu thập → làm sạch → mô tả → suy luận → báo cáo (dùng ở trang chủ + module 01)
- ⚪ 3.2 `pipeline_chon_kiem_dinh.drawio` — cây quyết định chọn kiểm định (đi cùng module 11)
- ⚪ 3.3 `pipeline_hoi_quy.drawio` — quy trình chẩn đoán hồi quy (module 09)
- ⚪ 3.4 `pipeline_lam_sach.drawio` — quy trình làm sạch dữ liệu SPSS cụ thể (module 03, theo Video 9 HNUE)

## Epic 4 — Bộ dữ liệu & liên kết
- ⚪ 4.1 Copy/link `.ipynb` từ `Lop_rieng_SPSS/notebooks` + `Lop_rieng_SPSS_v2_PISA2025/notebooks` vào `SPSS/data/`
- ⚪ 4.2 Copy `.sav`/`.sps` liên quan (bộ giả lập 240 HS + bộ PISA VN 195 trường/7368 HS)
- ⚪ 4.3 Trang mô tả từng bộ dữ liệu (biến số, nguồn, giấy phép) — dùng lại `tu_dien_bien.md` đã có
- ⚪ 4.4 Nút "Mở trong Google Colab" (raw githubusercontent link) + "Xem trên nbviewer"

## Epic 5 — Ngân hàng câu hỏi/đề thi 3 ngôn ngữ
- ⚪ 5.1 12 module × 5 câu MCQ tiếng Việt (gốc, có đáp án + giải thích)
- ⚪ 5.2 Bản tiếng Anh (biên tập)
- ⚪ 5.3 Bản tiếng Trung (máy dịch thô, ghi rõ)
- ⚪ 5.4 Script audit bias (vị trí đáp án đúng, độ dài, order pre-sorted) chạy trên cả 3 bộ
- ⚪ 5.5 Trang "Đề thi tổng hợp" ngẫu nhiên hoá theo `Random(seed)` cố định để chấm lại được

## Epic 6 — Kiểm thử & triển khai
- 🟢 6.1 Deploy khung site lần đầu, xác nhận HTTP 200 thật trên production
- ⚪ 6.2 Sau mỗi 2-3 module hoàn thành: build → puppeteer test → deploy → poll build status → curl xác nhận
- ⚪ 6.3 Kiểm tra responsive (điện thoại) cho toàn bộ trang chủ + 1 module mẫu
- ⚪ 6.4 Kiểm tra tất cả link nội bộ (không 404) bằng script quét

## Nguyên tắc xuyên suốt (đừng vi phạm ở bất kỳ module nào)
- KHÔNG bịa số liệu — mọi ví dụ số phải chạy ra từ dữ liệu thật đã có trong `Lop_rieng_SPSS*`.
- KHÔNG bịa nội dung sách — trích đúng trang/mục đã đọc trong PDF, ghi số trang.
- Bản tiếng Trung PHẢI ghi rõ là dịch máy tự động (không tự nhận là bản dịch người biên tập).
- Banner AI-generated + đường liên hệ góp ý đặt ở MỌI trang, không chỉ trang chủ.
