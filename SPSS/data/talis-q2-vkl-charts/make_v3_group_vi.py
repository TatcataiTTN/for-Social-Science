# -*- coding: utf-8 -*-
"""v3 -- bai nhom TALIS, 7 bieu do chi tiet hon, dung Plotly (nhin hien dai, sac net hon
matplotlib), tieng Viet, khong co bieu do minh hoa/gia dinh nao. Moi diem deu la so that
tu weighted_results_q2.csv (BRR-Fay da kiem chung o Module VKL 5-11).
Chay: python3 -I make_v3_group_vi.py
"""
import pandas as pd, numpy as np
import plotly.graph_objects as go
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
OUT.mkdir(exist_ok=True)
CSV = HERE / "weighted_results_q2.csv"  # dat cung thu muc voi script nay
df = pd.read_csv(CSV)

COUNTRIES = ["CSH", "JPN", "KOR", "SGP"]
NAME = {"CSH": "Thượng Hải", "JPN": "Nhật Bản", "KOR": "Hàn Quốc", "SGP": "Singapore"}
SHORT = {"CSH": "TH", "JPN": "NB", "KOR": "HQ", "SGP": "SG"}
COL = {"CSH": "#2a78d6", "JPN": "#eb6834", "KOR": "#1baf7a", "SGP": "#eda100"}
HL = "#d6553a"
INK, MUTED, GRID = "#1a1a1a", "#8a8a85", "#ebe9e2"
ITEMS = ["TT4G36"] + [f"TT4G37{c}" for c in "ABCDEFGHI"]
LABEL = {
    "TT4G36": "Dùng AI nói chung (TT4G36)", "TT4G37A": "Chấm/đánh giá bài",
    "TT4G37B": "Tìm hiểu/tóm tắt chủ đề", "TT4G37C": "Lên kế hoạch bài học",
    "TT4G37D": "Hỗ trợ học sinh đặc biệt", "TT4G37E": "Điều chỉnh độ khó tài liệu",
    "TT4G37F": "Phản hồi HS/giao tiếp PH", "TT4G37G": "Xem dữ liệu kết quả HS",
    "TT4G37H": "Luyện kỹ năng tình huống thực tế", "TT4G37I": "Mục đích khác",
}
RAW = {
    "TT4G36": {"CSH": 53.7, "JPN": 17.6, "KOR": 42.5, "SGP": 75.8},
    "TT4G37A": {"CSH": 44.8, "JPN": 43.1, "KOR": 30.5, "SGP": 35.1},
    "TT4G37B": {"CSH": 71.6, "JPN": 65.3, "KOR": 51.8, "SGP": 76.8},
    "TT4G37C": {"CSH": 55.4, "JPN": 44.6, "KOR": 60.0, "SGP": 65.9},
    "TT4G37D": {"CSH": 39.1, "JPN": 38.6, "KOR": 9.7, "SGP": 15.3},
    "TT4G37E": {"CSH": 48.5, "JPN": 41.3, "KOR": 29.8, "SGP": 39.6},
    "TT4G37F": {"CSH": 36.6, "JPN": 35.0, "KOR": 42.0, "SGP": 69.2},
    "TT4G37G": {"CSH": 59.1, "JPN": 36.9, "KOR": 37.7, "SGP": 28.2},
    "TT4G37H": {"CSH": 51.5, "JPN": 38.9, "KOR": 51.1, "SGP": 40.6},
    "TT4G37I": {"CSH": 40.8, "JPN": 28.4, "KOR": 41.9, "SGP": 37.4},
}

def layout(title_text, sub_text, height=560, width=1000, bottom_margin=60):
    return dict(
        paper_bgcolor="white", plot_bgcolor="white",
        font=dict(family="Helvetica, Arial, sans-serif", color=INK, size=15),
        title=dict(text=f"<b>{title_text}</b><br><span style='font-size:13px;color:{MUTED}'>{sub_text}</span>",
                   x=0.01, xanchor="left", y=0.965, font=dict(size=20)),
        margin=dict(l=210, r=90, t=95, b=bottom_margin), height=height, width=width,
    )

def save(fig, name):
    fig.write_image(str(OUT / name), scale=2)
    print("saved", name)

