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
 nomNa:"Giống như muốn biết \"người Việt Nam thích gì\" (tổng thể = cả nước), bạn chỉ có trong tay danh bạ của 1 công ty khảo sát (khung mẫu = danh sách THẬT có thể liên hệ), và cuối cùng chỉ 500 người trả lời (mẫu = số người THỰC SỰ được hỏi).",
 full:"Tổng thể (population) là TOÀN BỘ nhóm muốn suy luận tới, trên lý thuyết. Khung mẫu (sampling frame) là danh sách THẬT mà nhà nghiên cứu có thể chọn mẫu từ đó. Mẫu (sample) là tập con THỰC TẾ được đo. Ba tầng này không bao giờ trùng khít tuyệt đối với nhau: khung mẫu luôn hẹp hơn tổng thể lý thuyết (vì luôn có đối tượng \"lọt lưới\"), và mẫu luôn là một phần của khung mẫu. Bảng dưới so sánh 2 ngành khác hẳn nhau để thấy 3 tầng này áp dụng được cho MỌI loại nghiên cứu, không riêng gì giáo dục.",
 tableHtml:
  '<table class="t"><tr><th>Tầng</th><th>Ngành Giáo dục (site này — PISA)</th><th>Ngành Y tế (minh hoạ)</th></tr>'+
  '<tr><td><b>Tổng thể</b></td><td>Toàn bộ học sinh 15 tuổi Việt Nam</td><td>Toàn bộ bệnh nhân tiểu đường type 2 tại VN</td></tr>'+
  '<tr><td><b>Khung mẫu</b></td><td>Danh sách trường Bộ GD&ĐT cung cấp cho OECD</td><td>Danh sách bệnh nhân đã đăng ký khám tại 50 bệnh viện tham gia nghiên cứu</td></tr>'+
  '<tr><td><b>Mẫu</b></td><td>195 trường, 7.368 học sinh thực tế được đo (PISA 2025 VN)</td><td>1.200 bệnh nhân đồng ý tham gia thử nghiệm thuốc</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Lưu ý: cột Y tế là VÍ DỤ MINH HOẠ (số liệu giả định để dễ hình dung cấu trúc 3 tầng), không phải dữ liệu thật của khoá học — chỉ cột Giáo dục bên trái là số liệu PISA thật đã dùng xuyên suốt site.</p>',
 example:"Bệnh viện chỉ có hồ sơ bệnh nhân ĐÃ TỪNG khám ở đó — bệnh nhân chưa bao giờ đi khám (dù mắc bệnh) sẽ không nằm trong khung mẫu, dù vẫn thuộc tổng thể lý thuyết 'toàn bộ người mắc bệnh'. Giống hệt cơ chế sai lệch bao phủ ở mục kế tiếp."}},

{id:"sai-lech-bao-phu", module:"02", tags:["chọn mẫu", "bias"],
 vi:{term:"Sai lệch bao phủ (coverage error)", short:"Lỗ hổng xảy ra TRƯỚC khi chọn mẫu, vì khung mẫu không phủ hết tổng thể.",
 nomNa:"Giống như muốn mời cả xóm đi họp nhưng chỉ có danh sách những nhà ĐÃ ĐĂNG KÝ hộ khẩu — nhà nào ở trọ không đăng ký sẽ không bao giờ nhận được thư mời, dù họ vẫn sống trong xóm.",
 full:"Xảy ra khi khung mẫu bỏ sót một phần tổng thể. Điểm quan trọng nhất cần nhớ: chọn mẫu ngẫu nhiên HOÀN HẢO ở bước sau đó KHÔNG sửa được lỗi này, vì lỗi nằm ở chính danh sách dùng để chọn (bước chuẩn bị), không nằm ở cách chọn (bước thực hiện) — hai bước khác nhau, một bước hỏng thì bước kia không cứu được.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Ai "lọt lưới" khỏi khung mẫu?</th><th>Hậu quả nếu bỏ qua</th></tr>'+
  '<tr><td><b>Giáo dục</b> (site này)</td><td>Trường tư thục mới mở, chưa đăng ký với Bộ GD&ĐT</td><td>Kết luận PISA có thể thiên lệch về phía trường công lâu năm</td></tr>'+
  '<tr><td><b>Khảo sát xã hội</b> (minh hoạ)</td><td>Khảo sát qua điện thoại cố định bỏ sót người chỉ dùng di động/không có điện thoại</td><td>Mẫu thiên về nhóm lớn tuổi, thu nhập cao hơn thực tế dân số</td></tr>'+
  '<tr><td><b>Y tế công cộng</b> (minh hoạ)</td><td>Khung mẫu lấy từ hồ sơ bảo hiểm y tế, bỏ sót người không có bảo hiểm</td><td>Ước lượng tỷ lệ bệnh có thể thấp hơn thực tế (người không bảo hiểm thường khó tiếp cận y tế hơn)</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Hai dòng dưới là ví dụ minh hoạ kinh điển trong thống kê khảo sát (không phải số liệu của khoá học này), dùng để thấy sai lệch bao phủ xuất hiện ở MỌI ngành, không chỉ giáo dục.</p>',
 example:"Ví dụ lịch sử nổi tiếng nhất về sai lệch bao phủ: cuộc thăm dò bầu cử Mỹ 1936 của tạp chí Literary Digest — khung mẫu lấy từ danh bạ điện thoại và chủ xe hơi (khi đó là tầng lớp khá giả), bỏ sót phần lớn người nghèo → dự đoán SAI hoàn toàn người thắng cử, dù cỡ mẫu rất lớn (2,4 triệu người). Bài học: mẫu TO không cứu được khung mẫu LỆCH."}},

{id:"chon-mau-xac-suat", module:"02", tags:["chọn mẫu"],
 vi:{term:"Chọn mẫu xác suất (probability sampling)", short:"Xác suất được chọn của mỗi đơn vị phải TÍNH ĐƯỢC — điều kiện để suy luận thống kê hợp lệ.",
 nomNa:"Giống như rút thăm trúng thưởng CÔNG BẰNG: mọi vé đều có cơ hội được rút, và bạn BIẾT TRƯỚC xác suất trúng của mỗi vé là bao nhiêu (vd 1/1000) — không phải ban tổ chức tự ý chọn ai đó theo ý thích.",
 full:"Đặc điểm chung bắt buộc của cả 4 kiểu: biết trước xác suất được chọn của mọi đơn vị. Bảng dưới liệt kê đủ 4 kiểu, kèm cách làm cụ thể VÀ ví dụ ở 2 ngành khác hẳn nhau để thấy cùng 1 kỹ thuật áp dụng được rộng rãi.",
 tableHtml:
  '<table class="t"><tr><th>Kiểu</th><th>Cách làm</th><th>Ví dụ Giáo dục (PISA, thật)</th><th>Ví dụ Kinh doanh (minh hoạ)</th></tr>'+
  '<tr><td><b>Ngẫu nhiên đơn giản</b></td><td>Random hoá toàn bộ khung mẫu</td><td>Bốc thăm ngẫu nhiên học sinh từ danh sách toàn trường</td><td>Bốc ngẫu nhiên 500 khách hàng từ database 50.000 người để khảo sát hài lòng</td></tr>'+
  '<tr><td><b>Hệ thống</b></td><td>Chọn cứ mỗi k đơn vị theo danh sách</td><td>Chọn học sinh thứ 10, 20, 30... theo sổ điểm danh</td><td>Kiểm tra chất lượng cứ sản phẩm thứ 50 trên dây chuyền</td></tr>'+
  '<tr><td><b>Phân tầng</b></td><td>Chia khung theo đặc điểm liên quan, chọn ngẫu nhiên TRONG từng tầng</td><td>PISA: chia 5 vùng địa lý trước khi chọn trường</td><td>Chia khách hàng theo 3 phân khúc chi tiêu (thấp/vừa/cao) trước khi khảo sát mỗi phân khúc riêng</td></tr>'+
  '<tr><td><b>Theo cụm/nhiều giai đoạn</b></td><td>Chọn cả CỤM rồi đo trong cụm đó</td><td>PISA: chọn trường (cụm) trước, rồi chọn HS trong trường</td><td>Chọn 20 chi nhánh ngân hàng (cụm) ngẫu nhiên, khảo sát TẤT CẢ nhân viên trong 20 chi nhánh đó</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Cột Kinh doanh là ví dụ minh hoạ (giả định) để thấy cùng kỹ thuật dùng được ngoài giáo dục — số liệu PISA ở cột Giáo dục mới là dữ liệu thật của khoá học.</p>',
 example:"PISA dùng CẢ phân tầng (5 vùng) LẪN cụm (chọn trường, xác suất tỉ lệ quy mô trường) CÙNG LÚC — đúng định nghĩa 'phân tầng nhiều giai đoạn theo cụm', không phải chỉ 1 kỹ thuật đơn lẻ."}},

{id:"chon-mau-phi-xac-suat", module:"02", tags:["chọn mẫu"],
 vi:{term:"Chọn mẫu phi xác suất (non-probability sampling)", short:"Xác suất được chọn KHÔNG tính được — không dùng để suy luận chính xác ra cả tổng thể.",
 nomNa:"Giống như phỏng vấn \"người qua đường\" trên phố để làm phóng sự — nhanh, tiện, nhưng KHÔNG thể nói \"kết quả này đại diện cho cả thành phố\", vì bạn chỉ hỏi được ai TÌNH CỜ đi ngang qua đúng lúc đó.",
 full:"Không phải \"sai\", chỉ là không nên khái quát hoá kết quả ra cả tổng thể. Bảng dưới nêu đủ 4 kiểu kèm ví dụ ở 2 ngành để thấy mỗi kiểu có đúng một tình huống \"hợp lý nhất\" riêng.",
 tableHtml:
  '<table class="t"><tr><th>Kiểu</th><th>Cách làm</th><th>Ví dụ Giáo dục</th><th>Ví dụ Y tế/Tâm lý (minh hoạ)</th></tr>'+
  '<tr><td><b>Thuận tiện</b></td><td>Lấy đối tượng dễ tiếp cận nhất</td><td>Khảo sát đúng lớp mình đang dạy</td><td>Phỏng vấn bệnh nhân đang chờ khám tại 1 phòng khám cụ thể</td></tr>'+
  '<tr><td><b>Có mục đích</b></td><td>Chọn theo tiêu chí liên quan câu hỏi nghiên cứu</td><td>Chọn đúng 5 giáo viên dạy giỏi cấp tỉnh để phỏng vấn sâu</td><td>Chọn đúng bệnh nhân mắc 1 bệnh hiếm để nghiên cứu ca bệnh</td></tr>'+
  '<tr><td><b>Định ngạch</b></td><td>Đủ số lượng theo nhóm, không ngẫu nhiên trong nhóm</td><td>Phỏng vấn đúng 50 nam + 50 nữ sinh viên, ai gặp trước phỏng vấn trước</td><td>Phỏng vấn đúng tỷ lệ 30% người hút thuốc + 70% không hút tại một khu phố</td></tr>'+
  '<tr><td><b>Quả cầu tuyết</b></td><td>Người tham gia giới thiệu người tiếp theo</td><td>Phỏng vấn học sinh bỏ học, nhờ em giới thiệu bạn bỏ học khác</td><td>Nghiên cứu người nghiện ma tuý — người này giới thiệu người khác trong cùng nhóm</td></tr></table>',
 example:"Lỗi hay gặp nhất: khảo sát đúng lớp mình dạy (thuận tiện) rồi viết kết luận như áp dụng được cho 'sinh viên nói chung' — lỗi khái quát hoá quá mức (overgeneralization), xuất hiện trong rất nhiều luận văn/báo cáo thực tế vì người viết quên mất chọn mẫu của mình là phi xác suất."}},

