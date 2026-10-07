/* Từ điển thuật ngữ thống kê — dữ liệu nhúng trực tiếp (không fetch, chạy được cả khi mở file offline).
   Dùng chung cho: (1) thanh tìm kiếm ở header mọi trang (#site-search), (2) trang Từ điển đầy đủ
   (#glossary-root). Mỗi mục có id duy nhất, nhãn/giải thích ngắn/đầy đủ/ví dụ theo 3 ngôn ngữ.
   Bản VI viết đầy đủ nhất (đối tượng chính). Bản EN/ZH hiện chỉ có tên thuật ngữ + giải thích ngắn —
   sẽ bổ sung đầy đủ dần, xem ghi chú ở info-modal. */
(function(){
'use strict';

var G = [
{id:"tong-the-khung-mau-mau", module:"02", tags:["chọn mẫu"],
 vi:{term:"Tổng thể, khung mẫu, mẫu", short:"Ba tầng hay bị nhầm lẫn khi nói về 'mẫu nghiên cứu'.",
 full:"Tổng thể (population) là TOÀN BỘ nhóm muốn suy luận tới, trên lý thuyết — ví dụ \"toàn bộ học sinh 15 tuổi Việt Nam\". Khung mẫu (sampling frame) là danh sách THẬT mà nhà nghiên cứu có thể chọn mẫu từ đó — ví dụ danh sách trường Bộ GD&ĐT cung cấp cho OECD. Mẫu (sample) là tập con THỰC TẾ được đo. Ba tầng này không bao giờ trùng khít tuyệt đối với nhau: khung mẫu luôn hẹp hơn tổng thể lý thuyết (vì luôn có đối tượng \"lọt lưới\"), và mẫu luôn là một phần của khung mẫu.",
 example:"PISA 2025 Việt Nam: tổng thể lý thuyết = toàn bộ HS 15 tuổi cả nước; khung mẫu = danh sách trường Bộ cung cấp; mẫu thực tế = 195 trường, 7.368 học sinh."}},

{id:"sai-lech-bao-phu", module:"02", tags:["chọn mẫu", "bias"],
 vi:{term:"Sai lệch bao phủ (coverage error)", short:"Lỗ hổng xảy ra TRƯỚC khi chọn mẫu, vì khung mẫu không phủ hết tổng thể.",
 full:"Xảy ra khi khung mẫu bỏ sót một phần tổng thể — ví dụ một trường chưa kịp đăng ký vào hệ thống của Bộ thì \"vô hình\" với toàn bộ quy trình chọn mẫu sau này, dù vẫn thuộc tổng thể lý thuyết. Điểm quan trọng: chọn mẫu ngẫu nhiên HOÀN HẢO ở bước sau đó KHÔNG sửa được lỗi này, vì lỗi nằm ở chính danh sách dùng để chọn, không nằm ở cách chọn.",
 example:"Trường tư thục mới mở, chưa đăng ký với Bộ GD&ĐT → không nằm trong khung mẫu PISA, dù vẫn có học sinh 15 tuổi đang học."}},

{id:"chon-mau-xac-suat", module:"02", tags:["chọn mẫu"],
 vi:{term:"Chọn mẫu xác suất (probability sampling)", short:"Xác suất được chọn của mỗi đơn vị phải TÍNH ĐƯỢC — điều kiện để suy luận thống kê hợp lệ.",
 full:"Bốn kiểu chính: (1) Ngẫu nhiên đơn giản — random hoá toàn bộ khung mẫu; (2) Hệ thống — chọn cứ mỗi k đơn vị theo danh sách; (3) Phân tầng — chia khung theo đặc điểm liên quan trước, chọn ngẫu nhiên TRONG từng tầng, đảm bảo mọi nhóm có mặt đúng tỉ lệ; (4) Theo cụm/nhiều giai đoạn — chọn cả CỤM (vd một trường) rồi đo trong cụm đó, rẻ hơn về hậu cần nhưng kém chính xác hơn ở cùng cỡ mẫu. Đặc điểm chung bắt buộc: biết trước xác suất được chọn của mọi đơn vị.",
 example:"PISA dùng CẢ phân tầng (5 vùng) lẫn cụm (chọn trường, xác suất tỉ lệ quy mô trường) cùng lúc."}},

{id:"chon-mau-phi-xac-suat", module:"02", tags:["chọn mẫu"],
 vi:{term:"Chọn mẫu phi xác suất (non-probability sampling)", short:"Xác suất được chọn KHÔNG tính được — không dùng để suy luận chính xác ra cả tổng thể.",
 full:"Bốn kiểu phổ biến: Thuận tiện (lấy ai dễ tiếp cận nhất — hợp cho nghiên cứu khám phá sơ bộ); Có mục đích (chọn theo tiêu chí liên quan câu hỏi nghiên cứu — hợp khi cần chuyên gia/trường hợp điển hình); Định ngạch (đủ số lượng theo nhóm, không ngẫu nhiên trong nhóm — hợp khi thiếu khung mẫu đầy đủ); Quả cầu tuyết (người tham gia giới thiệu người tiếp theo — hợp cho quần thể hiếm, khó tiếp cận). Không phải \"sai\", chỉ là không nên khái quát hoá kết quả ra cả tổng thể.",
 example:"Lỗi hay gặp: khảo sát đúng lớp mình dạy (thuận tiện) rồi viết kết luận như áp dụng được cho 'sinh viên nói chung' — lỗi khái quát hoá quá mức."}},

{id:"sai-so-vs-sai-lech-chon-mau", module:"02", tags:["chọn mẫu", "bias"],
 vi:{term:"Sai số chọn mẫu vs sai lệch chọn mẫu", short:"Một cái do MAY RỦI (giảm được bằng tăng cỡ mẫu), một cái do LỖI HỆ THỐNG (không giảm được).",
 full:"Sai số chọn mẫu (sampling error): khác biệt tự nhiên giữa mẫu và tổng thể do may rủi ngẫu nhiên — tồn tại ngay cả khi chọn mẫu hoàn hảo, chỉ làm NHỎ LẠI được bằng cách tăng cỡ mẫu. Sai lệch chọn mẫu (sampling bias): lỗi có HỆ THỐNG trong chính quy trình chọn (vd sai lệch bao phủ) — tăng cỡ mẫu KHÔNG sửa được, chỉ làm kết quả sai \"chắc chắn\" hơn.",
 example:"Chọn mẫu bị lệch rồi khảo sát 10.000 người vẫn lệch y hệt khảo sát 100 người — chỉ là kết quả sai đó giờ trông 'đáng tin' hơn vì mẫu to."}},

{id:"co-mau-pilot", module:"02", tags:["cỡ mẫu"],
 vi:{term:"Cỡ mẫu pilot (nghiên cứu thử)", short:"Tối thiểu 12 quan sát/nhóm (Julious, 2005) trước khi tính cỡ mẫu chính thức.",
 full:"Nghiên cứu thử quy mô nhỏ chạy trước nghiên cứu chính, dùng để ƯỚC LƯỢNG độ lệch chuẩn (SD) hoặc cỡ hiệu ứng thật, làm đầu vào cho công thức tính cỡ mẫu chính thức. Julious (2005, Pharmaceutical Statistics) đề xuất tối thiểu 12 quan sát/nhóm — dưới ngưỡng này, SD ước lượng dao động quá lớn (có thể lệch quá 20% giá trị thật) để làm đầu vào đáng tin.",
 example:"Pilot 8 người/nhóm → SD ước lượng không đáng tin → cỡ mẫu chính thức tính từ đó có thể sai lệch nghiêm trọng."}},

{id:"co-hieu-ung-ky-vong-d", module:"02", tags:["cỡ mẫu", "effect size"],
 vi:{term:"Cỡ hiệu ứng kỳ vọng (d) — dùng để TÍNH cỡ mẫu", short:"Con số bạn ĐOÁN TRƯỚC (từ tài liệu/pilot), khác với d QUAN SÁT ĐƯỢC sau khi đã có dữ liệu thật.",
 full:"Đây là chỗ rất nhiều người học nhầm lẫn giữa HAI chữ \"d\" khác nhau xuất hiện ở hai thời điểm khác nhau của một nghiên cứu. (1) d KỲ VỌNG (expected/anticipated effect size): một con số bạn PHẢI ĐOÁN TRƯỚC khi còn chưa có dữ liệu, dùng làm đầu vào cho công thức tính cỡ mẫu cần thu thập — n xấp xỉ bằng (z-alpha/2 + z-beta)² × 2 / d². Lấy từ đâu? Từ tổng quan tài liệu (nghiên cứu tương tự trước đó đã tìm được hiệu ứng cỡ bao nhiêu) hoặc từ kết quả pilot. (2) d QUAN SÁT ĐƯỢC (observed effect size, Cohen's d): con số TÍNH RA sau khi đã thu thập đủ dữ liệu thật và chạy t-test, bằng (trung bình nhóm 1 trừ trung bình nhóm 2) chia độ lệch chuẩn gộp. Hai con số này có thể KHÁC NHAU — d kỳ vọng chỉ là một phỏng đoán có căn cứ để quyết định cần bao nhiêu người, còn d quan sát mới là sự thật rút ra từ chính nghiên cứu của bạn.",
 example:"Dự đoán trước (từ tài liệu): d kỳ vọng=0,5 → cần ~64 người/nhóm. Sau khi thu thập dữ liệu thật và chạy t-test: d quan sát được có thể ra 0,45 hoặc 0,6 — không nhất thiết đúng y hệt 0,5 đã đoán."}},

{id:"power-thong-ke", module:"02", tags:["cỡ mẫu", "power"],
 vi:{term:"Statistical power (năng lực thống kê)", short:"Xác suất phát hiện ĐÚNG một hiệu ứng THẬT, nếu nó thực sự tồn tại.",
 full:"Power = 1 − β (beta). Power=0,80 (chuẩn phổ biến) nghĩa là 80% cơ hội tìm ra hiệu ứng thật nếu nó có tồn tại, 20% rủi ro BỎ SÓT nó (sai lầm loại II). Bốn tham số quyết định power: (1) cỡ hiệu ứng thật của hiện tượng, (2) cỡ mẫu, (3) mức ý nghĩa alpha, (4) mức beta mong muốn. Cohen (1988) đề xuất coi sai lầm loại I nghiêm trọng gấp 4 lần loại II, ứng với α=0,05, β=0,20.",
 example:"Ước tính thô (α=0,05, power=0,80): tìm d=0,5 cần ~130 người; tìm r=0,5 chỉ cần ~30 người."}},

{id:"trong-so-mau", module:"02", tags:["chọn mẫu", "PISA"],
 vi:{term:"Trọng số mẫu (sample weight)", short:"Bù lại việc các đơn vị KHÔNG có 'quyền số' ngang nhau khi chọn mẫu theo cụm.",
 full:"Khi chọn mẫu theo cụm với xác suất TỈ LỆ VỚI QUY MÔ (vd trường lớn có xác suất được chọn cao hơn trường nhỏ), các đơn vị trong mẫu không đại diện cho số lượng NGANG NHAU trong tổng thể. Trọng số bù lại điều này khi phân tích — bỏ qua trọng số có thể làm méo kết quả, đặc biệt với biến tương quan mạnh với quy mô.",
 example:"PISA: biến W_NRASCHBWT dao động 1,0–617,2 — trường trọng số cao nhất đại diện số HS gấp 617 lần trường thấp nhất. EDULEAD không trọng số=0,7653 vs có trọng số=0,7874 (chênh nhỏ vì biến này không tương quan mạnh quy mô trường)."}},

{id:"gia-thuyet-h0-h1", module:"04", tags:["giả thuyết"],
 vi:{term:"Giả thuyết H0 và H1", short:"H0 = \"không có\" khác biệt/liên hệ; H1 = \"có\". Dùng từ \"được ủng hộ\", không dùng \"đúng/sai\".",
 full:"H0 (giả thuyết không — null hypothesis): phát biểu KHÔNG CÓ khác biệt/liên hệ/thay đổi — gánh nặng chứng minh đặt lên người nghiên cứu. H1 (giả thuyết thay thế): phát biểu CÓ — chỉ được ủng hộ khi H0 KHÔNG được ủng hộ. Cohen et al. khuyên dùng \"được ủng hộ / không được ủng hộ\", tránh \"bác bỏ/chấp nhận\" vì hai từ sau ngụ ý kết luận TUYỆT ĐỐI mà một nghiên cứu phạm vi giới hạn hiếm khi chứng minh được.",
 example:"H0: \"phương pháp dạy Dự án và Truyền thống cho kết quả như nhau\". H1: \"hai phương pháp cho kết quả khác nhau\"."}},

{id:"gia-thuyet-co-huong-phi-huong", module:"04", tags:["giả thuyết"],
 vi:{term:"Giả thuyết có hướng vs phi hướng", short:"Có hướng nêu rõ CHIỀU (\"cao hơn\"); phi hướng chỉ nói \"khác nhau\".",
 full:"Có hướng (directional): nêu rõ chiều của khác biệt, dùng kiểm định 1 đuôi (one-tailed) — toàn bộ 5% rủi ro dồn về một phía đã dự đoán TRƯỚC khi nhìn dữ liệu. Phi hướng (non-directional): chỉ nói \"có khác biệt\", dùng kiểm định 2 đuôi (two-tailed) — chia đôi rủi ro 2,5%/phía, cần bằng chứng mạnh hơn (97,5% một phía) để có ý nghĩa. Quan trọng: phải chọn loại TRƯỚC khi xem dữ liệu — chọn hướng SAU KHI đã thấy kết quả có lợi là không hợp lệ.",
 example:"Có hướng: \"nhóm Dự án đạt điểm CAO HƠN nhóm Truyền thống\". Phi hướng: \"hai nhóm có kết quả KHÁC NHAU\" (không nói ai hơn)."}},

{id:"khoang-tin-cay", module:"04", tags:["ước lượng"],
 vi:{term:"Khoảng tin cậy (Confidence Interval, CI)", short:"KHÔNG phải \"95% xác suất giá trị thật nằm trong khoảng này\" — mà là \"95% QUY TRÌNH đúng\".",
 full:"Công thức: CI95% = trung bình mẫu ± 1,96×SE, với SE (sai số chuẩn) = độ lệch chuẩn mẫu chia căn n; 1,96 là giá trị z ứng với 95% diện tích giữa phân phối chuẩn (2 đuôi). Cách hiểu ĐÚNG: nếu lặp lại lấy mẫu nhiều lần, ~95% các khoảng dựng ra theo đúng quy trình này sẽ chứa giá trị TRUNG BÌNH THẬT của tổng thể — đây là câu nói về độ tin cậy của QUY TRÌNH lặp lại, không phải xác suất của MỘT khoảng cụ thể đang cầm trong tay. Mẫu nhỏ → CI rộng (kém chính xác); mẫu lớn → CI hẹp hơn (chính xác hơn), vì SE giảm khi n tăng (Torgerson & Torgerson, 2008).",
 example:"CI95% điểm Toán (n=240) = [46,68; 49,14]. Diễn giải ĐÚNG: 95% các khoảng dựng theo cách này (nếu lặp lại lấy mẫu) chứa trung bình thật. Diễn giải SAI: \"95% xác suất trung bình thật nằm trong khoảng này\"."}},

{id:"skewness-kurtosis", module:"04", tags:["phân phối"],
 vi:{term:"Skewness (độ lệch) & Kurtosis (độ nhọn)", short:"Lệch dương: đuôi dài bên phải. Lệch âm: đuôi dài bên trái. Platykurtic: phẳng hơn chuẩn. Leptokurtic: nhọn hơn chuẩn.",
 full:"Quy tắc thực hành đánh giá \"lệch có ý nghĩa\": so skewness đo được với ±2×SE(skewness). Nếu |skewness| vượt ngưỡng này, có bằng chứng lệch phân phối đáng kể — ảnh hưởng tới việc chọn kiểm định tham số hay phi tham số ở các module sau.",
 example:"study_hours: skew=+0,658, SE=0,157 → ngưỡng [-0,314; +0,314] → 0,658 VƯỢT ngưỡng → lệch có ý nghĩa, khớp Shapiro-Wilk p<0,001. pretest: skew=-0,097, trong ngưỡng, Shapiro-Wilk p=0,117 → không đủ bằng chứng bác normality."}},

{id:"y-nghia-thong-ke", module:"04", tags:["p-value"],
 vi:{term:"Ý nghĩa thống kê (statistical significance)", short:"\"Kết quả mà ngẫu nhiên khó có thể giải thích được\" (Kirk, 1999) — KHÔNG đồng nghĩa \"quan trọng\".",
 full:"Ví dụ trực giác của Cohen et al.: nếu một mối quan hệ xuất hiện đúng 95/100 lần thử, 5 lần còn lại KHÔNG thấy — đó là mức ý nghĩa 0,05. Cỡ mẫu càng lớn, ngưỡng hệ số (r, d...) cần để đạt ý nghĩa càng NHỎ — ví dụ với n=8, cần r≥0,78 mới có ý nghĩa ở 0,05; với n=30, chỉ cần r≥0,36. CẢNH BÁO quan trọng nhất: \"statistically significant\" KHÔNG đồng nghĩa \"important\" — có thể tìm được tương quan có ý nghĩa thống kê giữa hai biến hoàn toàn không liên quan thực tế, nếu mẫu đủ lớn.",
 example:"p=0,065 (nhỉnh hơn 0,05) không nên vội kết luận \"không có khác biệt\" — ngưỡng 0,05 chỉ là quy ước tương đối, không phải ranh giới tuyệt đối."}},

{id:"dao-chieu-nhan-qua", module:"04", tags:["p-value", "nhân quả", "bẫy phổ biến"],
 vi:{term:"Đảo chiều nhân quả / sai lầm điều kiện bị đảo ngược", short:"Nhầm P(dữ liệu | giả thuyết) với P(giả thuyết | dữ liệu) — hai xác suất RẤT khác nhau, dù nghe giống.",
 full:"Đây là một trong những lỗi suy luận thống kê phổ biến và nguy hiểm nhất. p-value trả lời câu hỏi: \"Nếu H0 ĐÚNG, xác suất quan sát được dữ liệu (hoặc cực đoan hơn) là bao nhiêu?\" — ký hiệu P(dữ liệu | H0 đúng). Nhiều người vô tình đọc ngược thành: \"xác suất H0 đúng, biết dữ liệu này\" — P(H0 đúng | dữ liệu) — đây là CÂU HỎI KHÁC, và hai xác suất này KHÔNG bằng nhau. Carver (1978) minh hoạ bằng ví dụ dễ nhớ: xác suất một người CHẾT nếu bị treo cổ là rất cao, nhưng xác suất một người bị TREO CỔ nếu đã chết lại rất thấp (đa số người chết không phải vì bị treo cổ). Lỗi 'đảo chiều nhân quả' rộng hơn cũng xảy ra khi đọc một tương quan quan sát được rồi gán sai chiều nhân quả: thấy biến A và B cùng biến thiên, vội kết luận A gây ra B, trong khi chiều thật có thể ngược lại (B gây ra A), hoặc cả A và B cùng do một biến thứ ba C gây ra (gọi là 'confounding').",
 example:"Ví dụ kinh điển trong dịch tễ học ('confounding by indication'): quan sát thấy nhóm người đã tiêm đủ liều vắc-xin có tỷ lệ nhập viện/ICU cao hơn nhóm chưa tiêm. Kết luận ĐẢO CHIỀU SAI: \"vắc-xin làm cơ thể suy yếu, gây bệnh nặng\". Chiều nhân quả THẬT (biến thứ ba C = tình trạng sức khoẻ/tuổi/bệnh nền từ TRƯỚC): người có bệnh nền/nguy cơ cao vốn đã dễ nhập viện hơn TỪ ĐẦU — và CHÍNH VÌ nguy cơ cao đó, nhóm này được ưu tiên tiêm vắc-xin sớm nhất với tỷ lệ gần như 100%. Vậy 'nguy cơ sức khoẻ có sẵn' là biến thứ ba quyết định CẢ việc ai được ưu tiên tiêm (C→tiêm) LẪN ai có nguy cơ nhập viện cao (C→nhập viện) — không phải vắc-xin gây ra nhập viện. Bài học: trước khi tin một chiều nhân quả, luôn tự hỏi (1) chiều ngược lại có hợp lý không, (2) có biến thứ ba nào giải thích cả hai không."}},

{id:"type-i-type-ii-error", module:"04", tags:["sai lầm thống kê"],
 vi:{term:"Sai lầm loại I (α) & loại II (β)", short:"Loại I = dương tính giả (kết án oan). Loại II = âm tính giả (bỏ lọt).",
 full:"Sai lầm loại I (α): KHÔNG ủng hộ H0 khi H0 thực ra ĐÚNG — kết luận \"có khác biệt\" trong khi thực tế không có, giống kết án oan người vô tội. Sai lầm loại II (β): ỦNG HỘ H0 khi H0 thực ra SAI — bỏ sót một hiệu ứng có thật, giống bỏ lọt người có tội. Hai sai lầm này luôn ĐÁNH ĐỔI: giảm cái này (khắt khe hơn, giảm α) thường làm tăng cái kia (giảm power, tăng β), trừ khi tăng cỡ mẫu.",
 example:"Giảm α từ 0,05 xuống 0,01 (khắt khe hơn) → giảm rủi ro Type I nhưng tăng rủi ro Type II (dễ bỏ sót hiệu ứng thật hơn), nếu cỡ mẫu không đổi."}},

{id:"co-hieu-ung-effect-size", module:"04", tags:["effect size"],
 vi:{term:"Cỡ hiệu ứng (Effect size) — tên gọi không hoàn toàn chính xác", short:"Đo ĐỘ LỚN của khác biệt/liên hệ — điều p-value KHÔNG cho biết. Chữ \"effect\" không có nghĩa là đã chứng minh nhân quả.",
 full:"Cohen et al. tự lưu ý \"effect size\" là thuật ngữ không chính xác: chữ \"effect\" ngụ ý nhân quả, nhưng phép đo này KHÔNG chứng minh nhân quả, chỉ đo độ lớn liên hệ/khác biệt QUAN SÁT ĐƯỢC. Các loại phổ biến: Cohen's d (khác biệt 2 trung bình, chia SD gộp — dùng với t-test), Pearson r / r² (tương quan/hồi quy), Eta² (ANOVA). Thompson (2001) cảnh báo: đừng dùng ngưỡng nhỏ/vừa/lớn một cách máy móc — \"ngu ngốc theo một thước đo khác\" nếu áp dụng cứng nhắc không xét bối cảnh.",
 example:"Bảng ngưỡng (Cohen, tr.746): d — nhỏ 0,20/vừa 0,50/lớn 0,80. Pearson r — nhỏ 0,10/vừa 0,30/lớn 0,50. Eta² — nhỏ 0,01/vừa 0,06/lớn 0,14. Ví dụ thật: d=0,981 (mạnh) nhưng eta²=0,047 (nhỏ) CÙNG LÚC trên cùng dữ liệu — hai chỉ số đo hai khía cạnh khác nhau, không mâu thuẫn."}},

{id:"t-test-doc-lap-bat-cap", module:"05", tags:["t-test"],
 vi:{term:"T-test độc lập vs bắt cặp", short:"Độc lập: so 2 NHÓM KHÁC NHAU. Bắt cặp: so CÙNG một nhóm ở 2 thời điểm/điều kiện.",
 full:"T-test độc lập: dùng khi hai mẫu KHÔNG liên quan (hai nhóm người khác nhau), chìa khoá đọc kết quả SPSS là kiểm định Levene quyết định đọc dòng nào (\"Equal variances assumed\" hay \"not assumed\"). T-test bắt cặp: dùng khi so sánh CÙNG một nhóm ở hai điều kiện/thời điểm (vd trước/sau can thiệp) — mạnh hơn độc lập vì loại bỏ được biến thiên cá nhân, mỗi người tự làm \"đối chứng\" cho chính mình, nên nhạy hơn với cùng cỡ mẫu.",
 example:"Độc lập: so điểm Toán giữa Nam và Nữ (hai nhóm người khác nhau). Bắt cặp: so điểm pretest và posttest của CÙNG 240 học sinh."}},

{id:"levene-test", module:"05", tags:["t-test", "điều kiện"],
 vi:{term:"Kiểm định Levene", short:"Quyết định đọc dòng nào trong bảng t-test độc lập của SPSS.",
 full:"Kiểm tra giả định phương sai hai nhóm có ĐỒNG NHẤT hay không trước khi đọc t-test độc lập. Nếu Levene KHÔNG có ý nghĩa (p>0,05): phương sai coi là đồng nhất, đọc dòng \"Equal variances assumed\". Nếu Levene CÓ ý nghĩa (p<0,05): phương sai KHÔNG đồng nhất, phải đọc dòng \"Equal variances not assumed\". Đọc NHẦM dòng có thể đổi p-value đủ để đảo ngược kết luận (vd từ 0,044 'có ý nghĩa' sang 0,055 'không có ý nghĩa').",
 example:"Levene p=0,088 (gần 0,05 nhưng chưa vượt) → vẫn đọc dòng \"Equal variances assumed\", nhưng nên thận trọng/báo cáo cả hai dòng nếu p rất gần ngưỡng."}},

{id:"anova-f-ratio", module:"06", tags:["ANOVA"],
 vi:{term:"ANOVA & F-ratio", short:"So sánh TRUNG BÌNH từ 3+ nhóm bằng cách PHÂN TÍCH PHƯƠNG SAI — tên nghe mâu thuẫn nhưng cơ chế rất logic.",
 full:"ANOVA (Analysis of Variance) tách tổng biến thiên dữ liệu thành phần \"giữa nhóm\" (between-groups) và \"trong nhóm\" (within-groups), rồi so sánh qua F-ratio = phương sai giữa nhóm / phương sai trong nhóm. Nếu các nhóm khác nhau thật sự, biến thiên GIỮA nhóm sẽ lớn hơn hẳn biến thiên NỘI BỘ từng nhóm, làm F lớn lên. Vì sao không chạy nhiều t-test riêng lẻ cho từng cặp? Vì mỗi t-test mang 5% rủi ro sai lầm loại I, chạy nhiều lần làm rủi ro CỘNG DỒN — ANOVA kiểm tra \"có khác biệt ở đâu đó\" chỉ trong MỘT phép kiểm định.",
 example:"So điểm Toán giữa 3 trường: F(2,237)=5,87, p=0,003 → có khác biệt có ý nghĩa giữa ÍT NHẤT một cặp trường — nhưng CHƯA biết cặp nào, cần hậu kiểm Tukey."}},

{id:"tukey-hsd", module:"06", tags:["ANOVA", "hậu kiểm"],
 vi:{term:"Hậu kiểm Tukey HSD", short:"Trả lời câu hỏi ANOVA bỏ ngỏ: \"khác biệt nằm ở CẶP NHÓM nào?\"",
 full:"ANOVA chỉ nói \"CÓ khác biệt ở đâu đó\", không nói \"Ở ĐÂU\". Hậu kiểm (post hoc) như Tukey HSD so sánh TỪNG CẶP nhóm để xác định cặp nào khác biệt có ý nghĩa. Tukey yêu cầu phương sai đồng nhất và cỡ mẫu tương đối bằng nhau; Games-Howell là lựa chọn thay thế khi phương sai KHÔNG đồng nhất. Báo cáo chuẩn cần đủ CẢ HAI phần: giá trị F/df/p của ANOVA, VÀ kết quả Tukey chỉ rõ cặp nào khác biệt.",
 example:"3 trường A,B,C: Tukey cho A-B p=0,046 (có ý nghĩa), A-C p=0,0031 (có ý nghĩa), B-C p=0,427 (KHÔNG có ý nghĩa) → A khác biệt với cả B và C, nhưng B và C không khác nhau."}},

{id:"chi-square-bac-tu-do", module:"07", tags:["chi-square"],
 vi:{term:"Chi-square & bậc tự do (degrees of freedom)", short:"Chi-square đo liên hệ giữa 2 biến ĐỊNH DANH; bậc tự do = số giá trị còn \"tự do\" thay đổi.",
 full:"Chi-square dùng cho bảng chéo giữa hai biến định danh. Công thức tần số kỳ vọng mỗi ô = (Tổng hàng × Tổng cột) / Tổng chung. Quy tắc \"20%\": không quá 20% số ô được có ít hơn 5 quan sát, nếu vi phạm nặng (>25%) nên chuyển sang Fisher's Exact Test. Bậc tự do (df) cho bảng chéo = (số hàng−1)×(số cột−1) — trực giác: số lượng giá trị được TỰ DO thay đổi trước khi giá trị cuối cùng bị RÀNG BUỘC bởi tổng đã biết.",
 example:"4 số phải cộng = 20, biết 3 số đầu (5,6,4) → số thứ 4 BẮT BUỘC = 5, không còn tự do chọn → df=3 (3 số đầu tự do, số cuối bị ràng buộc)."}},

{id:"kiem-dinh-phi-tham-so", module:"07", tags:["phi tham số"],
 vi:{term:"Bộ 4 kiểm định phi tham số thay thế", short:"Mỗi kiểm định tham số có một \"anh em song sinh\" phi tham số, dùng khi dữ liệu không thoả điều kiện an toàn.",
 full:"Bảng tương ứng: T-test độc lập → Mann-Whitney U; T-test bắt cặp → Wilcoxon; ANOVA một chiều → Kruskal-Wallis; ANOVA đo lường lặp lại → Friedman. Điểm chung quan trọng: cả 4 kiểm định này CHỈ cho biết ý nghĩa thống kê, KHÔNG có cỡ hiệu ứng chuẩn đi kèm như Cohen's d hay eta² — một hạn chế thực sự so với nhánh tham số.",
 example:"Mann-Whitney đánh giá theo giới tính: U=6416, p=0,127 — không đủ bằng chứng khác biệt giữa nam và nữ."}},

{id:"pearson-r", module:"08", tags:["tương quan"],
 vi:{term:"Hệ số tương quan Pearson (r)", short:"Dấu = HƯỚNG, độ lớn = ĐỘ MẠNH. Chạy từ −1 đến +1, đo quan hệ TUYẾN TÍNH.",
 full:"Công thức: r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)²·Σ(yᵢ−ȳ)²]. Dấu dương: hai biến cùng tăng/giảm. Dấu âm: nghịch biến (một biến tăng, biến kia có xu hướng giảm) — KHÔNG có nghĩa \"yếu hơn\". r CHÍNH LÀ cỡ hiệu ứng, không cần tính riêng. r² (hệ số xác định) = % biến thiên của Y \"giải thích được\" bởi X qua quan hệ tuyến tính. Pearson r CHỈ đo quan hệ TUYẾN TÍNH — nếu quan hệ thật là đường CONG, r có thể ra gần 0 dù liên hệ rất rõ (xem mục \"Eta\").",
 example:"Giờ tự học vs điểm Toán (n=240): r=0,582, r²=0,338 → cỡ hiệu ứng LỚN, ≈34% biến thiên điểm Toán giải thích được bởi giờ tự học."}},

{id:"tuong-quan-rieng-phan", module:"08", tags:["tương quan"],
 vi:{term:"Tương quan riêng phần (partial correlation)", short:"Tính r giữa 2 biến SAU KHI loại bỏ ảnh hưởng của biến thứ 3.",
 full:"Công thức: r_XY·Z = (r_XY − r_XZ×r_YZ) / √[(1−r_XZ²)(1−r_YZ²)]. Dùng khi nghi ngờ một biến thứ ba Z đang \"trộn\" vào quan hệ 2 biến chính X,Y. Nếu Z không tương quan với cả X lẫn Y (r_XZ≈0, r_YZ≈0), công thức tự động cho r_XY·Z≈r_XY — gần như không đổi. Chỉ thay đổi MẠNH khi biến kiểm soát có liên hệ THẬT với cả hai biến kia.",
 example:"PISA: r(thiếu học liệu, điểm KH)=−0,039. Kiểm soát \"thiếu nhân sự\" (liên quan yếu với điểm KH, r≈0,002) → r riêng phần=−0,051, GẦN NHƯ KHÔNG đổi."}},

{id:"phi-eta-multiple-corr", module:"08", tags:["tương quan", "ít dùng"],
 vi:{term:"Phi coefficient, Eta (η), Multiple correlation (R)", short:"Ba độ đo liên hệ ít dùng hơn Pearson/Spearman, nhưng mỗi cái có đúng một tình huống riêng.",
 full:"Phi coefficient: dành cho hai biến \"nhị phân THẬT\" ở thang định danh (vd giới tính × đậu/rớt) — chỉ 2 giá trị theo bản chất, không do gộp nhóm. Eta (η): dùng khi quan hệ là PHI TUYẾN (đường cong) — so phương sai GIỮA các nhóm giá trị X với tổng phương sai Y, không bị \"triệt tiêu\" như Pearson r khi đường cong có cả đoạn tăng và giảm. Multiple correlation (R): đo mức một biến phụ thuộc được dự đoán từ TỔ HỢP TUYẾN TÍNH của 2+ biến độc lập — nền tảng khái niệm của hồi quy đa biến (Module 09).",
 example:"Căng thẳng~hiệu suất hình chữ U ngược: Pearson r có thể ra gần 0 dù liên hệ rất rõ, nhưng Eta vẫn phát hiện được vì không giả định đường thẳng."}},

{id:"tuong-quan-khong-phai-nhan-qua", module:"08", tags:["nhân quả", "bẫy phổ biến"],
 vi:{term:"Tương quan không phải nhân quả", short:"\"Bàn tay to tương quan bàn chân to\" không có nghĩa tay to GÂY RA chân to.",
 full:"Hai biến tương quan cao có thể do: (1) một GÂY RA biến kia; (2) chiều NGƯỢC LẠI mới đúng (xem mục \"đảo chiều nhân quả\"); (3) cả hai cùng do một BIẾN THỨ BA gây ra (confounding); hoặc (4) hoàn toàn TRÙNG HỢP ngẫu nhiên (spurious correlation), đặc biệt khi so sánh rất nhiều biến/nhiều năm dữ liệu. Trước khi diễn giải một tương quan là có ý nghĩa THỰC TIỄN, luôn tự hỏi: có biến thứ ba nào giải thích cả hai không? Thiết kế nghiên cứu (quan sát hay thực nghiệm có kiểm soát) có cho phép suy luận nhân quả không?",
 example:"\"Spurious Correlations\" (Tyler Vigen): số phim Nicolas Cage ra rạp/năm tương quan r>0,6 với số người chết đuối trong bể bơi Mỹ cùng năm — rõ ràng không nhân quả, chỉ là trùng hợp thống kê."}},

{id:"bon-thang-do", module:"01", tags:["thang đo"],
 vi:{term:"Bốn thang đo dữ liệu", short:"Định danh → Thứ bậc → Khoảng → Tỉ lệ — mỗi thang KẾ THỪA đặc điểm thang trước rồi thêm 1 đặc điểm mới.",
 full:"Định danh (nominal): chỉ phân loại (giới tính, loại trường) — chỉ đếm tần số/mode. Thứ bậc (ordinal): + có thứ tự lớn/nhỏ (thang Likert, xếp hạng) — thêm được trung vị/percentile. Khoảng (interval): + khoảng cách đều nhau nhưng KHÔNG có điểm 0 thật (nhiệt độ °C, điểm IQ) — thêm được trung bình/SD, KHÔNG lấy tỉ số. Tỉ lệ (ratio): + có điểm 0 thật (giờ tự học, điểm thi, tiền) — mọi phép tính đều hợp lệ kể cả tỉ số ('gấp đôi'). SPSS/PSPP gộp Khoảng+Tỉ lệ thành một loại gọi là 'Scale' vì hầu hết phép thống kê áp dụng như nhau cho cả hai.",
 example:"Không thể nói '100°F nóng gấp đôi 50°F' (thang khoảng, 0°F không phải 'không có nhiệt') — gấp đôi thật của 50°F là 68°F. Tương tự, IQ 150 KHÔNG 'thông minh gấp đôi' IQ 75."}},

{id:"tham-so-phi-tham-so", module:"01", tags:["thang đo"],
 vi:{term:"Dữ liệu tham số & phi tham số", short:"Tham số cần dữ liệu khoảng/tỉ lệ + phân phối chuẩn; phi tham số không đòi hỏi những điều kiện đó.",
 full:"Kiểm định tham số (t-test, ANOVA, Pearson r...) giả định dữ liệu ở thang khoảng/tỉ lệ VÀ xấp xỉ phân phối chuẩn — mạnh hơn (dễ phát hiện hiệu ứng thật hơn) nếu điều kiện được thoả. Kiểm định phi tham số (Mann-Whitney, Kruskal-Wallis, Spearman...) không đòi hỏi các điều kiện đó, dùng được cho dữ liệu thứ bậc hoặc lệch chuẩn nặng, nhưng thường kém mạnh hơn và thiếu cỡ hiệu ứng chuẩn đi kèm.",
 example:"Dữ liệu thứ bậc (xếp hạng học lực) hoặc lệch chuẩn nặng (vd thu nhập) → ưu tiên phi tham số."}},

{id:"xu-huong-trung-tam-phan-tan", module:"03", tags:["mô tả"],
 vi:{term:"Xu hướng trung tâm & độ phân tán", short:"Mode/Median/Mean đo \"trung tâm\"; SD/Range/IQR đo \"phân tán\" — không bao giờ chỉ báo cáo một mình trung bình.",
 full:"Mode (yếu vị): dùng cho mọi thang đo, đặc biệt định danh, bền với ngoại lai. Median (trung vị): dùng từ thứ bậc trở lên, bền với ngoại lai. Mean (trung bình, x̄=Σxᵢ/n): dùng cho khoảng/tỉ lệ, nhưng KHÔNG bền — dễ bị ngoại lai kéo lệch. Ba đo phân tán: SD (độ lệch chuẩn, s=√[Σ(xᵢ−x̄)²/(n−1)]) — trung bình khoảng cách mỗi điểm tới trung bình, chia n−1 (không phải n) để ước lượng không chệch (hiệu chỉnh Bessel); Range = max−min, rất nhạy ngoại lai; IQR = Q3−Q1, bền hơn range.",
 example:"3 tập số CÙNG trung bình=6 nhưng SD khác hẳn: tập có ngoại lai (giá trị 20) → SD=7,91, gấp 11 lần tập không có ngoại lai — minh chứng vì sao chỉ báo cáo trung bình là chưa đủ."}},

{id:"hoi-quy-don-da-bien", module:"09", tags:["hồi quy"],
 vi:{term:"Hồi quy tuyến tính đơn biến & đa biến", short:"Ŷ = a + b·X (đơn biến) hoặc Ŷ = a + b₁X₁ + b₂X₂ +... (đa biến) — khác tương quan ở chỗ có HƯỚNG dự đoán rõ ràng.",
 full:"Đơn biến: dựng đường thẳng dự đoán Y từ MỘT biến X. a (hệ số chặn) = giá trị Ŷ dự đoán khi X=0; b (hệ số góc/slope) = Y thay đổi bao nhiêu khi X tăng 1 đơn vị. R² giống hệt r² của Pearson r (cùng phép tính nền, khác cách trình bày). Đa biến: mở rộng sang NHIỀU biến độc lập cùng lúc — mỗi bₖ đo ảnh hưởng của biến đó khi GIỮ NGUYÊN tất cả biến còn lại trong mô hình (ceteris paribus).",
 example:"math = 35,58 + 2,51×study_hours (n=240). b=2,51 (SE=0,228, t=11,03, p<0,001). Lưu ý: học sinh thấp nhất thật sự học 0,5 giờ — không ai học 0 giờ, nên diễn giải a=35,58 (ngoại suy X=0) cần thận trọng."}},

{id:"beta-chuan-hoa", module:"09", tags:["hồi quy"],
 vi:{term:"Hệ số Beta chuẩn hoá (β)", short:"So sánh biến nào \"quan trọng\" hơn — hệ số B thô KHÔNG so sánh được giữa các biến khác đơn vị đo.",
 full:"β = b × (SD của X / SD của Y) — chuẩn hoá cả X và Y về cùng thang \"số độ lệch chuẩn\" (z-score), không còn đơn vị đo gốc, nên so sánh được giữa các biến có đơn vị khác nhau.",
 example:"B(study_hours)=2,49 'điểm/giờ' vs B(h1)=2,15 'điểm/mức Likert' — không so được trực tiếp. Nhưng β(study_hours)=0,577 vs β(h1)=0,229 → study_hours mạnh hơn HẲN, dù B thô chỉ hơn nhẹ."}},

{id:"vif-da-cong-tuyen", module:"09", tags:["hồi quy", "giả định"],
 vi:{term:"VIF & đa cộng tuyến (multicollinearity)", short:"VIF cao → biến độc lập \"trùng lặp thông tin\" với nhau, làm hệ số B không ổn định.",
 full:"VIF(Xᵢ) = 1/(1−R²ᵢ), với R²ᵢ = R² khi hồi quy CHÍNH biến Xᵢ theo TẤT CẢ biến độc lập còn lại trong mô hình. VIF cao (thường ngưỡng >5 hoặc >10 tuỳ quy ước) → đa cộng tuyến nghiêm trọng, hệ số B dao động mạnh khi thêm/bớt 1 quan sát — không đáng tin. Đây là 1 trong 4 giả định hồi quy cần kiểm tra, cùng với Durbin-Watson (sai số độc lập, lý tưởng gần 2), Shapiro-Wilk trên phần dư (chuẩn), và biểu đồ phần dư~giá trị dự đoán (homoscedasticity, tìm hình phễu).",
 example:"Mô hình thật: VIF cao nhất=1,02 (rất an toàn, ngưỡng <5). Durbin-Watson=2,05 (rất gần 2, đạt)."}},

{id:"efa-kmo-bartlett", module:"10", tags:["EFA"],
 vi:{term:"EFA: KMO, Bartlett, Factor loading, Eigenvalue", short:"Rút gọn NHIỀU biến quan sát thành MỘT SỐ ÍT khái niệm ẩn (nhân tố) — 2 kiểm tra bắt buộc trước khi chạy.",
 full:"KMO (Kaiser-Meyer-Olkin, 0-1): dữ liệu có đủ tương quan chung để \"đáng\" rút gọn thành nhân tố không — càng cao càng tốt. Kiểm định Bartlett: ma trận tương quan có khác ma trận đơn vị (biến hoàn toàn không tương quan) một cách có ý nghĩa không. Factor loading (λᵢⱼ): tương quan giữa biến quan sát i và nhân tố ẩn j, chạy -1 tới 1 giống hệ số tương quan, |λ|≥0,4-0,5 thường coi là \"tải rõ\". Communality (h²): tổng bình phương hệ số tải của 1 biến trên TẤT CẢ nhân tố — % biến thiên giải thích được. Eigenvalue >1 (tiêu chuẩn Kaiser) thường dùng để quyết định giữ bao nhiêu nhân tố.",
 example:"Dữ liệu thật (h1-h3, a1-a3, n=237): KMO=0,688 (tạm được), Bartlett χ²=313,28 p<0,001 (đạt). EFA 2 nhân tố xoay Varimax: items hứng thú (h1-h3) tải rõ lên Nhân tố 2 (0,60-0,75), items lo âu (a1-a3) tải rõ lên Nhân tố 1 (0,70-0,73). Eigenvalue NT1=2,21, NT2=1,73 (cả hai >1)."}},

{id:"phan-tich-cum", module:"10", tags:["cluster"],
 vi:{term:"Phân tích cụm (Cluster Analysis)", short:"Nhóm các ĐỐI TƯỢNG QUAN SÁT (không phải BIẾN) thành các nhóm có hồ sơ tương tự nhau — khác EFA.",
 full:"Bẫy dễ nhầm: EFA nhóm BIẾN lại ('các câu hỏi nào đo cùng một khái niệm?'); Cluster nhóm ĐỐI TƯỢNG lại ('các trường/người nào có hồ sơ giống nhau?'). Chỉ số Silhouette (đo mức tách biệt giữa các cụm, -1 tới 1, càng gần 1 càng tốt) thường dùng để chọn số cụm k tối ưu — nhưng tối ưu thống kê và khả năng DIỄN GIẢI ĐƯỢC đôi khi đánh đổi nhau.",
 example:"K-means trên 5 chỉ số WLE PISA (n=195): k=2 có Silhouette=0,252 (tốt nhất về mặt thống kê, chia 63/132 trường), nhưng k=3 (Silhouette=0,180, thấp hơn) lại cho câu chuyện diễn giải rõ hơn — đánh đổi kinh điển."}},

{id:"cronbach-alpha", module:"12", tags:["độ tin cậy"],
 vi:{term:"Độ tin cậy (Reliability) & Cronbach's Alpha", short:"Đo công cụ có NHẤT QUÁN không (đo lại có ra kết quả ổn định không) — KHÁC với việc đo có ĐÚNG hay không (độ giá trị).",
 full:"α = (k/(k−1)) × (1 − Σσᵢ²/σ²ₜ), với k=số item, Σσᵢ²=tổng phương sai từng item riêng lẻ, σ²ₜ=phương sai điểm tổng. α chạy 0-1, cao nghĩa là các item \"đồng hành\" chặt chẽ, đo cùng một khái niệm nhất quán. Ngưỡng phổ biến (không tuyệt đối): <0,60 kém, 0,60-0,70 tạm được, 0,70-0,80 chấp nhận được, 0,80-0,90 tốt, >0,90 xuất sắc (nhưng cũng có thể là dấu hiệu item TRÙNG LẶP quá mức). Item-total correlation và \"Alpha nếu xoá item\" giúp phát hiện item yếu kéo thấp độ tin cậy chung.",
 example:"Thang Hứng thú (h1,h2,h3, n=237-240): α=0,713 (chấp nhận được). Thang Lo âu (a1,a2,a3): α=0,759 (gần mức tốt)."}},

{id:"do-gia-tri-vs-tin-cay", module:"12", tags:["độ tin cậy", "validity"],
 vi:{term:"Độ giá trị (Validity) vs Độ tin cậy (Reliability)", short:"Tin cậy = đo NHẤT QUÁN. Giá trị = đo ĐÚNG thứ cần đo. Tin cậy cao KHÔNG đảm bảo giá trị cao.",
 full:"Một công cụ có thể RẤT nhất quán (đo đi đo lại ra cùng kết quả, Cronbach's α cao) nhưng vẫn đo SAI khái niệm cần đo — ví dụ một cái cân bị lệch luôn cho cùng một số sai, rất 'nhất quán' nhưng không 'đúng'. Ngược lại, độ giá trị cao đòi hỏi độ tin cậy ở mức tối thiểu chấp nhận được (không thể đo ĐÚNG nếu kết quả đo lại mỗi lần một khác). Độ tin cậy là điều kiện CẦN nhưng chưa ĐỦ cho độ giá trị.",
 example:"Thang đo 'lo âu' có α=0,759 (nhất quán tốt) — nhưng nếu các câu hỏi thực ra đang đo 'căng thẳng' chứ không phải 'lo âu' thuần tuý, độ giá trị vẫn có vấn đề dù độ tin cậy cao."}},

{id:"percentR-bat-doi-xung", module:"08", tags:["tương quan", "ít dùng"],
 vi:{term:"%R và phần trăm khác biệt (đo bất đối xứng)", short:"Khác Pearson r (luôn ĐỐI XỨNG), hai chỉ số này đổi chiều tính sẽ ra câu hỏi KHÁC, không phải lỗi.",
 full:"Dùng cho 2 biến định danh khi không cần/không thể tính hệ số tương quan chuẩn. %R = tỉ số phần trăm giữa hai nhóm ở cùng hạng mục. Đặc điểm BẤT ĐỐI XỨNG: đổi chiều tính (vd 14/63 thay vì 63/14) vẫn là phép tính hợp lệ, chỉ đang hỏi câu khác — khác hẳn Pearson r, nơi r(X,Y) LUÔN bằng r(Y,X) (đối xứng).",
 example:"Thư viện: 63% lao động không-hội-viên, 14% trung lưu không-hội-viên → %R=63/14=4,5 (lao động nhiều gấp 4,5 lần trung lưu). Đổi chiều 14/63≈0,22 vẫn đúng, chỉ là so sánh ngược lại."}},
];

var LANG_UI = {
  vi: {placeholder:"🔍 Tra cứu thuật ngữ (VI/EN/中文)...", noresult:"Không tìm thấy — thử từ khoá khác hoặc xem toàn bộ", viewall:"Xem toàn bộ Từ điển →", resultsFor:"Kết quả cho", glossaryTitle:"📖 Từ điển thuật ngữ thống kê", glossaryLead:"Tra cứu mọi khái niệm đã dùng trong 12 module — mỗi mục có giải thích ngắn (đọc nhanh) và đầy đủ (bấm mở). Không tìm thấy khái niệm nào? Dùng form góp ý ở icon ⓘ góc trên để báo, sẽ bổ sung ngay.", searchPlaceholderPage:"Gõ để lọc (vd: 'p-value', 'cỡ mẫu', 'tương quan'...)", noneFound:"Không tìm thấy thuật ngữ khớp.", seeMore:"Xem đầy đủ ▾", seeLess:"Thu gọn ▴", example:"Ví dụ", fallback:"⚠️ Bản dịch đầy đủ đang được bổ sung — nội dung chi tiết dưới đây tạm hiện bằng tiếng Việt."},
  en: {placeholder:"🔍 Search glossary (VI/EN/中文)...", noresult:"No match — try another term or view all", viewall:"View full Glossary →", resultsFor:"Results for", glossaryTitle:"📖 Statistics Glossary", glossaryLead:"Look up every concept used across the 12 modules — short explanation (quick read) plus full detail (click to expand). Vietnamese-first content; English definitions are being expanded progressively.", searchPlaceholderPage:"Type to filter (e.g. 'p-value', 'sample size', 'correlation'...)", noneFound:"No matching term found.", seeMore:"Show more ▾", seeLess:"Collapse ▴", example:"Example", fallback:"⚠️ Full English translation is still being added — the detail below is shown in Vietnamese for now."},
  zh: {placeholder:"🔍 搜索词典 (VI/EN/中文)...", noresult:"未找到 — 试试其他词或查看全部", viewall:"查看完整词典 →", resultsFor:"搜索结果", glossaryTitle:"📖 统计学术语词典", glossaryLead:"查阅12个模块中使用的所有概念 — 简短解释（快速阅读）加完整说明（点击展开）。本词典以越南语内容为主，英文/中文释义正在逐步补充中（机器翻译，仅供参考）。", searchPlaceholderPage:"输入以筛选（例如 'p-value'、'样本量'、'相关'...）", noneFound:"未找到匹配的术语。", seeMore:"展开 ▾", seeLess:"收起 ▴", example:"示例", fallback:"⚠️ 完整中文翻译仍在补充中 — 以下详细内容暂以越南语显示。"}
};

// EN/ZH: term-name + short gloss only for now (progressive translation) — fallback to VI full text if missing.
var EN_SHORT = {
 "tong-the-khung-mau-mau":{term:"Population, sampling frame, sample", short:"Three levels often confused when talking about a 'research sample'."},
 "sai-lech-bao-phu":{term:"Coverage error", short:"A gap that exists BEFORE sampling happens, because the frame doesn't cover the whole population."},
 "chon-mau-xac-suat":{term:"Probability sampling", short:"Every unit's selection probability must be known — required for valid statistical inference."},
 "chon-mau-phi-xac-suat":{term:"Non-probability sampling", short:"Selection probability is unknown — not suitable for generalizing to the whole population."},
 "sai-so-vs-sai-lech-chon-mau":{term:"Sampling error vs sampling bias", short:"One is due to CHANCE (fixed by bigger samples), the other is a SYSTEMATIC flaw (not fixed by sample size)."},
 "co-mau-pilot":{term:"Pilot sample size", short:"Minimum 12 observations/group (Julious, 2005) before computing the formal sample size."},
 "co-hieu-ung-ky-vong-d":{term:"Expected effect size (d) — for sample-size planning", short:"A value you GUESS beforehand (from literature/pilot), different from the OBSERVED d after collecting data."},
 "power-thong-ke":{term:"Statistical power", short:"The probability of correctly detecting a real effect, if one truly exists."},
 "trong-so-mau":{term:"Sample weight", short:"Corrects for units NOT having equal 'weight' when sampling was done by cluster."},
 "gia-thuyet-h0-h1":{term:"Null (H0) and alternative (H1) hypotheses", short:"H0 = 'no' difference/relationship; H1 = 'there is'. Use 'supported/not supported', not 'true/false'."},
 "gia-thuyet-co-huong-phi-huong":{term:"Directional vs non-directional hypothesis", short:"Directional states a direction ('higher'); non-directional just says 'different'."},
 "khoang-tin-cay":{term:"Confidence Interval (CI)", short:"NOT '95% probability the true value is in this interval' — it's '95% of the PROCESS is correct'."},
 "skewness-kurtosis":{term:"Skewness & Kurtosis", short:"Positive skew: long right tail. Negative skew: long left tail. Platykurtic: flatter than normal. Leptokurtic: more peaked."},
 "y-nghia-thong-ke":{term:"Statistical significance", short:"'A result chance is unlikely to explain' (Kirk, 1999) — NOT the same as 'important'."},
 "dao-chieu-nhan-qua":{term:"Reversed causation / reversed-conditional fallacy", short:"Confusing P(data | hypothesis) with P(hypothesis | data) — two very different probabilities."},
 "type-i-type-ii-error":{term:"Type I (α) and Type II (β) errors", short:"Type I = false positive (wrongful conviction). Type II = false negative (letting it slip)."},
 "co-hieu-ung-effect-size":{term:"Effect size — an imperfect name", short:"Measures the SIZE of a difference/relationship — what the p-value alone doesn't tell you."},
 "t-test-doc-lap-bat-cap":{term:"Independent vs paired t-test", short:"Independent: compares two DIFFERENT groups. Paired: compares the SAME group at two time points/conditions."},
 "levene-test":{term:"Levene's test", short:"Decides which row to read in SPSS's independent-samples t-test table."},
 "anova-f-ratio":{term:"ANOVA & F-ratio", short:"Compares means of 3+ groups by analyzing VARIANCE — the name sounds contradictory but the logic is sound."},
 "tukey-hsd":{term:"Tukey HSD post-hoc test", short:"Answers the question ANOVA leaves open: 'which PAIR of groups differs?'"},
 "chi-square-bac-tu-do":{term:"Chi-square & degrees of freedom", short:"Chi-square measures association between 2 categorical variables; df = number of values still 'free' to vary."},
 "kiem-dinh-phi-tham-so":{term:"Four non-parametric alternatives", short:"Every parametric test has a non-parametric 'twin', used when data fails the safety assumptions."},
 "pearson-r":{term:"Pearson correlation coefficient (r)", short:"Sign = direction, magnitude = strength. Ranges −1 to +1, measures LINEAR relationships."},
 "tuong-quan-rieng-phan":{term:"Partial correlation", short:"Correlation between 2 variables AFTER removing the influence of a third variable."},
 "phi-eta-multiple-corr":{term:"Phi coefficient, Eta (η), Multiple correlation (R)", short:"Three less-common association measures, each suited to one specific situation."},
 "tuong-quan-khong-phai-nhan-qua":{term:"Correlation is not causation", short:"'Big hands correlate with big feet' doesn't mean big hands CAUSE big feet."},
 "percentR-bat-doi-xung":{term:"%R and percentage difference (asymmetric measures)", short:"Unlike Pearson r (always SYMMETRIC), reversing these gives a DIFFERENT question, not an error."},
};
var ZH_SHORT = {
 "tong-the-khung-mau-mau":{term:"总体、抽样框、样本", short:"谈论'研究样本'时经常混淆的三个层次。"},
 "sai-lech-bao-phu":{term:"覆盖误差", short:"在抽样之前就存在的缺口，因为抽样框没有覆盖整个总体。"},
 "chon-mau-xac-suat":{term:"概率抽样", short:"每个单位被选中的概率必须已知 — 这是有效统计推断的前提。"},
 "chon-mau-phi-xac-suat":{term:"非概率抽样", short:"被选中的概率未知 — 不适合推广到整个总体。"},
 "sai-so-vs-sai-lech-chon-mau":{term:"抽样误差 vs 抽样偏差", short:"一个是由随机因素造成的（增加样本量可减少），另一个是系统性缺陷（增加样本量无法修正）。"},
 "co-mau-pilot":{term:"预试验样本量", short:"每组至少12个观测值（Julious, 2005），之后才能计算正式样本量。"},
 "co-hieu-ung-ky-vong-d":{term:"预期效应量（d）— 用于计算样本量", short:"收集数据前预先猜测的数值（来自文献/预试验），不同于收集数据后观测到的d值。"},
 "power-thong-ke":{term:"统计功效（Power）", short:"如果真实效应确实存在，正确检测到它的概率。"},
 "trong-so-mau":{term:"样本权重", short:"修正按群组抽样时各单位'权重'不相等的问题。"},
 "gia-thuyet-h0-h1":{term:"零假设(H0)与备择假设(H1)", short:"H0 = '没有'差异/关系；H1 = '有'。应使用'得到支持/未得到支持'，而非'对/错'。"},
 "gia-thuyet-co-huong-phi-huong":{term:"有方向假设 vs 无方向假设", short:"有方向假设说明方向（'更高'）；无方向假设只说'不同'。"},
 "khoang-tin-cay":{term:"置信区间（CI）", short:"不是'真值落在此区间内的概率为95%' — 而是'该流程本身95%可靠'。"},
 "skewness-kurtosis":{term:"偏度与峰度", short:"正偏：右尾长。负偏：左尾长。低峰态：比正态更平。高峰态：比正态更尖。"},
 "y-nghia-thong-ke":{term:"统计显著性", short:"'一个随机因素难以解释的结果'（Kirk, 1999）— 不等同于'重要'。"},
 "dao-chieu-nhan-qua":{term:"因果倒置 / 条件颠倒谬误", short:"将P(数据|假设)误认为P(假设|数据) — 这是两个非常不同的概率。"},
 "type-i-type-ii-error":{term:"第一类错误(α)与第二类错误(β)", short:"第一类 = 假阳性（冤枉无辜）。第二类 = 假阴性（放过真实效应）。"},
 "co-hieu-ung-effect-size":{term:"效应量 — 一个不完全准确的名称", short:"衡量差异/关系的大小 — 这是单看p值无法告诉你的信息。"},
 "t-test-doc-lap-bat-cap":{term:"独立样本t检验 vs 配对样本t检验", short:"独立：比较两个不同的组。配对：比较同一组在两个时间点/条件下的情况。"},
 "levene-test":{term:"Levene方差齐性检验", short:"决定在SPSS独立样本t检验表格中应读哪一行。"},
 "anova-f-ratio":{term:"方差分析(ANOVA)与F比率", short:"通过分析方差来比较3组以上的均值 — 名称听起来矛盾，但逻辑合理。"},
 "tukey-hsd":{term:"Tukey HSD事后检验", short:"回答ANOVA未解决的问题：'差异具体在哪一对组之间？'"},
 "chi-square-bac-tu-do":{term:"卡方检验与自由度", short:"卡方检验衡量两个类别变量间的关联；自由度=仍可自由变化的数值个数。"},
 "kiem-dinh-phi-tham-so":{term:"四种非参数替代检验", short:"每个参数检验都有一个非参数'孪生兄弟'，用于数据不满足安全条件时。"},
 "pearson-r":{term:"皮尔逊相关系数(r)", short:"符号=方向，大小=强度。取值-1到+1，衡量线性关系。"},
 "tuong-quan-rieng-phan":{term:"偏相关", short:"在剔除第三变量影响后，两个变量之间的相关性。"},
 "phi-eta-multiple-corr":{term:"Phi系数、Eta(η)、复相关(R)", short:"三种较少使用的关联度量，各自适用于特定情况。"},
 "tuong-quan-khong-phai-nhan-qua":{term:"相关不等于因果", short:"'手大与脚大相关'不代表手大导致脚大。"},
 "percentR-bat-doi-xung":{term:"%R与百分比差异（非对称度量）", short:"与皮尔逊r（始终对称）不同，颠倒这些指标的方向会得到不同的问题，而非错误。"},
};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function getLang(){var m=location.pathname.match(/\/SPSS\/(vi|en|zh)\//);return m?m[1]:'vi'}
function entryFor(item, lang){
  if(lang==='vi') return item.vi;
  var map = lang==='en'?EN_SHORT:ZH_SHORT;
  var s = map[item.id];
  if(!s) return item.vi; // fallback: VI content better than nothing
  return {term:s.term, short:s.short, full:null, example:null};
}
function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function searchTerms(q, lang, limit){
  limit = limit || 10;
  q = norm(q);
  if(!q) return [];
  var tokens = q.split(/\s+/).filter(Boolean);
  var scored = [];
  G.forEach(function(item){
    var e = entryFor(item, lang);
    var ven = item.vi, en = EN_SHORT[item.id], zh = ZH_SHORT[item.id];
    var termHay = norm([e.term, ven.term, en&&en.term, zh&&zh.term].join(' '));
    var fullHay = norm([e.term, e.short, e.full||'', ven.term, ven.short, ven.full, ven.example, en&&en.term, en&&en.short, zh&&zh.term, zh&&zh.short].join(' '));
    // Exact/substring match on the whole phrase (highest priority — handles "p-value", "cỡ mẫu" as one unit)
    if(fullHay.indexOf(q) >= 0){
      scored.push({item:item, entry:e, score: termHay.indexOf(q)===0 ? 0 : (termHay.indexOf(q)>=0 ? 1 : 2)});
      return;
    }
    // Token-based match: "giải thích gần tương tự" — match if ALL tokens appear somewhere (any order),
    // so a query like "hieu ung ky vong" still finds "cỡ hiệu ứng kỳ vọng (d)" even out of exact phrase order.
    var allTokensFound = tokens.every(function(t){ return fullHay.indexOf(t) >= 0 });
    if(allTokensFound && tokens.length > 1){
      scored.push({item:item, entry:e, score: 3});
      return;
    }
    // Loosest fallback: at least one meaningful token (len>=3) matches, for partial/approximate queries
    var anyTokenFound = tokens.some(function(t){ return t.length>=3 && fullHay.indexOf(t) >= 0 });
    if(anyTokenFound){
      scored.push({item:item, entry:e, score: 4});
    }
  });
  scored.sort(function(a,b){return a.score-b.score});
  return scored.slice(0,limit);
}

// ---------- Site-wide search bar (#site-search) ----------
function initSearchBar(){
  var input = document.getElementById('site-search');
  if(!input) return;
  var lang = getLang();
  var ui = LANG_UI[lang];
  input.placeholder = ui.placeholder;
  var box = document.getElementById('site-search-results');
  var glossaryHref = input.getAttribute('data-glossary-href') || 'glossary/index.html';
  function render(q){
    var results = searchTerms(q, lang);
    if(!q){ box.hidden = true; box.innerHTML=''; return; }
    box.hidden = false;
    if(!results.length){
      box.innerHTML = '<div class="ssr-empty">'+esc(ui.noresult)+'</div><a class="ssr-viewall" href="'+glossaryHref+'">'+esc(ui.viewall)+'</a>';
      return;
    }
    box.innerHTML = results.map(function(r){
      return '<a class="ssr-item" href="'+glossaryHref+'#'+r.item.id+'"><b>'+esc(r.entry.term)+'</b><span>'+esc(r.entry.short)+'</span></a>';
    }).join('') + '<a class="ssr-viewall" href="'+glossaryHref+'">'+esc(ui.viewall)+'</a>';
  }
  input.addEventListener('input', function(){ render(input.value.trim()) });
  input.addEventListener('focus', function(){ if(input.value.trim()) render(input.value.trim()) });
  document.addEventListener('click', function(e){ if(!e.target.closest('.sitesearch')){ box.hidden = true } });
  input.addEventListener('keydown', function(e){
    if(e.key==='Enter'){
      var first = box.querySelector('.ssr-item');
      if(first) location.href = first.getAttribute('href');
    }
  });
}

// ---------- Full glossary page (#glossary-root) ----------
function initGlossaryPage(){
  var root = document.getElementById('glossary-root');
  if(!root) return;
  var lang = getLang();
  var ui = LANG_UI[lang];
  var search = document.getElementById('glossary-search');
  var titleEl = document.getElementById('glossary-title');
  var leadEl = document.getElementById('glossary-lead');
  if(titleEl) titleEl.textContent = ui.glossaryTitle;
  if(leadEl) leadEl.textContent = ui.glossaryLead;
  if(search) search.placeholder = ui.searchPlaceholderPage;

  function card(item){
    var e = entryFor(item, lang);
    var hasFull = e.full || item.vi.full;
    var fullText = lang==='vi' ? item.vi.full : (e.full || item.vi.full);
    var exampleText = lang==='vi' ? item.vi.example : (e.example || item.vi.example);
    var isFallback = lang!=='vi' && !e.full;
    var div = document.createElement('div');
    div.className = 'qitem glossary-card';
    div.id = item.id;
    div.innerHTML =
      '<div><span class="tag">Module '+item.module+'</span></div>'+
      '<h3 style="margin:.4em 0">'+esc(e.term)+'</h3>'+
      '<p>'+esc(e.short)+'</p>'+
      (isFallback ? '<p class="cap" style="color:var(--warn)">'+esc(ui.fallback)+'</p>' : '')+
      '<details class="slide-zoom" style="margin-top:.6em"><summary>'+ui.seeMore+'</summary><div class="slide-zoom-body">'+
        '<p>'+esc(fullText).replace(/\n/g,'<br/>')+'</p>'+
        (exampleText ? '<div class="callout good"><b>'+ui.example+':</b> '+esc(exampleText)+'</div>' : '')+
      '</div></details>';
    return div;
  }
  function renderList(items){
    root.innerHTML = '';
    if(!items.length){ root.innerHTML = '<p class="cap">'+esc(ui.noneFound)+'</p>'; return; }
    items.forEach(function(item){ root.appendChild(card(item)) });
  }
  renderList(G);
  if(search){
    search.addEventListener('input', function(){
      var q = search.value.trim();
      if(!q){ renderList(G); return; }
      var results = searchTerms(q, lang, /*limit*/ 999);
      renderList(results.map(function(r){ return r.item }));
    });
  }
  // jump to anchored term if URL has #id (from search bar click)
  if(location.hash){
    setTimeout(function(){
      var target = document.getElementById(location.hash.slice(1));
      if(target){ target.scrollIntoView({behavior:'smooth', block:'center'}); var det=target.querySelector('details'); if(det) det.open=true }
    }, 150);
  }
}

window.GLOSSARY_DATA = G; // expose for debugging/tests
document.addEventListener('DOMContentLoaded', function(){ initSearchBar(); initGlossaryPage(); });
})();