# ================================================================ 1. Headline TT4G36, co N va CI
sub = df[df.item == "TT4G36"].set_index("country")
order = sorted(COUNTRIES, key=lambda c: sub.loc[c, "pct_weighted"])
vals = [sub.loc[c, "pct_weighted"] for c in order]
los = [sub.loc[c, "pct_weighted"] - sub.loc[c, "ci95_lo"] for c in order]
his = [sub.loc[c, "ci95_hi"] - sub.loc[c, "pct_weighted"] for c in order]
cols = [HL if c in ("SGP", "JPN") else "#d8d5cb" for c in order]
his_abs = [sub.loc[c, "ci95_hi"] for c in order]
fig = go.Figure(go.Bar(
    x=vals, y=[f"{NAME[c]}" for c in order], orientation="h",
    marker=dict(color=cols), error_x=dict(type="data", symmetric=False,
        array=his, arrayminus=los, color=INK, thickness=2, width=6),
))
for yi, c, v, hi_abs in zip(range(len(order)), order, vals, his_abs):
    fig.add_annotation(x=hi_abs + 3, y=yi, xanchor="left", yanchor="middle",
        text=f"<b>{v:.1f}%</b>  ·  n={int(sub.loc[c,'n'])}  ·  CI95% {sub.loc[c,'ci95_lo']:.1f}-{sub.loc[c,'ci95_hi']:.1f}",
        showarrow=False, font=dict(size=13, color=INK))
fig.update_layout(**layout("Tỉ lệ dùng AI dao động từ 17% đến 75% tuỳ hệ thống",
    "TT4G36 — tỉ lệ giáo viên dùng AI trong 12 tháng qua, % có trọng số, kèm cỡ mẫu n và khoảng tin cậy 95%", height=440, width=1180))
fig.update_layout(margin=dict(r=260))
fig.update_xaxes(visible=False, range=[0, 100])
fig.update_yaxes(tickfont=dict(size=15))
save(fig, "vi_v3_1_headline.png")

# ================================================================ 2. Pham vi 4 he thong (dumbbell + 2 diem giua), tat ca 10 bien
rows = []
for item in ITEMS:
    s = df[df.item == item].set_index("country")
    vv = {c: s.loc[c, "pct_weighted"] for c in COUNTRIES}
    order_c = sorted(COUNTRIES, key=lambda c: vv[c])
    rows.append((item, order_c, vv))
rows.sort(key=lambda r: r[2][r[1][-1]] - r[2][r[1][0]])

fig = go.Figure()
for i, (item, order_c, vv) in enumerate(rows):
    lo_c, hi_c = order_c[0], order_c[-1]
    mid = order_c[1:3]
    fig.add_trace(go.Scatter(x=[vv[lo_c], vv[hi_c]], y=[i, i], mode="lines",
                              line=dict(color="#e4e1d8", width=5), showlegend=False, hoverinfo="skip"))
    for c in mid:
        fig.add_trace(go.Scatter(x=[vv[c]], y=[i], mode="markers", marker=dict(size=10, color=COL[c], opacity=0.55),
                                  showlegend=False, hoverinfo="skip"))
    fig.add_trace(go.Scatter(x=[vv[lo_c]], y=[i], mode="markers+text", marker=dict(size=16, color=COL[lo_c]),
                              text=[f"{SHORT[lo_c]} {vv[lo_c]:.0f}"], textposition="middle left",
                              textfont=dict(size=12, color=MUTED), showlegend=False))
    fig.add_trace(go.Scatter(x=[vv[hi_c]], y=[i], mode="markers+text", marker=dict(size=16, color=COL[hi_c]),
                              text=[f"<b>{SHORT[hi_c]} {vv[hi_c]:.0f}</b>"], textposition="middle right",
                              textfont=dict(size=12, color=INK), showlegend=False))
for c in COUNTRIES:
    fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers", marker=dict(size=12, color=COL[c]), name=NAME[c]))
fig.update_layout(**layout("Mục đích dùng AI khác biệt giữa các hệ thống nhiều hơn hẳn tỉ lệ chung",
    "Cả 4 hệ thống cho từng biến: 2 chấm to đậm = thấp nhất/cao nhất, 2 chấm nhỏ mờ ở giữa = 2 hệ thống còn lại. Sắp theo độ chênh lệch.",
    height=680))
fig.update_xaxes(visible=False, range=[-10, 100])
fig.update_yaxes(tickmode="array", tickvals=list(range(len(rows))), ticktext=[LABEL[r[0]] for r in rows],
                  tickfont=dict(size=13), zeroline=False, showline=False, range=[-0.6, len(rows) - 0.4])