{id:"sai-so-vs-sai-lech-chon-mau", module:"02", tags:["chọn mẫu", "bias"],
 vi:{term:"Sai số chọn mẫu vs sai lệch chọn mẫu", short:"Một cái do MAY RỦI (giảm được bằng tăng cỡ mẫu), một cái do LỖI HỆ THỐNG (không giảm được).",
 nomNa:"Bắn cung vào bia: nếu mũi tên rơi RẢI RÁC quanh tâm bia (lúc trái lúc phải) nhưng TRUNG BÌNH vẫn đúng tâm — đó là sai số chọn mẫu (do tay run, ngẫu nhiên). Nếu mũi tên LUÔN lệch về 1 phía dù bạn bắn rất chụm — đó là sai lệch chọn mẫu (ống ngắm bị lệch, lỗi hệ thống) — bắn thêm 1000 phát cũng không tự sửa được ống ngắm.",
 full:"Sai số chọn mẫu (sampling error): khác biệt tự nhiên giữa mẫu và tổng thể do may rủi ngẫu nhiên — tồn tại ngay cả khi chọn mẫu hoàn hảo, chỉ làm NHỎ LẠI được bằng cách tăng cỡ mẫu. Sai lệch chọn mẫu (sampling bias): lỗi có HỆ THỐNG trong chính quy trình chọn — tăng cỡ mẫu KHÔNG sửa được, chỉ làm kết quả sai \"chắc chắn\" hơn (số đẹp hơn nhưng vẫn sai).",
 tableHtml:
  '<table class="t"><tr><th></th><th>Sai số chọn mẫu (sampling error)</th><th>Sai lệch chọn mẫu (sampling bias)</th></tr>'+
  '<tr><td><b>Nguyên nhân</b></td><td>May rủi ngẫu nhiên khi lấy mẫu</td><td>Lỗi hệ thống trong quy trình (khung mẫu lệch, cách chọn lệch)</td></tr>'+
  '<tr><td><b>Có loại bỏ hoàn toàn được không?</b></td><td>Không, luôn tồn tại — chỉ LÀM NHỎ bằng tăng n</td><td>Có, bằng cách SỬA quy trình chọn (không liên quan n)</td></tr>'+
  '<tr><td><b>Tăng cỡ mẫu có giúp không?</b></td><td>CÓ — n lớn hơn → sai số nhỏ hơn (SE∝1/√n)</td><td>KHÔNG — n lớn hơn chỉ làm kết quả sai trông "chắc chắn" hơn</td></tr>'+
  '<tr><td><b>Ví dụ Giáo dục</b></td><td>Lấy 2 mẫu 200 HS khác nhau từ cùng 1 trường, trung bình điểm hơi khác nhau dù cùng quy trình chọn</td><td>Chỉ khảo sát học sinh lớp chọn (giỏi), bỏ qua lớp thường</td></tr>'+
  '<tr><td><b>Ví dụ Kinh tế (minh hoạ)</b></td><td>2 cuộc khảo sát thu nhập cùng phương pháp cho trung bình lệch nhau vài trăm nghìn đồng do may rủi mẫu</td><td>Khảo sát thu nhập chỉ qua app ngân hàng → bỏ sót người không dùng ngân hàng, thường có thu nhập thấp hơn</td></tr></table>',
 example:"Literary Digest 1936 (xem mục Sai lệch bao phủ) là ví dụ sai LỆCH hệ thống — 2,4 triệu người KHÔNG giúp sửa được lỗi khung mẫu lệch. Ngược lại, nếu khung mẫu đã đúng, lấy mẫu 2,4 triệu người NGẪU NHIÊN THẬT sẽ cho sai số chọn mẫu cực nhỏ."}},

{id:"co-mau-pilot", module:"02", tags:["cỡ mẫu"],
 vi:{term:"Cỡ mẫu pilot (nghiên cứu thử)", short:"Tối thiểu 12 quan sát/nhóm (Julious, 2005) trước khi tính cỡ mẫu chính thức.",
 nomNa:"Giống như nếm thử 1 thìa canh trước khi múc ra cả nồi cho khách — nhưng phải nếm ĐỦ THÌA (không phải chỉ 1 giọt) mới biết canh mặn/nhạt thế nào để còn nêm nếm tiếp cho đúng.",
 full:"Nghiên cứu thử quy mô nhỏ chạy TRƯỚC nghiên cứu chính, dùng để ƯỚC LƯỢNG độ lệch chuẩn (SD) hoặc cỡ hiệu ứng thật, làm đầu vào cho công thức tính cỡ mẫu chính thức (xem mục \"Cỡ hiệu ứng kỳ vọng\"). Julious (2005, <i>Pharmaceutical Statistics</i> — đúng tên tạp chí, gốc từ ngành dược/y sinh) đề xuất tối thiểu 12 quan sát/nhóm.",
 tableHtml:
  '<p>Vì sao đúng 12, không phải một số tròn khác? Vì sai số chuẩn của ĐỘ LỆCH CHUẨN ước lượng phụ thuộc vào cỡ mẫu theo quy luật xấp xỉ sau (Julious, 2005):</p>'+
  '<table class="t"><tr><th>Cỡ pilot mỗi nhóm</th><th>Sai số ước lượng SD (xấp xỉ)</th><th>Đủ tin cậy để tính cỡ mẫu chính thức?</th></tr>'+
  '<tr><td>5</td><td>có thể lệch &gt;30% giá trị thật</td><td>Không — quá rủi ro</td></tr>'+
  '<tr><td>12</td><td>lệch khoảng ±20%</td><td>Ngưỡng tối thiểu chấp nhận được</td></tr>'+
  '<tr><td>30</td><td>lệch khoảng ±13%</td><td>Tốt hơn hẳn nếu đủ nguồn lực</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Ứng dụng 2 ngành: Y sinh (gốc của Julious) — chạy thử thuốc mới trên 12 bệnh nhân trước khi xin cỡ mẫu đủ cho thử nghiệm lâm sàng chính thức (giai đoạn pha I/II nhỏ). Giáo dục (site này) — thử nghiệm phương pháp dạy mới trên 12-15 học sinh ở 1 lớp trước khi nhân rộng ra nhiều lớp/trường.</p>',
 example:"Pilot chỉ 8 người/nhóm → SD ước lượng không đáng tin (dưới ngưỡng 12) → cỡ mẫu chính thức TÍNH TỪ SD sai lệch đó có thể sai lệch nghiêm trọng — ví dụ tính ra cần 40 người nhưng thực chất cần 80."}},

{id:"co-hieu-ung-ky-vong-d", module:"02", tags:["cỡ mẫu", "effect size"],
 vi:{term:"Cỡ hiệu ứng kỳ vọng (d) — dùng để TÍNH cỡ mẫu", short:"Con số bạn ĐOÁN TRƯỚC (từ tài liệu/pilot), khác với d QUAN SÁT ĐƯỢC sau khi đã có dữ liệu thật.",
 nomNa:"Giống như trước khi đi chợ, bạn ƯỚC TÍNH cần mua bao nhiêu cân gạo (dựa vào kinh nghiệm/kinh nghiệm người khác) — đó là 'd kỳ vọng'. Về nhà cân lại thực tế đã ăn hết bao nhiêu — đó là 'd quan sát', có thể khác con số ước tính ban đầu.",
 full:"Đây là chỗ rất nhiều người học nhầm lẫn giữa HAI chữ \"d\" khác nhau xuất hiện ở HAI THỜI ĐIỂM khác nhau của một nghiên cứu: TRƯỚC khi thu thập dữ liệu (d kỳ vọng, dùng để quyết định cỡ mẫu) và SAU khi đã có dữ liệu (d quan sát, Cohen's d thật — xem mục \"Cỡ hiệu ứng (Effect size)\"). Công thức cỡ mẫu dùng d kỳ vọng: n ≈ (z<sub>α/2</sub> + z<sub>β</sub>)² × 2 / d².",
 tableHtml:
  '<table class="t"><tr><th>Giai đoạn</th><th>Tên gọi</th><th>Lấy từ đâu</th><th>Dùng để làm gì</th></tr>'+
  '<tr><td>TRƯỚC khi có dữ liệu</td><td>d kỳ vọng (anticipated)</td><td>Tổng quan tài liệu / pilot</td><td>Đưa vào công thức tính CẦN BAO NHIÊU người</td></tr>'+
  '<tr><td>SAU khi có dữ liệu</td><td>d quan sát (observed, Cohen\'s d)</td><td>Tính trực tiếp từ (x̄₁−x̄₂)/SD gộp</td><td>Báo cáo kết quả THẬT của nghiên cứu</td></tr></table>'+
  '<p style="margin-top:.8em"><b>Ví dụ 1 — Giáo dục (site này):</b> trước khi làm nghiên cứu so 2 phương pháp dạy, đọc 3 bài báo trước đó thấy hiệu ứng tương tự dao động d=0,4-0,6 → chọn d kỳ vọng=0,5 (thận trọng, lấy mức giữa) → tính ra cần ~64 người/nhóm. Sau khi thu thập dữ liệu thật và chạy t-test, d quan sát được = 0,98 (xem ví dụ tính tay ở mục \"Cỡ hiệu ứng\") — khác hẳn con số 0,5 đã đoán, vì phương pháp dạy MỚI thực ra hiệu quả hơn các nghiên cứu trước đó nhiều.</p>'+
  '<p><b>Ví dụ 2 — Y dược (minh hoạ):</b> trước khi thử thuốc hạ huyết áp mới, công ty dược tra cứu thuốc tương tự đã công bố d≈0,3 (hiệu ứng nhỏ-vừa) → dùng d=0,3 để tính cần ~175 bệnh nhân/nhóm cho thử nghiệm lâm sàng. Nếu thuốc mới THỰC SỰ hiệu quả hơn dự kiến, d quan sát sau thử nghiệm có thể lên 0,5 — khi đó nghiên cứu vẫn "đủ mạnh" (vì đã tính dư người theo d nhỏ hơn thực tế).</p>',
 example:"Nếu LỠ chọn d kỳ vọng QUÁ CAO (lạc quan quá mức) và thực tế d quan sát thấp hơn nhiều, nghiên cứu sẽ bị THIẾU người — không đủ power để phát hiện hiệu ứng thật, dù hiệu ứng đó CÓ tồn tại. Đây là lý do nhiều hướng dẫn khuyên chọn d kỳ vọng ở mức THẬN TRỌNG (hơi thấp hơn ước tính lạc quan nhất)."}},

{id:"power-thong-ke", module:"02", tags:["cỡ mẫu", "power"],
 vi:{term:"Statistical power (năng lực thống kê)", short:"Xác suất phát hiện ĐÚNG một hiệu ứng THẬT, nếu nó thực sự tồn tại.",
 nomNa:"Giống như một cái máy dò kim loại: power cao là máy NHẠY, dò ra đồng xu chôn sâu thật (hiệu ứng thật); power thấp là máy LỜ ĐỜ, có khi đồng xu ở ngay dưới đất mà máy không kêu (bỏ sót hiệu ứng thật — sai lầm loại II).",
 full:"Power = 1 − β. Power=0,80 (chuẩn phổ biến) nghĩa là 80% cơ hội tìm ra hiệu ứng thật nếu nó có tồn tại, 20% rủi ro BỎ SÓT (sai lầm loại II). Bốn tham số quyết định power — tăng BẤT KỲ cái nào trong 3 cái đầu đều làm power tăng:",
 tableHtml:
  '<table class="t"><tr><th>Tham số</th><th>Tăng nó thì power...</th><th>Vì sao</th></tr>'+
  '<tr><td>Cỡ hiệu ứng thật</td><td>Tăng</td><td>Hiệu ứng càng lớn càng dễ phát hiện</td></tr>'+
  '<tr><td>Cỡ mẫu (n)</td><td>Tăng</td><td>Mẫu lớn → ước lượng chính xác hơn, nhiễu giảm</td></tr>'+
  '<tr><td>Mức α (ngưỡng ý nghĩa)</td><td>Tăng (nhưng đổi lại Type I tăng)</td><td>α lớn hơn (dễ dãi hơn) → dễ "bắt" được hiệu ứng hơn, nhưng cũng dễ báo nhầm hơn</td></tr>'+
  '<tr><td>β mong muốn (càng thấp)</td><td>β thấp → power cao hơn (ngược chiều)</td><td>Muốn chắc chắn không bỏ sót (β nhỏ) thì cần đầu tư mẫu/điều kiện tốt hơn</td></tr></table>'+
  '<p style="margin-top:.8em"><b>Ví dụ 1 — Giáo dục (site này):</b> ước tính thô (α=0,05, power=0,80): tìm hiệu ứng d=0,5 (t-test) cần ~130 người/nhóm; tìm tương quan r=0,5 chỉ cần ~30 người — vì r=0,5 là hiệu ứng "dễ thấy" hơn d=0,5 xét theo bảng ngưỡng cỡ hiệu ứng.</p>'+
  '<p><b>Ví dụ 2 — Công nghiệp/kiểm định chất lượng (minh hoạ):</b> một dây chuyền sản xuất muốn phát hiện tỷ lệ lỗi tăng từ 2% lên 5% (hiệu ứng khá nhỏ) cần kiểm tra RẤT NHIỀU sản phẩm mẫu mới đủ power — nếu chỉ kiểm tra 20 sản phẩm, power có thể chỉ 20-30%, nghĩa là PHẦN LỚN các đợt kiểm tra sẽ "lọt" lỗi thật mà không phát hiện ra.</p>',
 example:"Cohen (1988) đề xuất coi sai lầm loại I nghiêm trọng gấp 4 lần loại II, ứng với quy ước phổ biến α=0,05 và β=0,20 (power=0,80) — tỉ lệ 4:1 này không phải luật tự nhiên, chỉ là MỘT quy ước thực hành phổ biến, có thể điều chỉnh tuỳ mức độ nghiêm trọng của việc bỏ sót trong từng lĩnh vực (vd y tế thường muốn power cao hơn 0,80 vì bỏ sót bệnh nguy hiểm hơn)."}},

{id:"trong-so-mau", module:"02", tags:["chọn mẫu", "PISA"],
 vi:{term:"Trọng số mẫu (sample weight)", short:"Bù lại việc các đơn vị KHÔNG có 'quyền số' ngang nhau khi chọn mẫu theo cụm.",
 nomNa:"Giống như bầu cử đại biểu: 1 tỉnh 10 triệu dân và 1 tỉnh 1 triệu dân không thể có SỐ PHIẾU ngang nhau nếu muốn đại diện đúng dân số — tỉnh đông dân cần 'trọng số' cao hơn khi tính kết quả chung cả nước.",
 full:"Khi chọn mẫu theo cụm với xác suất TỈ LỆ VỚI QUY MÔ (vd trường lớn có xác suất được chọn cao hơn trường nhỏ), các đơn vị trong mẫu không đại diện cho số lượng NGANG NHAU trong tổng thể. Trọng số bù lại điều này khi phân tích — bỏ qua trọng số có thể làm méo kết quả, đặc biệt với biến tương quan mạnh với quy mô.",
 tableHtml:
  '<table class="t"><tr><th></th><th>Không trọng số</th><th>Có trọng số</th></tr>'+
  '<tr><td>EDULEAD (PISA VN thật)</td><td>0,7653 (N=195, mỗi trường = 1)</td><td>0,7874 (N hiệu dụng=7.284,6)</td></tr>'+
  '<tr><td>Trọng số dao động</td><td colspan="2">1,0 → 617,2 (trường lớn nhất đại diện số HS gấp 617 lần trường nhỏ nhất)</td></tr></table>'+
  '<p style="margin-top:.8em"><b>Ví dụ 2 — Khảo sát thị trường (minh hoạ):</b> công ty khảo sát 10 siêu thị để ước tính doanh số TB toàn hệ thống 200 siêu thị, nhưng 10 siêu thị được chọn gồm cả đại siêu thị (doanh số rất cao) lẫn cửa hàng nhỏ. Nếu tính trung bình THÔ (không trọng số), 1 đại siêu thị "nặng" ngang 1 cửa hàng nhỏ trong phép tính — sai lệch nặng nếu đại siêu thị vốn CHIẾM TỈ TRỌNG LỚN trong hệ thống thật. Trọng số sửa lại theo đúng tỉ trọng doanh số từng loại cửa hàng trong tổng thể 200 siêu thị.</p>',
 example:"EDULEAD không tương quan mạnh với quy mô trường nên chênh lệch nhỏ (0,02). Nhưng với biến TƯƠNG QUAN MẠNH quy mô (vd tổng chi phí vận hành, số giáo viên) — bỏ trọng số có thể gây sai lệch lớn hơn NHIỀU, vì khi đó quy mô trường/siêu thị ảnh hưởng trực tiếp tới chính biến đang đo."}},

{id:"gia-thuyet-h0-h1", module:"04", tags:["giả thuyết"],
 vi:{term:"Giả thuyết H0 và H1", short:"H0 = \"không có\" khác biệt/liên hệ; H1 = \"có\". Dùng từ \"được ủng hộ\", không dùng \"đúng/sai\".",
 nomNa:"Giống hệt phiên toà: bị cáo mặc định VÔ TỘI (H0) cho tới khi có đủ bằng chứng thuyết phục mới kết tội (H1). Toà không bao giờ tuyên 'chắc chắn vô tội 100%', chỉ tuyên 'đủ/không đủ bằng chứng' — thống kê cũng vậy, không bao giờ nói H0 'đúng', chỉ nói 'được/không được ủng hộ'.",
 full:"H0 (giả thuyết không): phát biểu KHÔNG CÓ khác biệt/liên hệ/thay đổi — gánh nặng chứng minh đặt lên người nghiên cứu. H1 (giả thuyết thay thế): phát biểu CÓ — chỉ được ủng hộ khi H0 KHÔNG được ủng hộ. Cohen et al. khuyên dùng \"được ủng hộ / không được ủng hộ\", tránh \"bác bỏ/chấp nhận\" vì ngụ ý kết luận TUYỆT ĐỐI.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>H0 (không có gì)</th><th>H1 (có gì đó)</th></tr>'+
  '<tr><td>Giáo dục (site này)</td><td>Phương pháp dạy Dự án và Truyền thống cho kết quả NHƯ NHAU</td><td>Hai phương pháp cho kết quả KHÁC NHAU</td></tr>'+
  '<tr><td>Y dược (minh hoạ)</td><td>Thuốc mới và giả dược (placebo) có hiệu quả NHƯ NHAU</td><td>Thuốc mới hiệu quả KHÁC giả dược</td></tr>'+
  '<tr><td>Nông nghiệp (minh hoạ, gốc lịch sử ANOVA)</td><td>3 loại phân bón cho năng suất NHƯ NHAU</td><td>Ít nhất 1 loại phân bón cho năng suất KHÁC các loại còn lại</td></tr></table>',
 example:"Một nghiên cứu KHÔNG tìm thấy khác biệt (H0 vẫn \"được ủng hộ\") KHÔNG có nghĩa là \"đã chứng minh 2 phương pháp giống hệt nhau\" — chỉ có nghĩa là CHƯA đủ bằng chứng để nói chúng khác nhau, giống như toà tuyên \"chưa đủ bằng chứng buộc tội\" không đồng nghĩa với \"chắc chắn vô tội\"."}},

{id:"gia-thuyet-co-huong-phi-huong", module:"04", tags:["giả thuyết"],
 vi:{term:"Giả thuyết có hướng vs phi hướng", short:"Có hướng nêu rõ CHIỀU (\"cao hơn\"); phi hướng chỉ nói \"khác nhau\".",
 nomNa:"Giống như cá cược bóng đá: 'có hướng' là bạn đặt cược ĐÚNG ĐỘI THẮNG trước trận (được ăn nhiều hơn nếu đúng, nhưng phải chọn trước, không đổi ý giữa chừng); 'phi hướng' là bạn chỉ cược 'trận này sẽ CÓ đội thắng rõ ràng, không hoà' — không cần đoán đội nào.",
 full:"Có hướng (directional): nêu rõ chiều, dùng kiểm định 1 đuôi — toàn bộ 5% rủi ro dồn về MỘT phía đã dự đoán TRƯỚC khi nhìn dữ liệu, nên dễ đạt ý nghĩa hơn NẾU đoán đúng chiều. Phi hướng (non-directional): chỉ nói \"có khác biệt\", dùng kiểm định 2 đuôi — chia đôi rủi ro 2,5%/phía, cần bằng chứng mạnh hơn. Quy tắc bắt buộc: phải chọn loại TRƯỚC khi xem dữ liệu.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Giả thuyết CÓ HƯỚNG</th><th>Giả thuyết PHI HƯỚNG</th></tr>'+
  '<tr><td>Giáo dục</td><td>Nhóm Dự án đạt điểm CAO HƠN nhóm Truyền thống</td><td>Hai nhóm có kết quả KHÁC NHAU (chưa biết ai hơn)</td></tr>'+
  '<tr><td>Thể thao/Y sinh (minh hoạ)</td><td>Vận động viên uống nước tăng lực chạy NHANH HƠN</td><td>Nước tăng lực làm THAY ĐỔI tốc độ chạy (chưa rõ nhanh hơn hay chậm hơn)</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Lỗi hay gặp (HARKing — Hypothesizing After Results are Known): sau khi thấy kết quả thiên về 1 chiều, mới "quay lại" viết giả thuyết có hướng cho khớp — đây là gian lận học thuật, vì giả thuyết phải được chốt TRƯỚC khi chạy kiểm định.</p>',
 example:"Nếu đã chốt giả thuyết phi hướng (2 đuôi) nhưng kết quả ra p=0,07 (2 đuôi) — KHÔNG được tự ý đổi sang tính lại theo 1 đuôi (p sẽ giảm còn 0,035, có vẻ \"có ý nghĩa\") chỉ vì muốn kết quả đẹp hơn. Đây là một dạng p-hacking."}},

{id:"khoang-tin-cay", module:"04", tags:["ước lượng"],
 vi:{term:"Khoảng tin cậy (Confidence Interval, CI)", short:"KHÔNG phải \"95% xác suất giá trị thật nằm trong khoảng này\" — mà là \"95% QUY TRÌNH đúng\".",
 nomNa:"Giống như ném một vòng tròn phủ lên một cái cọc cố định (không di chuyển) 100 lần — mỗi lần ném là MỘT mẫu nghiên cứu khác nhau. Nếu kỹ thuật ném của bạn tốt, khoảng 95/100 lần vòng tròn sẽ PHỦ TRÚNG cái cọc. Một khi bạn đã ném xong 1 lần và nhìn xuống đất, vòng tròn đó HOẶC phủ trúng HOẶC không — không còn \"xác suất 95%\" nữa cho riêng lần ném đó.",
 full:"Công thức: CI95% = trung bình mẫu ± 1,96×SE, với SE = độ lệch chuẩn mẫu chia căn n; 1,96 là giá trị z ứng với 95% diện tích giữa phân phối chuẩn. Cách hiểu ĐÚNG: nếu lặp lại lấy mẫu nhiều lần, ~95% các khoảng dựng ra sẽ chứa giá trị TRUNG BÌNH THẬT — đây là độ tin cậy của QUY TRÌNH lặp lại, không phải xác suất của MỘT khoảng cụ thể.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Ví dụ CI95%</th><th>Diễn giải ĐÚNG</th></tr>'+
  '<tr><td>Giáo dục (thật, n=240)</td><td>Điểm Toán TB = [46,68; 49,14]</td><td>95% các khoảng dựng theo cách này (lặp lại lấy mẫu) chứa trung bình thật</td></tr>'+
  '<tr><td>Thăm dò dư luận (minh hoạ)</td><td>Tỷ lệ ủng hộ = [42%, 48%] (n=1.000)</td><td>Nếu khảo sát lặp lại 100 lần theo đúng quy trình này, ~95 lần khoảng tính ra sẽ chứa đúng tỷ lệ ủng hộ THẬT của toàn dân</td></tr>'+
  '<tr><td>Công nghiệp thực phẩm (minh hoạ)</td><td>Trọng lượng TB gói bim bim = [98g, 102g]</td><td>Tương tự — đây là lý do nhãn "khối lượng tịnh ~100g" luôn có sai số cho phép</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Mẫu nhỏ → CI rộng (kém chính xác); mẫu lớn → CI hẹp hơn (chính xác hơn), vì SE giảm khi n tăng (Torgerson & Torgerson, 2008).</p>',
 example:"Diễn giải SAI rất hay gặp: \"có 95% xác suất trung bình thật nằm trong [46,68; 49,14]\" — câu này sai vì trung bình thật là MỘT CON SỐ CỐ ĐỊNH (dù ta không biết), không phải biến ngẫu nhiên có xác suất — giống như cái cọc trong ví dụ trên không hề di chuyển, chỉ có vòng tròn (mẫu) là thay đổi mỗi lần."}},

{id:"skewness-kurtosis", module:"04", tags:["phân phối"],
 vi:{term:"Skewness (độ lệch) & Kurtosis (độ nhọn)", short:"Lệch dương: đuôi dài bên phải. Lệch âm: đuôi dài bên trái. Platykurtic: phẳng hơn chuẩn. Leptokurtic: nhọn hơn chuẩn.",
 nomNa:"Skewness giống như hình dáng một đống cát đổ nghiêng: nếu phần lớn cát dồn bên trái mà có vài hạt văng xa bên phải, đó là lệch DƯƠNG (đuôi dài bên phải) — ví dụ kinh điển: THU NHẬP dân cư luôn lệch dương vì đa số người thu nhập thấp-vừa, một số ít tỷ phú kéo đuôi dài sang phải.",
 full:"Quy tắc thực hành đánh giá \"lệch có ý nghĩa\": so skewness đo được với ±2×SE(skewness). Nếu |skewness| vượt ngưỡng này, có bằng chứng lệch phân phối đáng kể.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Biến điển hình LỆCH DƯƠNG</th><th>Biến điển hình GẦN ĐỐI XỨNG</th></tr>'+
  '<tr><td>Giáo dục (thật)</td><td>study_hours: skew=+0,658 (SE=0,157 → ngưỡng ±0,314 → VƯỢT, lệch có ý nghĩa, Shapiro-Wilk p&lt;0,001)</td><td>pretest: skew=−0,097 (trong ngưỡng, Shapiro-Wilk p=0,117)</td></tr>'+
  '<tr><td>Kinh tế (minh hoạ)</td><td>Thu nhập cá nhân — đa số thu nhập thấp-vừa, số ít rất giàu kéo đuôi dài phải</td><td>Chiều cao người trưởng thành — phân phối gần chuẩn quanh trung bình</td></tr>'+
  '<tr><td>Y tế (minh hoạ)</td><td>Thời gian nằm viện — đa số vài ngày, số ít ca nặng nằm rất lâu</td><td>Huyết áp tâm thu người khoẻ mạnh — khá đối xứng quanh 120mmHg</td></tr></table>',
 example:"Vì sao quan trọng: nếu dùng trung bình để mô tả biến LỆCH NẶNG (như thu nhập), con số sẽ bị vài giá trị cực đoan KÉO LỆCH, không đại diện \"người điển hình\" — đây là lý do báo cáo thu nhập quốc gia hay dùng TRUNG VỊ thay vì trung bình (xem mục Xu hướng trung tâm)."}},