fig.update_layout(legend=dict(orientation="h", y=-0.06, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_2_pham_vi_4he.png")

# ================================================================ 3. Forest plot, day du CI95%, tat ca 10 bien
order3 = sorted(ITEMS, key=lambda it: -(df[df.item == it].ci95_hi.max() - df[df.item == it].ci95_lo.min()))
fig = go.Figure()
for i, item in enumerate(order3):
    yb = len(order3) - 1 - i
    s = df[df.item == item].set_index("country")
    is_hero = item == "TT4G36"
    for k, c in enumerate(COUNTRIES):
        row = s.loc[c]
        yy = yb + (k - 1.5) * 0.12
        col = COL[c] if is_hero else "#d2cfc5"
        fig.add_trace(go.Scatter(x=[row.ci95_lo, row.ci95_hi], y=[yy, yy], mode="lines",
                                  line=dict(color=col, width=4), showlegend=False, hoverinfo="skip"))
        fig.add_trace(go.Scatter(x=[row.pct_weighted], y=[yy], mode="markers",
                                  marker=dict(color=col, size=7), showlegend=False,
                                  hovertext=f"{NAME[c]}: {row.pct_weighted:.1f}% (n={int(row.n)})"))
    if is_hero:
        fig.add_hrect(y0=yb - 0.4, y1=yb + 0.4, fillcolor=HL, opacity=0.07, line_width=0)
        fig.add_annotation(x=92, y=yb, text="4 khoảng tin cậy<br>không chạm nhau", showarrow=False,
                            font=dict(size=11.5, color=HL), xanchor="left")
for c in COUNTRIES:
    fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers", marker=dict(size=10, color=COL[c]), name=NAME[c]))
fig.update_layout(**layout("Chỉ 1 trong 10 biến tách biệt hoàn toàn cả 4 hệ thống",
    "Mỗi đoạn ngang = khoảng tin cậy 95% của một hệ thống cho một biến; chấm tròn = điểm ước lượng. Hàng tô hồng là hàng duy nhất 4 đoạn không chồng lên nhau.",
    height=740, width=1080, bottom_margin=140))
fig.update_xaxes(range=[0, 100], gridcolor=GRID, title="% có trọng số, kèm khoảng tin cậy 95%")
fig.update_yaxes(tickmode="array", tickvals=list(range(len(order3))),
                  ticktext=[LABEL[it] for it in order3[::-1]], tickfont=dict(size=12.5),
                  zeroline=False, showline=False, range=[-0.6, len(order3) - 0.4])
fig.update_layout(legend=dict(orientation="h", y=-0.22, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_3_forest.png")

# ================================================================ 4. Scatter DEFF, gan nhan top 5
fig = go.Figure()
for c in COUNTRIES:
    s = df[df.country == c]
    fig.add_trace(go.Scatter(x=s.pct_weighted, y=s.deff, mode="markers",
                              marker=dict(size=13, color=COL[c], line=dict(width=1, color="white")),
                              name=NAME[c]))
fig.add_hline(y=1.0, line=dict(color=MUTED, width=1.3, dash="dash"))
fig.add_annotation(x=3, y=1.1, text="DEFF = 1 (coi như mẫu ngẫu nhiên đơn giản)", showarrow=False,
                    font=dict(size=11, color=MUTED), xanchor="left")
top5 = df.sort_values("deff", ascending=False).head(5)
for _, row in top5.iterrows():
    lbl = f"{row['item'].replace('TT4G37','37').replace('TT4G36','36')}-{SHORT[row.country]} (DEFF {row.deff:.2f})"
    fig.add_annotation(x=row.pct_weighted, y=row.deff, text=lbl, showarrow=True, arrowhead=0, arrowcolor=MUTED,
                        ax=30, ay=-28 if row.country != "SGP" or row["item"] != "TT4G36" else -40, font=dict(size=10.5, color=INK))
fig.update_layout(**layout("Hiệu ứng phân cụm mẫu của Singapore lớn nhất đúng ở biến có tỉ lệ cao nhất",
    "Mỗi điểm là một ô biến × hệ thống (40 điểm). DEFF = (SE thật theo thiết kế mẫu / SE nếu coi là mẫu ngẫu nhiên đơn giản)². 5 điểm có DEFF cao nhất được gắn nhãn.",
    height=680, bottom_margin=130))
fig.update_xaxes(gridcolor=GRID, title="% có trọng số")
fig.update_yaxes(gridcolor=GRID, title="DEFF (hệ số phóng đại phương sai)")
fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_4_scatter_deff.png")

# ================================================================ 5. Scatter % tho vs % trong so, gan nhan top 3, giai thich duong cheo
pts = []
for item in ITEMS:
    s = df[df.item == item].set_index("country")
    for c in COUNTRIES:
        pts.append((RAW[item][c], s.loc[c, "pct_weighted"], c, item))
fig = go.Figure()
fig.add_trace(go.Scatter(x=[0, 90], y=[0, 90], mode="lines", line=dict(color=MUTED, width=1.5, dash="dash"),
                          showlegend=False, hoverinfo="skip"))
fig.add_annotation(x=68, y=74, text="đường chéo: nơi % thô = % có trọng số", showarrow=False,
                    font=dict(size=11, color=MUTED), textangle=-38)
for c in COUNTRIES:
    xs = [p[0] for p in pts if p[2] == c]; ys = [p[1] for p in pts if p[2] == c]
    fig.add_trace(go.Scatter(x=xs, y=ys, mode="markers", marker=dict(size=12, color=COL[c], line=dict(width=1, color="white")), name=NAME[c]))
top3 = sorted(pts, key=lambda p: abs(p[0] - p[1]), reverse=True)[:3]
for p in top3:
    lbl = f"{p[3].replace('TT4G37','37').replace('TT4G36','36')}-{SHORT[p[2]]} (lệch {abs(p[0]-p[1]):.1f}đ)"
    fig.add_annotation(x=p[0], y=p[1], text=lbl, showarrow=True, arrowhead=0, arrowcolor=MUTED, ax=-45, ay=15, font=dict(size=10.5))
fig.update_layout(**layout("Trọng số hầu như không làm đổi phần trăm — hầu hết điểm nằm sát đường chéo",
    "Trục ngang: % thô (SPSS). Trục đứng: % có trọng số (BRR-Fay).<br>Đường đứt nét x=y: điểm càng xa đường này, trọng số càng đổi % nhiều; nằm đúng trên đường nghĩa là không đổi gì cả.",
    height=780, width=1080, bottom_margin=140))
fig.update_layout(margin=dict(t=130))
fig.update_xaxes(range=[0, 90], gridcolor=GRID, title="% thô (chưa trọng số, SPSS)")
fig.update_yaxes(range=[0, 90], gridcolor=GRID, title="% có trọng số (BRR-Fay)")
fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_5_scatter_raw_weighted.png")

# ================================================================ 6. Bump chart xep hang, co ghi % dau/cuoi
fig = go.Figure()
ranks, pctval = {}, {}
for item in ITEMS:
    s = df[df.item == item].set_index("country")["pct_weighted"]
    order_r = s.sort_values(ascending=False).index.tolist()
    ranks[item] = {c: order_r.index(c) + 1 for c in COUNTRIES}
    pctval[item] = s
x_lbl = [it.replace("TT4G37", "37").replace("TT4G36", "36") for it in ITEMS]
for c in COUNTRIES:
    ys = [ranks[it][c] for it in ITEMS]
    hover = [f"{NAME[c]}, {LABEL[it]}: hạng {ranks[it][c]}, {pctval[it][c]:.1f}%" for it in ITEMS]
    fig.add_trace(go.Scatter(x=x_lbl, y=ys, mode="lines+markers", line=dict(color=COL[c], width=3), marker=dict(size=10),
                              name=NAME[c], hovertext=hover, hoverinfo="text"))
fig.update_layout(**layout("Không hệ thống nào luôn dẫn đầu — thứ hạng đổi theo từng mục đích",
    "Thứ hạng 1 (cao nhất) đến 4 (thấp nhất) của mỗi hệ thống trong từng biến. Xem bảng số liệu đầy đủ (mục 1.1) để biết đúng % tại từng biến.",
    height=560, bottom_margin=90))
fig.update_yaxes(tickmode="array", tickvals=[1, 2, 3, 4], ticktext=["Hạng 1 (cao nhất)", "Hạng 2", "Hạng 3", "Hạng 4 (thấp nhất)"],
                  autorange="reversed", gridcolor=GRID)
fig.update_xaxes(tickfont=dict(size=12))
fig.update_layout(legend=dict(orientation="h", y=-0.22, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_6_bump.png")

# ================================================================ 7. MOI: co mau thuc te theo bien (do thiet ke booklet xoay)
fig = go.Figure()
for c in COUNTRIES:
    ys = [df[(df.item == it) & (df.country == c)].n.values[0] for it in ITEMS]
    fig.add_trace(go.Bar(x=[it.replace("TT4G37", "37").replace("TT4G36", "36") for it in ITEMS], y=ys,
                          name=NAME[c], marker_color=COL[c]))
fig.update_layout(**layout("Cỡ mẫu thực tế nhỏ hơn hẳn ở 9/10 biến, vì thiết kế booklet xoay vòng",
    "TT4G36 hỏi toàn bộ giáo viên; TT4G37A-I chỉ hỏi nhóm đã trả lời \"Có\" ở TT4G36 — nên cỡ mẫu các biến này thấp hơn nhiều và khác nhau giữa 4 hệ thống.",
    height=560, bottom_margin=90))
fig.update_yaxes(title="Cỡ mẫu phân tích thật (n)", gridcolor=GRID)
fig.update_xaxes(tickfont=dict(size=12))
fig.update_layout(barmode="group", legend=dict(orientation="h", y=-0.22, x=0.5, xanchor="center", font=dict(size=13)))
save(fig, "vi_v3_7_mau_n.png")

print("done")