{id:"y-nghia-thong-ke", module:"04", tags:["p-value"],
 vi:{term:"Ý nghĩa thống kê (statistical significance)", short:"\"Kết quả mà ngẫu nhiên khó có thể giải thích được\" (Kirk, 1999) — KHÔNG đồng nghĩa \"quan trọng\".",
 nomNa:"Giống như tung đồng xu 10 lần ra 10 mặt ngửa — bạn sẽ nghi ngờ \"đồng xu này chắc không công bằng\", vì KẾT QUẢ NÀY RẤT KHÓ xảy ra NẾU đồng xu thật sự công bằng (50/50). Đó chính xác là logic của ý nghĩa thống kê: \"nếu KHÔNG có gì đặc biệt (H0 đúng), kết quả này có khó xảy ra không?\"",
 full:"Ví dụ trực giác của Cohen et al.: nếu một mối quan hệ xuất hiện đúng 95/100 lần thử, 5 lần còn lại KHÔNG thấy — đó là mức ý nghĩa 0,05. Cỡ mẫu càng lớn, ngưỡng hệ số cần để đạt ý nghĩa càng NHỎ.",
 tableHtml:
  '<table class="t"><tr><th>n (cỡ mẫu)</th><th>Ngưỡng r cần để có ý nghĩa ở mức 0,05</th></tr>'+
  '<tr><td>8</td><td>r ≥ 0,78</td></tr><tr><td>30</td><td>r ≥ 0,36</td></tr></table>'+
  '<p style="margin-top:.8em"><b>Ví dụ ngành khác — Marketing (minh hoạ):</b> khảo sát 10.000 khách hàng, tìm ra "khách mua online buổi tối chi tiêu nhiều hơn buổi sáng đúng 2.000đ, p=0,001 (có ý nghĩa thống kê)". Đây là ví dụ kinh điển: CÓ ý nghĩa thống kê (mẫu quá lớn khiến ngay cả khác biệt 2.000đ cũng "có ý nghĩa"), nhưng HOÀN TOÀN không quan trọng để ra quyết định kinh doanh.</p>'+
  '<div class="callout warn"><b>Cảnh báo cốt lõi:</b> \"statistically significant\" KHÔNG đồng nghĩa \"important\". Luôn hỏi thêm: cỡ hiệu ứng (độ lớn thật) có đáng để hành động không?</div>',
 example:"p=0,065 (nhỉnh hơn 0,05) không nên vội kết luận \"không có khác biệt\" — ngưỡng 0,05 chỉ là quy ước tương đối (do Fisher đề xuất những năm 1920, không phải quy luật tự nhiên), không phải ranh giới tuyệt đối giữa \"có\" và \"không có gì\"."}},

{id:"dao-chieu-nhan-qua", module:"04", tags:["p-value", "nhân quả", "bẫy phổ biến"],
 vi:{term:"Đảo chiều nhân quả / sai lầm điều kiện bị đảo ngược", short:"Nhầm P(dữ liệu | giả thuyết) với P(giả thuyết | dữ liệu) — hai xác suất RẤT khác nhau, dù nghe giống.",
 nomNa:"Nói cực kỳ đơn giản: 'TẤT CẢ chó đều có 4 chân' không có nghĩa 'TẤT CẢ con vật có 4 chân đều là chó' (mèo cũng 4 chân). Đảo chiều một câu đúng không tự động ra một câu đúng khác — thống kê cũng vướng đúng lỗi logic này khi đọc p-value hoặc đọc tương quan.",
 full:"p-value trả lời: \"Nếu H0 ĐÚNG, xác suất quan sát được dữ liệu này là bao nhiêu?\" — P(dữ liệu|H0). Nhiều người đọc ngược thành P(H0|dữ liệu) — CÂU HỎI KHÁC, hai xác suất KHÔNG bằng nhau. Carver (1978): xác suất CHẾT nếu bị treo cổ rất cao, nhưng xác suất bị TREO CỔ nếu đã chết lại rất thấp. Rộng hơn: thấy A và B cùng biến thiên, vội kết luận A gây B, trong khi có thể B gây A, hoặc cả A và B cùng do biến thứ ba C gây ra (confounding).",
 tableHtml:
  '<p><b>Ví dụ 1 — Y tế (dịch tễ học, \"confounding by indication\"):</b> nhóm tiêm đủ liều vắc-xin có tỷ lệ nhập viện CAO hơn nhóm chưa tiêm. Kết luận ĐẢO CHIỀU SAI: "vắc-xin làm suy yếu, gây bệnh nặng". Chiều THẬT: người có bệnh nền/nguy cơ cao (biến thứ ba C) vừa dễ nhập viện hơn TỪ ĐẦU, vừa được ưu tiên tiêm trước — C quyết định cả 2 vế, không phải vắc-xin gây nhập viện.</p>'+
  '<table class="t"><tr><th></th><th>Biến A</th><th>Biến B</th><th>Biến thứ ba C thật sự gây ra cả 2</th></tr>'+
  '<tr><td>Ví dụ 1 (Y tế)</td><td>Tiêm vắc-xin</td><td>Nhập viện</td><td>Bệnh nền/nguy cơ sức khoẻ có sẵn</td></tr>'+
  '<tr><td>Ví dụ 2 (Kinh tế, kinh điển)</td><td>Số lính cứu hoả tại hiện trường</td><td>Thiệt hại của đám cháy</td><td>Quy mô đám cháy (cháy to → điều nhiều lính CÙNG LÚC thiệt hại cũng lớn)</td></tr>'+
  '<tr><td>Ví dụ 3 (Giáo dục, minh hoạ)</td><td>Số giờ học thêm</td><td>Điểm thi thấp</td><td>Học lực yếu từ trước (HS yếu mới cần học thêm NHIỀU, không phải học thêm làm điểm thấp đi)</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Ví dụ 2 hay bị đọc sai thành "gọi nhiều lính cứu hoả làm cháy thiệt hại nặng hơn" — nghe buồn cười nhưng đây CHÍNH XÁC là cùng 1 lỗi logic với ví dụ vắc-xin, chỉ khác ngành.</p>',
 example:"Bài học chung cho cả 3 ví dụ: trước khi tin một chiều nhân quả, luôn tự hỏi (1) chiều ngược lại có hợp lý không, (2) có biến thứ ba nào giải thích được CẢ HAI vế đang quan sát hay không."}},

{id:"type-i-type-ii-error", module:"04", tags:["sai lầm thống kê"],
 vi:{term:"Sai lầm loại I (α) & loại II (β)", short:"Loại I = dương tính giả (kết án oan). Loại II = âm tính giả (bỏ lọt).",
 nomNa:"Giống hệt máy báo cháy trong nhà: Loại I là máy KÊU LOẠN dù không có cháy (phiền nhưng không nguy hiểm chết người). Loại II là máy IM RE dù nhà đang cháy thật (nguy hiểm hơn nhiều). Tuỳ bối cảnh mà người ta chấp nhận loại sai nào hơn.",
 full:"Sai lầm loại I (α): KHÔNG ủng hộ H0 khi H0 thực ra ĐÚNG — \"dương tính giả\", giống kết án oan người vô tội. Sai lầm loại II (β): ỦNG HỘ H0 khi H0 thực ra SAI — \"âm tính giả\", bỏ sót hiệu ứng có thật. Luôn ĐÁNH ĐỔI: giảm α thường làm tăng β, trừ khi tăng cỡ mẫu.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Sai lầm loại I (dương tính giả)</th><th>Sai lầm loại II (âm tính giả)</th><th>Loại nào "đáng sợ" hơn?</th></tr>'+
  '<tr><td>Y tế — xét nghiệm ung thư</td><td>Báo CÓ bệnh dù thực ra KHÔNG bệnh (lo lắng, xét nghiệm thêm tốn kém)</td><td>Báo KHÔNG bệnh dù thực ra CÓ bệnh (bỏ lỡ điều trị sớm)</td><td>Loại II — hậu quả nghiêm trọng hơn nhiều</td></tr>'+
  '<tr><td>Pháp luật</td><td>Kết tội người VÔ TỘI</td><td>Tha bổng người CÓ TỘI</td><td>Tuỳ hệ thống pháp luật — nhiều nước ưu tiên giảm Loại I ("thà bỏ sót còn hơn xử oan")</td></tr>'+
  '<tr><td>Giáo dục (site này)</td><td>Kết luận phương pháp dạy mới HIỆU QUẢ dù thực ra không hơn gì</td><td>Kết luận phương pháp mới KHÔNG hiệu quả dù thực ra có tác dụng thật</td><td>Tuỳ chi phí triển khai — nếu rẻ, chấp nhận rủi ro Loại I thử trước cũng được</td></tr></table>',
 example:"Giảm α từ 0,05 xuống 0,01 (khắt khe hơn, giảm Loại I) → TĂNG rủi ro Loại II (dễ bỏ sót hiệu ứng thật hơn), nếu cỡ mẫu giữ nguyên — đây là lý do ngành Y thường chọn cỡ mẫu LỚN hơn hẳn ngành khoa học xã hội, để giảm CẢ HAI loại sai lầm cùng lúc thay vì phải đánh đổi."}},

{id:"co-hieu-ung-effect-size", module:"04", tags:["effect size"],
 vi:{term:"Cỡ hiệu ứng (Effect size) — tên gọi không hoàn toàn chính xác", short:"Đo ĐỘ LỚN của khác biệt/liên hệ — điều p-value KHÔNG cho biết. Chữ \"effect\" không có nghĩa là đã chứng minh nhân quả.",
 nomNa:"p-value trả lời 'có đáng tin không' (có phải do may rủi hay không); cỡ hiệu ứng trả lời 'to hay nhỏ' (đáng để quan tâm trong thực tế không). Giống như khi khám sức khoẻ: bác sĩ không chỉ nói 'chỉ số này có bất thường không' (p-value) mà còn phải nói 'bất thường NẶNG hay NHẸ' (cỡ hiệu ứng) mới quyết định có cần điều trị không.",
 full:"Cohen et al. tự lưu ý \"effect size\" là thuật ngữ không chính xác: chữ \"effect\" ngụ ý nhân quả, nhưng phép đo này KHÔNG chứng minh nhân quả, chỉ đo độ lớn liên hệ/khác biệt QUAN SÁT ĐƯỢC. Ba loại phổ biến nhất, mỗi loại đi với một kiểm định riêng — xem bảng ngưỡng và 2 ví dụ tính tay đầy đủ ngay dưới đây, không chỉ nêu con số suông.",
 tableHtml:
   '<table class="t"><tr><th>Thống kê</th><th>Nhỏ</th><th>Vừa</th><th>Lớn</th><th>Dùng với</th></tr>'+
   '<tr><td><b>Cohen\'s d</b></td><td>0,20</td><td>0,50</td><td>0,80</td><td>t-test (so 2 trung bình)</td></tr>'+
   '<tr><td><b>Pearson r</b></td><td>0,10</td><td>0,30</td><td>0,50</td><td>Tương quan/hồi quy đơn biến</td></tr>'+
   '<tr><td><b>Eta² (η²)</b></td><td>0,01</td><td>0,06</td><td>0,14</td><td>ANOVA (so 3+ trung bình)</td></tr></table>'+
   '<p class="cap" style="margin:.6em 0 1em">(Cohen, 1988, dẫn theo Cohen et al. 2018, Bảng 39.2, tr.746.)</p>'+

   '<p style="font-weight:800;margin-top:1em">Tính tay d=0,98 — từ đâu ra con số này? (ví dụ t-test, Module 05)</p>'+
   '<p>Dữ liệu thật: nhóm <b>Dự án</b> n₁=115, TB x̄₁=8,66, SD s₁=5,77 · nhóm <b>Truyền thống</b> n₂=125, TB x̄₂=2,89, SD s₂=6,00 (biến \"gain\" = mức tăng điểm).</p>'+
   '<div class="pd-formula"><div class="pd-formula-label">Bước 1 — Gộp 2 độ lệch chuẩn thành 1 (pooled SD)</div>'+
   '<div class="pd-formula-math">s<sub>pooled</sub> = √[ ((n₁−1)s₁² + (n₂−1)s₂²) / (n₁+n₂−2) ]</div></div>'+
   '<table class="t"><tr><th>Thay số</th><th>Kết quả</th></tr>'+
   '<tr><td>(115−1)×5,77² = 114×33,29</td><td>3.795,4</td></tr>'+
   '<tr><td>(125−1)×6,00² = 124×36</td><td>4.464,0</td></tr>'+
   '<tr><td>Tổng / (115+125−2) = 8.259,4 / 238</td><td>34,70</td></tr>'+
   '<tr><td>s<sub>pooled</sub> = √34,70</td><td><b>5,89</b></td></tr></table>'+
   '<div class="pd-formula"><div class="pd-formula-label">Bước 2 — Cohen\'s d = chênh lệch 2 trung bình, chia cho SD gộp</div>'+
   '<div class="pd-formula-math">d = (x̄₁ − x̄₂) / s<sub>pooled</sub> = (8,66 − 2,89) / 5,89 = 5,77 / 5,89 ≈ <b>0,98</b></div></div>'+
   '<p class="cap">Diễn giải: khoảng cách giữa 2 trung bình nhóm RỘNG GẦN BẰNG 1 ĐỘ LỆCH CHUẨN GỘP — theo bảng ngưỡng ở trên, 0,98 nằm giữa mức \"vừa\" (0,50) và \"lớn\" (0,80), nghiêng hẳn về MẠNH.</p>'+

   '<p style="font-weight:800;margin-top:1.2em">Tính tay η²=0,047 — vì sao CÙNG MỘT bộ dữ liệu lại ra 2 con số khác hẳn nhau?</p>'+
   '<p>Đây là ví dụ KHÁC — ANOVA so điểm Toán giữa 3 trường (Module 06), không phải ví dụ d ở trên. Kết quả ANOVA: SS<sub>between</sub>=1.056,82 (biến thiên GIỮA 3 trường), SS<sub>total</sub>=22.374,01 (tổng biến thiên toàn bộ dữ liệu).</p>'+
   '<div class="pd-formula"><div class="pd-formula-label">η² = SS<sub>between</sub> / SS<sub>total</sub></div>'+
   '<div class="pd-formula-math">η² = 1.056,82 / 22.374,01 ≈ <b>0,047</b></div></div>'+
   '<p class="cap">Diễn giải: CHỈ ~4,7% tổng biến thiên điểm Toán của TOÀN BỘ 238 học sinh là do khác biệt GIỮA 3 trường — 95,3% còn lại là khác biệt GIỮA TỪNG HỌC SINH trong cùng 1 trường (năng lực riêng, nỗ lực riêng...). Theo bảng ngưỡng, 0,047 ở mức \"nhỏ\" (ngưỡng nhỏ=0,01, vừa=0,06) — dù F-test vẫn CÓ Ý NGHĨA THỐNG KÊ (p=0,003)!</p>'+
   '<div class="callout warn"><b>Vậy có mâu thuẫn không?</b> Không — vì d=0,98 và η²=0,047 là <b>hai câu hỏi khác nhau, trên hai dữ liệu khác nhau</b> trong ví dụ này: d đo khoảng cách giữa ĐÚNG 2 nhóm cụ thể (Dự án/Truyền thống) theo đơn vị độ lệch chuẩn; η² đo CẢ 3 trường cùng lúc, trả lời "trường học giải thích được bao nhiêu % trong TẤT CẢ biến thiên điểm số" — một câu hỏi rộng hơn hẳn, nên con số tự nhiên nhỏ hơn nhiều dù cùng một kiểu hiện tượng (khác biệt theo nhóm).</div>'+

   '<div class="callout warn"><b>Thompson (2001) cảnh báo:</b> đừng dùng bảng ngưỡng nhỏ/vừa/lớn này một cách máy móc — ông gọi việc áp dụng cứng nhắc không xét bối cảnh nghiên cứu là "ngu ngốc theo một thước đo khác".</div>',
 example:null}},

{id:"t-test-doc-lap-bat-cap", module:"05", tags:["t-test"],
 vi:{term:"T-test độc lập vs bắt cặp", short:"Độc lập: so 2 NHÓM KHÁC NHAU. Bắt cặp: so CÙNG một nhóm ở 2 thời điểm/điều kiện.",
 nomNa:"Độc lập giống như so chiều cao TRUNG BÌNH của lớp 10A với lớp 10B (2 nhóm người khác nhau hoàn toàn). Bắt cặp giống như so cân nặng của CHÍNH bạn trước và sau khi ăn kiêng 1 tháng (cùng 1 người, đo 2 lần) — vì là CÙNG người nên loại được yếu tố \"người này vốn nặng/nhẹ hơn người kia từ đầu\".",
 full:"T-test độc lập: dùng khi hai mẫu KHÔNG liên quan, chìa khoá đọc kết quả SPSS là kiểm định Levene. T-test bắt cặp: dùng khi so sánh CÙNG một nhóm ở hai điều kiện/thời điểm — mạnh hơn độc lập vì loại bỏ được biến thiên cá nhân.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>T-test ĐỘC LẬP (2 nhóm khác nhau)</th><th>T-test BẮT CẶP (cùng 1 nhóm, 2 lần đo)</th></tr>'+
  '<tr><td>Giáo dục (thật)</td><td>Điểm Toán Nam vs Nữ (2 nhóm HS khác nhau)</td><td>Pretest vs Posttest của CÙNG 240 học sinh</td></tr>'+
  '<tr><td>Y học thể thao (minh hoạ)</td><td>Sức bền nhóm tập Gym vs nhóm KHÔNG tập (2 nhóm người khác nhau)</td><td>Sức bền CÙNG 1 người trước và sau 8 tuần tập luyện</td></tr>'+
  '<tr><td>Marketing (minh hoạ)</td><td>Doanh số cửa hàng A vs cửa hàng B (2 cửa hàng khác nhau)</td><td>Doanh số CÙNG 1 cửa hàng trước và sau đổi biển quảng cáo</td></tr></table>',
 example:"Nhầm lẫn hay gặp nhất: có dữ liệu bắt cặp (cùng người đo 2 lần) nhưng lại chạy NHẦM thành t-test độc lập — làm mất thông tin \"đây là cùng 1 người\", kiểm định trở nên kém nhạy hơn hẳn, có thể bỏ sót hiệu ứng thật."}},

{id:"levene-test", module:"05", tags:["t-test", "điều kiện"],
 vi:{term:"Kiểm định Levene", short:"Quyết định đọc dòng nào trong bảng t-test độc lập của SPSS.",
 nomNa:"Giống như trước khi so sánh \"ai ném xa hơn\" giữa 2 đội, phải kiểm tra xem 2 đội có ném đồng đều (ổn định) như nhau không — nếu 1 đội ném rất thất thường (lúc xa lúc gần) còn đội kia luôn đều tay, cách so sánh \"công bằng\" sẽ khác nhau.",
 full:"Kiểm tra giả định phương sai hai nhóm có ĐỒNG NHẤT hay không trước khi đọc t-test độc lập. Levene p≥0,05 → đọc dòng \"assumed\". Levene p&lt;0,05 → đọc dòng \"not assumed\" (dùng t Welch).",
 tableHtml:
  '<table class="t"><tr><th>Levene p</th><th>Đọc dòng nào</th><th>Ví dụ thật (lãnh đạo/GV, Cohen et al. tr.777-778)</th></tr>'+
  '<tr><td>&lt; 0,05</td><td>"Equal variances NOT assumed" (t Welch)</td><td>p=0,004 → đọc dòng này → Sig.=0,044 (CÓ ý nghĩa)</td></tr>'+
  '<tr><td>≥ 0,05</td><td>"Equal variances assumed" (t thường)</td><td>p=0,728 (ví dụ khác) → đọc dòng này → Sig.=0,610 (KHÔNG có ý nghĩa)</td></tr></table>'+
  '<div class="callout warn">Nếu ở ví dụ Levene p=0,004 mà NHẦM đọc dòng "assumed", Sig. sẽ hiện ra 0,055 — đảo ngược hoàn toàn kết luận từ "có ý nghĩa" sang "không có ý nghĩa", chỉ vì đọc nhầm MỘT dòng trong bảng.</div>',
 example:"Levene p=0,088 (gần 0,05 nhưng chưa vượt) → vẫn đọc dòng \"Equal variances assumed\" theo đúng quy tắc, nhưng vì khá gần ngưỡng nên nên thận trọng, có thể xem thêm cả 2 dòng để chắc chắn kết luận không đổi."}},

{id:"anova-f-ratio", module:"06", tags:["ANOVA"],
 vi:{term:"ANOVA & F-ratio", short:"So sánh TRUNG BÌNH từ 3+ nhóm bằng cách PHÂN TÍCH PHƯƠNG SAI — tên nghe mâu thuẫn nhưng cơ chế rất logic.",
 nomNa:"Hãy tưởng tượng 3 lớp học cùng làm 1 bài kiểm tra. Nếu cả 3 lớp CÁCH BIỆT NHAU rõ (lớp A toàn 9-10, lớp B toàn 7-8, lớp C toàn 5-6) NHƯNG trong MỖI lớp điểm khá đều nhau — đó là dấu hiệu CÓ khác biệt thật giữa các lớp. Ngược lại nếu cả 3 lớp đều có người cao người thấp lẫn lộn, rất khó nói lớp nào hơn lớp nào. ANOVA chính là lượng hoá chính xác cảm giác này: so 'cách biệt GIỮA lớp' với 'lộn xộn TRONG mỗi lớp'.",
 full:"ANOVA tách tổng biến thiên thành \"giữa nhóm\" và \"trong nhóm\", so sánh qua F = phương sai giữa nhóm / phương sai trong nhóm. Vì sao không chạy nhiều t-test riêng lẻ? Vì mỗi t-test mang 5% rủi ro sai lầm loại I, chạy nhiều lần làm rủi ro CỘNG DỒN.",
 tableHtml:
  '<table class="t"><tr><th>Số t-test cần nếu so TỪNG CẶP</th><th>Số nhóm</th><th>Rủi ro Loại I CỘNG DỒN (≈1−0,95ᵏ)</th></tr>'+
  '<tr><td>1</td><td>2 nhóm</td><td>5%</td></tr><tr><td>3</td><td>3 nhóm</td><td>~14%</td></tr><tr><td>6</td><td>4 nhóm</td><td>~26%</td></tr><tr><td>10</td><td>5 nhóm</td><td>~40%</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Đây chính là lý do Fisher phát minh ANOVA tại trạm nông nghiệp Rothamsted (1920s) — so năng suất NHIỀU lô đất cùng lúc mà không "đào bới" dương tính giả.</p>'+
  '<p><b>Ví dụ ngành khác — Dược phẩm (minh hoạ):</b> so hiệu quả 4 liều thuốc (0mg, 50mg, 100mg, 150mg) trên huyết áp — dùng ANOVA một lần thay vì 6 t-test riêng lẻ cho mọi cặp liều.</p>',
 example:"Dữ liệu thật: so điểm Toán giữa 3 trường A/B/C — F(2,237)=5,87, p=0,003 → có khác biệt có ý nghĩa giữa ÍT NHẤT một cặp trường, nhưng CHƯA biết cặp nào — cần hậu kiểm Tukey (mục kế tiếp) để biết chính xác."}},

{id:"tukey-hsd", module:"06", tags:["ANOVA", "hậu kiểm"],
 vi:{term:"Hậu kiểm Tukey HSD", short:"Trả lời câu hỏi ANOVA bỏ ngỏ: \"khác biệt nằm ở CẶP NHÓM nào?\"",
 nomNa:"ANOVA giống như bác sĩ nói \"có gì đó bất thường trong cơ thể bạn\" (chưa biết ở đâu). Tukey giống như làm thêm xét nghiệm chi tiết để chỉ ra CHÍNH XÁC \"bất thường nằm ở gan, không phải ở thận\".",
 full:"Hậu kiểm (post hoc) như Tukey HSD so sánh TỪNG CẶP nhóm để xác định cặp nào khác biệt có ý nghĩa. Tukey cần phương sai đồng nhất + cỡ mẫu tương đối bằng nhau; Games-Howell thay thế khi phương sai KHÔNG đồng nhất.",
 tableHtml:
  '<table class="t"><tr><th>Cặp</th><th>Chênh lệch TB</th><th>p (đã hiệu chỉnh)</th><th>Kết luận</th></tr>'+
  '<tr><td>Trường A − B</td><td>3,41</td><td>0,046</td><td>Có ý nghĩa</td></tr>'+
  '<tr><td>Trường A − C</td><td>5,34</td><td>0,0031</td><td>Có ý nghĩa</td></tr>'+
  '<tr><td>Trường B − C</td><td>1,93</td><td>0,427</td><td>KHÔNG có ý nghĩa</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">→ \"Nhóm đồng nhất\" (homogeneous subsets): {A} tách riêng, {B, C} cùng 1 nhóm — A khác biệt rõ với cả B và C, còn B với C thì không khác nhau đáng kể.</p>',
 example:"Báo cáo chuẩn CẦN ĐỦ cả 2 phần, thiếu phần nào cũng coi là chưa đầy đủ: (1) F/df/p của ANOVA (trả lời \"có khác biệt không\"), VÀ (2) bảng Tukey chỉ rõ cặp nào khác biệt (trả lời \"ở đâu\") — một mình ANOVA KHÔNG đủ để viết kết luận \"trường A khác trường B\"."}},

{id:"chi-square-bac-tu-do", module:"07", tags:["chi-square"],
 vi:{term:"Chi-square & bậc tự do (degrees of freedom)", short:"Chi-square đo liên hệ giữa 2 biến ĐỊNH DANH; bậc tự do = số giá trị còn \"tự do\" thay đổi.",
 nomNa:"Bậc tự do giống như xếp 4 người ngồi vào 4 ghế đã BIẾT TRƯỚC tổng cộng có đúng 4 người: xếp xong 3 người đầu TUỲ Ý, người thứ 4 KHÔNG còn lựa chọn nào khác — phải ngồi vào ghế còn lại duy nhất. 3 người đầu \"tự do\", người cuối \"bị ép buộc\".",
 full:"Chi-square dùng cho bảng chéo giữa hai biến định danh. Tần số kỳ vọng mỗi ô = (Tổng hàng × Tổng cột) / Tổng chung. Quy tắc \"20%\": không quá 20% số ô có ít hơn 5 quan sát, vi phạm nặng (&gt;25%) nên dùng Fisher's Exact Test. df = (số hàng−1)×(số cột−1).",
 tableHtml:
  '<p><b>Ví dụ tính tay bậc tự do:</b> 4 số phải cộng đúng bằng 20. Biết 3 số đầu là 5, 6, 4 → số thứ 4 BẮT BUỘC = 20−5−6−4=5, không còn lựa chọn nào khác → df=3 (3 số đầu tự do, số cuối bị ràng buộc bởi tổng đã biết).</p>'+
  '<p><b>Ví dụ ngành khác — Nhân sự (minh hoạ):</b> bảng chéo Giới tính (2 hàng) × Vị trí ứng tuyển Đậu/Rớt (2 cột) để kiểm tra có thiên vị giới tính trong tuyển dụng không — df=(2−1)×(2−1)=1. Nếu mở rộng ra 3 vị trí công việc khác nhau (3 cột) × 2 giới tính (2 hàng) → df=(2−1)×(3−1)=2.</p>'+
  '<table class="t"><tr><th>Bảng chéo</th><th>Số hàng</th><th>Số cột</th><th>df</th></tr>'+
  '<tr><td>Giới tính × Phương pháp dạy (site này, thật)</td><td>2</td><td>2</td><td>1</td></tr>'+
  '<tr><td>Giới tính × Đậu/Rớt tuyển dụng (minh hoạ)</td><td>2</td><td>2</td><td>1</td></tr>'+
  '<tr><td>Giới tính × 3 vị trí ứng tuyển (minh hoạ)</td><td>2</td><td>3</td><td>2</td></tr></table>',
 example:"Dữ liệu thật: giới tính × phương pháp học, χ²(1)=1,37, p=0,243 — không có ý nghĩa, không có mối liên hệ giữa giới tính và phương pháp được chọn trong mẫu này."}},

{id:"kiem-dinh-phi-tham-so", module:"07", tags:["phi tham số"],
 vi:{term:"Bộ 4 kiểm định phi tham số thay thế", short:"Mỗi kiểm định tham số có một \"anh em song sinh\" phi tham số, dùng khi dữ liệu không thoả điều kiện an toàn.",
 nomNa:"Giống như khi không có cân điện tử chính xác (điều kiện tham số không thoả), bạn vẫn xếp hạng được \"ai nặng hơn ai\" bằng cách bế thử trên tay (so sánh THỨ HẠNG) — kém chính xác hơn cân điện tử, nhưng vẫn dùng được khi không có lựa chọn tốt hơn.",
 full:"Bảng tương ứng tham số ↔ phi tham số, và hạn chế chung: cả 4 kiểm định phi tham số CHỈ cho ý nghĩa thống kê, KHÔNG có cỡ hiệu ứng chuẩn đi kèm như d hay eta².",
 tableHtml:
  '<table class="t"><tr><th>Kiểm định THAM SỐ</th><th>"Anh em song sinh" PHI THAM SỐ</th><th>Dùng khi nào</th></tr>'+
  '<tr><td>T-test độc lập</td><td>Mann-Whitney U</td><td>So 2 nhóm KHÁC NHAU, dữ liệu thứ bậc/lệch nặng</td></tr>'+
  '<tr><td>T-test bắt cặp</td><td>Wilcoxon</td><td>So CÙNG nhóm 2 lần đo, dữ liệu thứ bậc/lệch nặng</td></tr>'+
  '<tr><td>ANOVA một chiều</td><td>Kruskal-Wallis</td><td>So 3+ nhóm KHÁC NHAU, dữ liệu thứ bậc/lệch nặng</td></tr>'+
  '<tr><td>ANOVA đo lường lặp lại</td><td>Friedman</td><td>So CÙNG nhóm 3+ lần đo, dữ liệu thứ bậc/lệch nặng</td></tr></table>'+
  '<p><b>Ví dụ ngành khác — Marketing khảo sát (minh hoạ):</b> so mức độ hài lòng (thang Likert 1-5, dữ liệu THỨ BẬC, không phải khoảng/tỉ lệ) giữa 3 nhóm khách hàng — dùng Kruskal-Wallis, KHÔNG dùng ANOVA, vì thang Likert vi phạm điều kiện dữ liệu khoảng/tỉ lệ của ANOVA.</p>',
 example:"Dữ liệu thật: Mann-Whitney đánh giá theo giới tính, U=6416, p=0,127 — không đủ bằng chứng khác biệt giữa nam và nữ."}},

{id:"pearson-r", module:"08", tags:["tương quan"],
 vi:{term:"Hệ số tương quan Pearson (r)", short:"Dấu = HƯỚNG, độ lớn = ĐỘ MẠNH. Chạy từ −1 đến +1, đo quan hệ TUYẾN TÍNH.",
 nomNa:"Tưởng tượng vẽ chấm 2 trục X-Y cho từng người: nếu các chấm xếp thành đường thẳng dốc LÊN rõ rệt → r dương cao. Thẳng dốc XUỐNG → r âm. Chấm rải lung tung như trời đầy sao, không theo đường nào → r gần 0.",
 full:"Công thức: r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)²·Σ(yᵢ−ȳ)²]. Dấu dương: cùng tăng/giảm. Dấu âm: nghịch biến — KHÔNG có nghĩa \"yếu hơn\". r CHÍNH LÀ cỡ hiệu ứng. r² = % biến thiên Y giải thích được bởi X. Pearson r CHỈ đo quan hệ TUYẾN TÍNH.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Ví dụ r DƯƠNG</th><th>Ví dụ r ÂM</th></tr>'+
  '<tr><td>Giáo dục (thật)</td><td>Giờ tự học ~ điểm Toán: r=0,582 (n=240)</td><td>— (ví dụ r âm không có trong module này)</td></tr>'+
  '<tr><td>Kinh tế (minh hoạ)</td><td>Chi tiêu quảng cáo ~ doanh số bán hàng</td><td>Giá sản phẩm ~ số lượng bán ra (giá tăng, lượng bán thường giảm)</td></tr>'+
  '<tr><td>Y học thể thao (minh hoạ)</td><td>Số giờ tập luyện/tuần ~ sức bền tim mạch</td><td>Tuổi tác ~ tốc độ chạy 100m (càng lớn tuổi thường càng chậm)</td></tr></table>',
 example:"Giờ tự học vs điểm Toán (n=240, thật): r=0,582, r²=0,338 → cỡ hiệu ứng LỚN, ≈34% biến thiên điểm Toán giải thích được bởi giờ tự học — nhưng KHÔNG chứng minh học nhiều GÂY RA điểm cao (xem mục \"Tương quan không phải nhân quả\")."}},

{id:"tuong-quan-rieng-phan", module:"08", tags:["tương quan"],
 vi:{term:"Tương quan riêng phần (partial correlation)", short:"Tính r giữa 2 biến SAU KHI loại bỏ ảnh hưởng của biến thứ 3.",
 nomNa:"Giống như muốn biết \"tập gym có làm người ta vui hơn không\", nhưng lo ngại cả tập gym LẪN niềm vui đều do \"có nhiều thời gian rảnh\" gây ra — tương quan riêng phần giúp \"khử\" ảnh hưởng của yếu tố thời gian rảnh, để nhìn thấy mối quan hệ THẬT giữa tập gym và niềm vui.",
 full:"Công thức: r_XY·Z = (r_XY − r_XZ×r_YZ) / √[(1−r_XZ²)(1−r_YZ²)]. Nếu Z không tương quan với cả X lẫn Y, công thức tự động cho r_XY·Z≈r_XY.",
 tableHtml:
  '<p><b>Tính tay ví dụ minh hoạ:</b> giả sử r(giờ ngủ, điểm thi)=0,60; r(giờ ngủ, tuổi)=0,50; r(điểm thi, tuổi)=0,40. Kiểm soát biến Tuổi:</p>'+
  '<div class="pd-formula"><div class="pd-formula-math">r = (0,60 − 0,50×0,40) / √[(1−0,50²)(1−0,40²)] = (0,60−0,20) / √(0,75×0,84) = 0,40/0,7937 ≈ <b>0,50</b></div></div>'+
  '<p class="cap">Tương quan gốc 0,60 giảm còn 0,50 sau khi kiểm soát Tuổi — một phần của tương quan gốc là do cả 2 biến cùng liên quan tới Tuổi.</p>'+
  '<p><b>Ví dụ ngành khác — Kinh tế lao động (minh hoạ):</b> tương quan giữa "số năm đi học" và "thu nhập" có thể bị ảnh hưởng bởi "xuất thân gia đình giàu/nghèo" (biến thứ 3) — tương quan riêng phần kiểm soát xuất thân để xem giáo dục có tự nó liên quan thu nhập hay không.</p>',
 example:"Dữ liệu thật (PISA): r(thiếu học liệu, điểm KH)=−0,039. Kiểm soát \"thiếu nhân sự\" (liên quan yếu với điểm KH, r≈0,002) → r riêng phần=−0,051, GẦN NHƯ KHÔNG đổi — vì biến kiểm soát không liên quan đủ mạnh tới CẢ HAI biến chính."}},

{id:"phi-eta-multiple-corr", module:"08", tags:["tương quan", "ít dùng"],
 vi:{term:"Phi coefficient, Eta (η), Multiple correlation (R)", short:"Ba độ đo liên hệ ít dùng hơn Pearson/Spearman, nhưng mỗi cái có đúng một tình huống riêng.",
 nomNa:"Phi giống như Pearson nhưng chỉ dùng được cho câu hỏi 'có/không' (như đậu/rớt). Eta giống Pearson nhưng KHÔNG bắt buộc quan hệ phải là đường thẳng (dùng được cho đường cong). Multiple R giống Pearson nhưng cho phép NHIỀU biến dự đoán cùng lúc thay vì chỉ 1.",
 full:"Phi: hai biến \"nhị phân THẬT\" (vd giới tính × đậu/rớt). Eta (η): quan hệ PHI TUYẾN (đường cong). Multiple correlation (R): một biến phụ thuộc được dự đoán từ TỔ HỢP NHIỀU biến độc lập — nền tảng của hồi quy đa biến (Module 09).",
 tableHtml:
  '<table class="t"><tr><th>Độ đo</th><th>Ví dụ Giáo dục</th><th>Ví dụ ngành khác (minh hoạ)</th></tr>'+
  '<tr><td>Phi coefficient</td><td>Giới tính × Đậu/Rớt bài thi</td><td>Y tế: Hút thuốc (có/không) × Mắc bệnh phổi (có/không)</td></tr>'+
  '<tr><td>Eta (η)</td><td>Căng thẳng~hiệu suất (hình chữ U ngược)</td><td>Nông nghiệp: Lượng phân bón~năng suất (bón ít: tăng; bón quá nhiều: cây chết, năng suất giảm)</td></tr>'+
  '<tr><td>Multiple R</td><td>Điểm Toán dự đoán từ giờ tự học + điểm chuyên cần + IQ</td><td>Bất động sản: Giá nhà dự đoán từ diện tích + vị trí + tuổi nhà</td></tr></table>',
 example:"Căng thẳng~hiệu suất hình chữ U ngược (thật, Module 08 phần 3): Pearson r có thể ra gần 0 dù liên hệ rất rõ (phần tăng và phần giảm triệt tiêu nhau trong 1 con số), nhưng Eta vẫn phát hiện được vì không giả định đường thẳng — thử trực tiếp bằng widget tương tác trên trang Module 08."}},

{id:"tuong-quan-khong-phai-nhan-qua", module:"08", tags:["nhân quả", "bẫy phổ biến"],
 vi:{term:"Tương quan không phải nhân quả", short:"\"Bàn tay to tương quan bàn chân to\" không có nghĩa tay to GÂY RA chân to.",
 nomNa:"Thấy trời có mây đen VÀ trời sắp mưa luôn đi cùng nhau không có nghĩa \"mây đen GÂY RA mưa\" theo nghĩa nhân quả đơn giản — thực ra cả 2 đều do cùng một hiện tượng khí tượng (hơi ẩm ngưng tụ) gây ra.",
 full:"Hai biến tương quan cao có thể do: (1) A GÂY RA B; (2) chiều NGƯỢC LẠI (B gây A); (3) BIẾN THỨ BA gây ra cả hai (confounding); (4) hoàn toàn TRÙNG HỢP ngẫu nhiên (spurious correlation).",
 tableHtml:
  '<table class="t"><tr><th>Ví dụ</th><th>Tương quan quan sát</th><th>Cách giải thích ĐÚNG</th></tr>'+
  '<tr><td>Bàn tay to ~ bàn chân to (Cohen et al.)</td><td>Cao</td><td>Biến thứ 3: vóc dáng cơ thể tổng thể</td></tr>'+
  '<tr><td>Phim Nicolas Cage/năm ~ người chết đuối bể bơi (Tyler Vigen, thật)</td><td>r&gt;0,6</td><td>Trùng hợp ngẫu nhiên thuần tuý (spurious)</td></tr>'+
  '<tr><td>Số lính cứu hoả ~ thiệt hại đám cháy (kinh điển, minh hoạ)</td><td>Dương cao</td><td>Biến thứ 3: quy mô đám cháy</td></tr>'+
  '<tr><td>Doanh số kem ~ số vụ đuối nước (kinh điển, minh hoạ)</td><td>Dương cao</td><td>Biến thứ 3: thời tiết nóng (mùa hè)</td></tr></table>',
 example:"Trước khi diễn giải một tương quan là có ý nghĩa THỰC TIỄN, luôn tự hỏi: (1) có biến thứ ba nào giải thích cả hai không? (2) thiết kế nghiên cứu (quan sát hay thực nghiệm có kiểm soát) có cho phép suy luận nhân quả không?"}},

{id:"bon-thang-do", module:"01", tags:["thang đo"],
 vi:{term:"Bốn thang đo dữ liệu", short:"Định danh → Thứ bậc → Khoảng → Tỉ lệ — mỗi thang KẾ THỪA đặc điểm thang trước rồi thêm 1 đặc điểm mới.",
 nomNa:"Giống như 4 cấp \"quyền hạn\" trong 1 trò chơi: định danh chỉ được PHÂN LOẠI (đội Đỏ/Xanh); thứ bậc thêm được XẾP HẠNG (nhất/nhì/ba); khoảng thêm được ĐO KHOẢNG CÁCH (hơn 5 điểm) nhưng chưa có \"điểm 0 tuyệt đối\"; tỉ lệ có đủ mọi quyền kể cả nói \"gấp đôi\".",
 full:"Mỗi thang kế thừa đặc điểm thang trước rồi thêm 1 đặc điểm mới — không được dùng phép tính của thang CAO HƠN cho dữ liệu ở thang THẤP HƠN.",
 tableHtml:
  '<table class="t"><tr><th>Thang đo</th><th>Đặc điểm mới</th><th>Ví dụ Giáo dục</th><th>Ví dụ Y tế (minh hoạ)</th><th>Phép tính được phép</th></tr>'+
  '<tr><td><b>Định danh</b></td><td>Chỉ phân loại</td><td>Loại trường (công/tư)</td><td>Nhóm máu (A/B/O/AB)</td><td>Đếm tần số, mode</td></tr>'+
  '<tr><td><b>Thứ bậc</b></td><td>+ Có thứ tự</td><td>Xếp hạng học lực (Giỏi&gt;Khá&gt;TB)</td><td>Mức độ đau (1-10 tự đánh giá)</td><td>+ Trung vị, percentile</td></tr>'+
  '<tr><td><b>Khoảng</b></td><td>+ Khoảng cách đều, KHÔNG có 0 thật</td><td>Điểm IQ</td><td>Nhiệt độ cơ thể °C</td><td>+ Trung bình, SD (không tỉ số)</td></tr>'+
  '<tr><td><b>Tỉ lệ</b></td><td>+ Có điểm 0 thật</td><td>Giờ tự học, điểm thi 0-10</td><td>Nhịp tim (lần/phút), liều thuốc (mg)</td><td>+ Mọi phép tính, kể cả "gấp đôi"</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">SPSS/PSPP gộp Khoảng+Tỉ lệ thành 1 loại gọi là "Scale" vì hầu hết phép thống kê áp dụng như nhau cho cả hai.</p>',
 example:"Không thể nói '100°F nóng gấp đôi 50°F' (thang khoảng, 0°F không phải 'không có nhiệt') — gấp đôi thật của 50°F là 68°F. Tương tự IQ 150 KHÔNG 'thông minh gấp đôi' IQ 75, và 40°C sốt KHÔNG 'nóng gấp đôi' 20°C bình thường — cùng lỗi áp sai phép tính cho thang khoảng."}},

{id:"tham-so-phi-tham-so", module:"01", tags:["thang đo"],
 vi:{term:"Dữ liệu tham số & phi tham số", short:"Tham số cần dữ liệu khoảng/tỉ lệ + phân phối chuẩn; phi tham số không đòi hỏi những điều kiện đó.",
 nomNa:"Giống như chọn giữa cân điện tử chính xác (tham số — mạnh, nhưng cần pin tốt và mặt bàn phẳng, tức \"điều kiện\" phải thoả) và cân lò xo đơn giản (phi tham số — kém chính xác hơn nhưng dùng được ở MỌI điều kiện, kể cả khi không có điện).",
 full:"Kiểm định tham số (t-test, ANOVA, Pearson r...) giả định dữ liệu ở thang khoảng/tỉ lệ VÀ xấp xỉ chuẩn — mạnh hơn nếu điều kiện thoả. Kiểm định phi tham số không đòi hỏi, nhưng thường kém mạnh hơn.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Tình huống ưu tiên THAM SỐ</th><th>Tình huống ưu tiên PHI THAM SỐ</th></tr>'+
  '<tr><td>Giáo dục</td><td>Điểm thi 0-10 (thang tỉ lệ), gần chuẩn</td><td>Xếp hạng học lực Giỏi/Khá/TB (thang thứ bậc)</td></tr>'+
  '<tr><td>Khảo sát hài lòng (minh hoạ)</td><td>Số tiền chi tiêu (VNĐ, thang tỉ lệ)</td><td>Mức hài lòng thang Likert 1-5 (thứ bậc)</td></tr>'+
  '<tr><td>Y tế (minh hoạ)</td><td>Huyết áp đo bằng máy (mmHg, liên tục, gần chuẩn)</td><td>Mức độ đau tự đánh giá 1-10 (thứ bậc, chủ quan)</td></tr></table>',
 example:"Dữ liệu thứ bậc (xếp hạng học lực, thang Likert) hoặc lệch chuẩn nặng (vd thu nhập, luôn lệch dương — xem mục Skewness) → ưu tiên phi tham số, dù có sẵn công cụ đo chính xác hơn."}},

{id:"xu-huong-trung-tam-phan-tan", module:"03", tags:["mô tả"],
 vi:{term:"Xu hướng trung tâm & độ phân tán", short:"Mode/Median/Mean đo \"trung tâm\"; SD/Range/IQR đo \"phân tán\" — không bao giờ chỉ báo cáo một mình trung bình.",
 nomNa:"Hai lớp học có cùng điểm trung bình 7,0 có thể RẤT khác nhau: lớp A ai cũng tầm 6,5-7,5 (đồng đều), lớp B có người 3 điểm người 10 điểm (phân hoá mạnh) — nếu chỉ nghe \"trung bình 7,0\" sẽ tưởng 2 lớp giống hệt nhau, trong khi thực tế hoàn toàn khác.",
 full:"Mode: mọi thang đo, bền với ngoại lai. Median: từ thứ bậc trở lên, bền với ngoại lai. Mean (x̄=Σxᵢ/n): khoảng/tỉ lệ, KHÔNG bền — dễ bị ngoại lai kéo lệch. SD (s=√[Σ(xᵢ−x̄)²/(n−1)]): trung bình khoảng cách mỗi điểm tới trung bình.",
 tableHtml:
  '<p><b>Tính tay trên ví dụ nhỏ:</b> 3 điểm Toán {6, 7, 8} → x̄=(6+7+8)/3=7. Độ lệch: −1, 0, +1 → bình phương: 1, 0, 1 → tổng=2 → s²=2/(3−1)=1 → s=√1=<b>1</b>.</p>'+
  '<table class="t"><tr><th>Ngành</th><th>2 nhóm CÙNG trung bình, KHÁC SD</th></tr>'+
  '<tr><td>Giáo dục (thật, Cohen et al. tr.762-764)</td><td>3 tập điểm cùng TB=6: tập có ngoại lai (giá trị 20) → SD=7,91, gấp 11 lần tập không ngoại lai</td></tr>'+
  '<tr><td>Lương nhân viên (minh hoạ)</td><td>Công ty A: mọi người lương 15-18 triệu (TB=16tr, SD nhỏ). Công ty B: đa số 10tr nhưng sếp 50tr (TB=16tr NHƯ NHAU, SD rất lớn)</td></tr></table>',
 example:"Bài học: không bao giờ báo cáo MỘT MÌNH trung bình. Hai công ty cùng \"lương trung bình 16 triệu\" có thể có mức độ công bằng nội bộ HOÀN TOÀN khác nhau — SD mới cho biết câu chuyện đó."}},

{id:"hoi-quy-don-da-bien", module:"09", tags:["hồi quy"],
 vi:{term:"Hồi quy tuyến tính đơn biến & đa biến", short:"Ŷ = a + b·X (đơn biến) hoặc Ŷ = a + b₁X₁ + b₂X₂ +... (đa biến) — khác tương quan ở chỗ có HƯỚNG dự đoán rõ ràng.",
 nomNa:"Tương quan chỉ nói \"2 biến đi cùng nhau\" (không phân biệt ai dự đoán ai). Hồi quy giống như một CÔNG THỨC MÁY TÍNH: bỏ giá trị X vào, máy TÍNH RA dự đoán cho Y — có chiều rõ ràng, giống công thức đổi độ C sang độ F vậy.",
 full:"Đơn biến: Y từ MỘT biến X. a=giá trị Ŷ khi X=0; b=Y thay đổi bao nhiêu khi X tăng 1 đơn vị. R² giống hệt r² của Pearson r. Đa biến: mở rộng sang NHIỀU biến độc lập — mỗi bₖ đo ảnh hưởng khi GIỮ NGUYÊN các biến khác (ceteris paribus).",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Phương trình</th><th>Diễn giải hệ số b</th></tr>'+
  '<tr><td>Giáo dục (thật, n=240)</td><td>math = 35,58 + 2,51×study_hours</td><td>Mỗi giờ tự học thêm → điểm Toán dự đoán tăng 2,51 điểm</td></tr>'+
  '<tr><td>Bất động sản (minh hoạ)</td><td>Giá nhà(triệu) = 500 + 15×Diện tích(m²)</td><td>Mỗi m² thêm → giá nhà dự đoán tăng 15 triệu</td></tr>'+
  '<tr><td>Y tế (minh hoạ)</td><td>Huyết áp = 90 + 0,8×Tuổi</td><td>Mỗi năm tuổi tăng → huyết áp dự đoán tăng 0,8 đơn vị</td></tr></table>',
 example:"Dữ liệu thật: b=2,51 (SE=0,228, t=11,03, p&lt;0,001). Lưu ý: học sinh thấp nhất thật sự học 0,5 giờ — KHÔNG ai học 0 giờ, nên diễn giải a=35,58 (ngoại suy ra X=0, ngoài phạm vi dữ liệu quan sát) cần hết sức thận trọng, giống việc không nên dùng công thức giá nhà để đoán giá một căn nhà diện tích 0m²."}},

{id:"beta-chuan-hoa", module:"09", tags:["hồi quy"],
 vi:{term:"Hệ số Beta chuẩn hoá (β)", short:"So sánh biến nào \"quan trọng\" hơn — hệ số B thô KHÔNG so sánh được giữa các biến khác đơn vị đo.",
 nomNa:"Không thể so sánh trực tiếp \"1kg gạo\" với \"1 lít dầu\" để biết cái nào \"nhiều\" hơn — phải quy về cùng đơn vị (vd cùng giá tiền) mới so được. Beta làm đúng việc đó cho các biến hồi quy: quy mọi biến về cùng \"đơn vị độ lệch chuẩn\" để so sánh công bằng.",
 full:"β = b × (SD của X / SD của Y) — chuẩn hoá cả X,Y về thang z-score, không còn đơn vị gốc, so sánh được giữa các biến khác đơn vị.",
 tableHtml:
  '<table class="t"><tr><th>Biến</th><th>Hệ số B thô (đơn vị gốc)</th><th>Hệ số β chuẩn hoá</th></tr>'+
  '<tr><td>study_hours (giờ)</td><td>2,49 điểm/giờ</td><td><b>0,577</b></td></tr>'+
  '<tr><td>h1 (thang Likert 1-5)</td><td>2,15 điểm/mức</td><td>0,229</td></tr>'+
  '<tr><td>a1 (thang Likert 1-5)</td><td>— (âm)</td><td>−0,297</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Ví dụ ngành khác (Marketing, minh hoạ): so sánh "chi tiêu quảng cáo (triệu đồng)" và "số lượt tương tác mạng xã hội (lượt)" ảnh hưởng tới doanh số — 2 biến đơn vị hoàn toàn khác nhau, BẮT BUỘC dùng β mới so sánh được cái nào tác động mạnh hơn, không thể so B thô.</p>',
 example:"B(study_hours)=2,49 vs B(h1)=2,15 — nhìn thô tưởng study_hours chỉ hơn nhẹ. Nhưng β(study_hours)=0,577 vs β(h1)=0,229 → study_hours mạnh hơn HẲN (gấp ~2,5 lần), vì study_hours có độ phân tán (SD) khác hẳn thang Likert 1-5."}},

{id:"vif-da-cong-tuyen", module:"09", tags:["hồi quy", "giả định"],
 vi:{term:"VIF & đa cộng tuyến (multicollinearity)", short:"VIF cao → biến độc lập \"trùng lặp thông tin\" với nhau, làm hệ số B không ổn định.",
 nomNa:"Nếu đưa CẢ \"chiều cao tính bằng cm\" LẪN \"chiều cao tính bằng inch\" vào cùng 1 mô hình dự đoán — hai biến này THỰC CHẤT là MỘT thông tin nói 2 lần, mô hình sẽ \"bối rối\" không biết chia công cho biến nào. Đó chính là đa cộng tuyến ở mức cực đoan nhất.",
 full:"VIF(Xᵢ)=1/(1−R²ᵢ), R²ᵢ=R² khi hồi quy CHÍNH Xᵢ theo TẤT CẢ biến độc lập còn lại. VIF cao (ngưỡng &gt;5 hoặc &gt;10 tuỳ quy ước) → hệ số B không ổn định.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Cặp biến dễ đa cộng tuyến</th><th>Vì sao</th></tr>'+
  '<tr><td>Giáo dục</td><td>Điểm Toán kỳ 1 & điểm Toán kỳ 2 cùng đưa vào 1 mô hình</td><td>Hai điểm số đo gần như cùng 1 năng lực</td></tr>'+
  '<tr><td>Kinh tế (minh hoạ)</td><td>GDP & Tổng chi tiêu tiêu dùng quốc gia</td><td>Chi tiêu tiêu dùng là MỘT PHẦN LỚN cấu thành GDP</td></tr>'+
  '<tr><td>Y tế (minh hoạ)</td><td>Cân nặng & Chỉ số BMI cùng đưa vào 1 mô hình</td><td>BMI được TÍNH TỪ cân nặng (và chiều cao)</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">VIF là 1 trong 4 giả định hồi quy cần kiểm tra, cùng Durbin-Watson (sai số độc lập, lý tưởng gần 2), Shapiro-Wilk trên phần dư (chuẩn), và biểu đồ phần dư~giá trị dự đoán (homoscedasticity).</p>',
 example:"Mô hình thật (Module 09): VIF cao nhất=1,02 (rất an toàn, ngưỡng &lt;5). Durbin-Watson=2,05 (rất gần 2, đạt) — mô hình này KHÔNG có vấn đề đa cộng tuyến."}},

{id:"efa-kmo-bartlett", module:"10", tags:["EFA"],
 vi:{term:"EFA: KMO, Bartlett, Factor loading, Eigenvalue", short:"Rút gọn NHIỀU biến quan sát thành MỘT SỐ ÍT khái niệm ẩn (nhân tố) — 2 kiểm tra bắt buộc trước khi chạy.",
 nomNa:"Giống như xem 20 câu hỏi khảo sát và nhận ra 8 câu thực chất đều đang hỏi về \"mức độ lo âu\" (dù dùng từ ngữ khác nhau), 7 câu khác đều hỏi về \"mức độ hứng thú\" — EFA tự động TÌM RA các nhóm câu hỏi \"cùng phe\" đó mà không cần bạn tự đọc từng câu.",
 full:"KMO (0-1): dữ liệu có đủ tương quan chung để rút gọn không. Bartlett: ma trận tương quan có khác ma trận đơn vị không. Factor loading (λ): tương quan biến~nhân tố, |λ|≥0,4-0,5 là \"tải rõ\". Eigenvalue &gt;1 (Kaiser) quyết định giữ bao nhiêu nhân tố.",
 tableHtml:
  '<table class="t"><tr><th>Chỉ số</th><th>Kết quả thật (Module 10, n=237)</th><th>Ngưỡng tham khảo</th></tr>'+
  '<tr><td>KMO</td><td>0,688</td><td>&gt;0,6 tạm được, &gt;0,8 tốt</td></tr>'+
  '<tr><td>Bartlett</td><td>χ²=313,28, p&lt;0,001</td><td>p&lt;0,05 là đạt</td></tr>'+
  '<tr><td>Eigenvalue NT1 / NT2</td><td>2,21 / 1,73</td><td>&gt;1 (Kaiser) mới giữ lại</td></tr></table>'+
  '<p><b>Ví dụ ngành khác — Tâm lý học lâm sàng (minh hoạ):</b> bộ 20 câu hỏi đo \"sức khoẻ tinh thần\" có thể rút gọn qua EFA thành 3 nhân tố ẩn: trầm cảm, lo âu, stress (đây chính là cách thang đo DASS-21 nổi tiếng trong tâm lý học được xây dựng).</p>',
 example:"EFA 2 nhân tố xoay Varimax (thật): items hứng thú (h1-h3) tải rõ lên Nhân tố 2 (0,60-0,75); items lo âu (a1-a3) tải rõ lên Nhân tố 1 (0,70-0,73) — đúng khớp với tên gọi người thiết kế bảng hỏi đã đặt cho từng nhóm câu hỏi ban đầu."}},

{id:"phan-tich-cum", module:"10", tags:["cluster"],
 vi:{term:"Phân tích cụm (Cluster Analysis)", short:"Nhóm các ĐỐI TƯỢNG QUAN SÁT (không phải BIẾN) thành các nhóm có hồ sơ tương tự nhau — khác EFA.",
 nomNa:"EFA giống như nhóm các MÔN HỌC lại (Toán+Lý+Hoá vào nhóm \"tự nhiên\"). Cluster giống như nhóm các HỌC SINH lại (ai học giỏi tự nhiên, kém xã hội → 1 nhóm; ai giỏi đều các môn → nhóm khác) — EFA nhóm cột, Cluster nhóm hàng trong cùng 1 bảng dữ liệu.",
 full:"EFA nhóm BIẾN ('câu hỏi nào đo cùng khái niệm?'); Cluster nhóm ĐỐI TƯỢNG ('ai/trường nào giống nhau?'). Chỉ số Silhouette (-1 đến 1) giúp chọn số cụm k — tối ưu thống kê và khả năng DIỄN GIẢI đôi khi đánh đổi nhau.",
 tableHtml:
  '<table class="t"><tr><th>k (số cụm)</th><th>Silhouette</th><th>Cỡ các cụm</th></tr>'+
  '<tr><td>2</td><td><b>0,252</b> (tốt nhất về thống kê)</td><td>63 / 132 trường</td></tr>'+
  '<tr><td>3</td><td>0,180</td><td>64 / 49 / 82 trường (diễn giải rõ hơn)</td></tr></table>'+
  '<p><b>Ví dụ ngành khác — Marketing (minh hoạ, "phân khúc khách hàng"):</b> cluster 10.000 khách hàng theo (tần suất mua, giá trị đơn hàng, loại sản phẩm) thành 4 nhóm: "khách VIP", "khách thường xuyên giá trị thấp", "khách mua 1 lần", "khách có nguy cơ rời bỏ" — mỗi nhóm nhận chiến lược marketing khác nhau.</p>',
 example:"K-means trên 5 chỉ số WLE PISA (thật, n=195): xét THUẦN theo Silhouette, k=2 tối ưu nhất — nhưng k=3 cho câu chuyện diễn giải RÕ hơn (vd phân biệt rõ 3 nhóm trường theo mức nguồn lực), nên nhà nghiên cứu có thể cân nhắc chọn k=3 dù chỉ số thống kê thấp hơn một chút."}},

{id:"cronbach-alpha", module:"12", tags:["độ tin cậy"],
 vi:{term:"Độ tin cậy (Reliability) & Cronbach's Alpha", short:"Đo công cụ có NHẤT QUÁN không (đo lại có ra kết quả ổn định không) — KHÁC với việc đo có ĐÚNG hay không (độ giá trị).",
 nomNa:"Giống như hỏi 3 câu khác nhau để đo \"mức độ bạn thích Toán\": nếu ai TRẢ LỜI CAO ở câu 1 cũng thường trả lời CAO ở câu 2 và 3 (nhất quán với nhau) → 3 câu này \"ăn khớp\", Cronbach's alpha cao. Nếu câu trả lời lộn xộn không liên quan nhau → alpha thấp, 3 câu có thể đang đo 3 thứ khác nhau chứ không phải cùng 1 khái niệm.",
 full:"α=(k/(k−1))×(1−Σσᵢ²/σ²ₜ). α cao nghĩa là các item \"đồng hành\" chặt chẽ. Ngưỡng phổ biến: &lt;0,60 kém, 0,60-0,70 tạm được, 0,70-0,80 chấp nhận được, 0,80-0,90 tốt, &gt;0,90 có thể là item TRÙNG LẶP quá mức.",
 tableHtml:
  '<table class="t"><tr><th>Ngành</th><th>Thang đo</th><th>Cronbach α</th><th>Mức</th></tr>'+
  '<tr><td>Giáo dục (thật)</td><td>Hứng thú (h1,h2,h3)</td><td>0,713</td><td>Chấp nhận được</td></tr>'+
  '<tr><td>Giáo dục (thật)</td><td>Lo âu (a1,a2,a3)</td><td>0,759</td><td>Gần mức tốt</td></tr>'+
  '<tr><td>Tâm lý học (minh hoạ)</td><td>Thang trầm cảm DASS-21 (7 câu)</td><td>~0,90 (công bố gốc)</td><td>Xuất sắc</td></tr></table>'+
  '<p class="cap" style="margin-top:.6em">Item-total correlation và "Alpha nếu xoá item" giúp phát hiện item YẾU đang kéo thấp độ tin cậy chung — nếu xoá 1 item mà alpha TĂNG lên, item đó có thể đang "lạc đề" so với các item còn lại.</p>',
 example:"Thang Hứng thú (h1,h2,h3, n=237-240, thật): α=0,713. Đây là thang ĐÃ ĐẠT ngưỡng tối thiểu để dùng được — nếu α chỉ 0,45 (dưới 0,60), nhà nghiên cứu cần xem lại từng câu hỏi, có thể phải bỏ bớt hoặc viết lại câu trước khi dùng thang đo này cho phân tích chính thức."}},

{id:"do-gia-tri-vs-tin-cay", module:"12", tags:["độ tin cậy", "validity"],
 vi:{term:"Độ giá trị (Validity) vs Độ tin cậy (Reliability)", short:"Tin cậy = đo NHẤT QUÁN. Giá trị = đo ĐÚNG thứ cần đo. Tin cậy cao KHÔNG đảm bảo giá trị cao.",
 nomNa:"Một cái cân bị LỆCH luôn báo thừa đúng 2kg mỗi lần cân (RẤT nhất quán — cân 10 lần ra cùng 1 con số sai) nhưng vẫn SAI (không đo đúng cân nặng thật). Độ tin cậy là \"nhất quán\", độ giá trị là \"đúng\" — hai thứ khác hẳn nhau.",
 full:"Độ tin cậy cao KHÔNG đảm bảo độ giá trị cao (cân lệch vẫn nhất quán). Nhưng độ giá trị cao ĐÒI HỎI độ tin cậy tối thiểu (không thể đo ĐÚNG nếu kết quả mỗi lần một khác) — tin cậy là điều kiện CẦN nhưng chưa ĐỦ cho giá trị.",
 tableHtml:
  '<table class="t"><tr><th>Tình huống</th><th>Tin cậy</th><th>Giá trị</th></tr>'+
  '<tr><td>Cân bị lệch +2kg luôn luôn</td><td>CAO (rất nhất quán)</td><td>THẤP (số liệu sai)</td></tr>'+
  '<tr><td>Cân lúc thì +2kg lúc thì −3kg ngẫu nhiên</td><td>THẤP</td><td>THẤP (không thể đúng nếu đã không ổn định)</td></tr>'+
  '<tr><td>Cân chuẩn, đã hiệu chỉnh</td><td>CAO</td><td>CAO</td></tr>'+
  '<tr><td>Thang đo "lo âu" nhưng câu hỏi thực ra đo "căng thẳng công việc"</td><td>CAO (α=0,759)</td><td>ĐÁNG NGHI (đo nhầm khái niệm)</td></tr></table>',
 example:"Thang đo 'lo âu' có α=0,759 (nhất quán tốt, thật) — nhưng nếu các câu hỏi thực ra đang đo 'căng thẳng' chứ không phải 'lo âu' thuần tuý (vd toàn hỏi về deadline công việc thay vì cảm giác lo sợ), độ giá trị vẫn có vấn đề dù độ tin cậy cao — đây là lý do phải kiểm tra CẢ HAI, không chỉ chạy Cronbach's alpha rồi dừng lại."}},

{id:"percentR-bat-doi-xung", module:"08", tags:["tương quan", "ít dùng"],
 vi:{term:"%R và phần trăm khác biệt (đo bất đối xứng)", short:"Khác Pearson r (luôn ĐỐI XỨNG), hai chỉ số này đổi chiều tính sẽ ra câu hỏi KHÁC, không phải lỗi.",
 nomNa:"\"A gấp đôi B\" và \"B bằng nửa A\" là 2 cách nói CÙNG một sự thật nhưng KHÔNG hoán đổi vai trò A/B tự do được — hỏi \"A gấp mấy lần B\" và \"B gấp mấy lần A\" là 2 câu hỏi khác nhau, ra 2 con số khác nhau (4,5 lần vs 0,22 lần), dù cùng mô tả 1 tình huống.",
 full:"Dùng cho 2 biến định danh. %R = tỉ số phần trăm giữa hai nhóm ở cùng hạng mục. BẤT ĐỐI XỨNG: đổi chiều tính vẫn hợp lệ, chỉ hỏi câu khác — khác Pearson r, nơi r(X,Y) LUÔN bằng r(Y,X).",
 tableHtml:
  '<table class="t"><tr><th>Chiều hỏi</th><th>Phép tính</th><th>Kết quả</th><th>Diễn giải</th></tr>'+
  '<tr><td>Lao động so với trung lưu</td><td>63% / 14%</td><td>4,5</td><td>Lao động không-hội-viên nhiều gấp 4,5 lần trung lưu</td></tr>'+
  '<tr><td>Trung lưu so với lao động</td><td>14% / 63%</td><td>0,22</td><td>Trung lưu không-hội-viên bằng 0,22 lần (≈1/4,5) lao động</td></tr></table>'+
  '<p><b>Ví dụ ngành khác — Dịch tễ học (minh hoạ, "relative risk"):</b> tỷ lệ mắc bệnh ở nhóm hút thuốc=20%, nhóm không hút=4% → rủi ro tương đối = 20/4 = 5 lần ("người hút thuốc có nguy cơ mắc bệnh gấp 5 lần"). Đổi chiều 4/20=0,2 vẫn đúng toán học, nhưng không ai nói theo chiều đó vì không tự nhiên bằng chiều gốc — CHỌN CHIỀU NÀO để trình bày là quyết định về cách KỂ CHUYỆN, không phải đúng/sai toán học.</p>',
 example:"Thư viện (ví dụ gốc, Cohen et al.): 63% lao động không-hội-viên, 14% trung lưu không-hội-viên → %R=63/14=4,5. Đây là lý do khi đọc báo cáo có chỉ số dạng \"gấp X lần\", luôn cần hỏi \"gấp theo chiều nào\" trước khi diễn giải."}},
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
      (item.vi.nomNa && lang==='vi' ? '<p class="cap" style="font-style:italic;color:var(--accent2)">🗣️ Nói nôm na: '+esc(item.vi.nomNa)+'</p>' : '')+
      (isFallback ? '<p class="cap" style="color:var(--warn)">'+esc(ui.fallback)+'</p>' : '')+
      '<details class="slide-zoom" style="margin-top:.6em"><summary>'+ui.seeMore+'</summary><div class="slide-zoom-body">'+
        '<p>'+esc(fullText).replace(/\n/g,'<br/>')+'</p>'+
        (item.vi.tableHtml && lang==='vi' ? item.vi.tableHtml : '')+
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
