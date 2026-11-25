# -*- coding: utf-8 -*-
"""TALIS 2024 - Cau hoi 2 (TT4G36 + TT4G37A-I): 7 bieu do x 3 ngon ngu (vi/en/zh) theo bang mau
cua TALIS2024 poster.pptx (do #CD1E23, navy #143053 / #2F5884, xanh nhat #9FB4CC, nen trang).
  <lang>/report/  : 7 bieu do day du tieu de + chu thich (cho bao cao/tieu luan ca nhan)
  <lang>/poster/  : Bieu do 1, 2, 6 ban gon, chu to, khong tieu de (de chen vao poster)
  <lang>/captions.txt : chu thich goi y de dan duoi hinh
Moi so lieu doc tu weighted_results_q2.csv (TCHWGT + BRR-Fay, 100 trong so lap, Fay = 0.5).
Chay: python3 make_poster_charts.py   (can plotly + kaleido)
"""
import zipfile
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go

HERE = Path(__file__).resolve().parent
df = pd.read_csv(HERE / "weighted_results_q2.csv")

COUNTRIES = ["CSH", "JPN", "KOR", "SGP"]
ITEMS = ["TT4G36"] + [f"TT4G37{c}" for c in "ABCDEFGHI"]
RED, NAVY, BLUE, LIGHT = "#CD1E23", "#143053", "#2F5884", "#9FB4CC"
COL = {"SGP": RED, "CSH": NAVY, "KOR": BLUE, "JPN": LIGHT}
INK, MUTED, GRID, TRACK, FADED = NAVY, "#64748b", "#e3e8ee", "#dbe3ec", "#c9d2dd"
CODE = {it: it.replace("TT4G37", "37").replace("TT4G36", "36") for it in ITEMS}

# % tho (chua trong so) Khanh Linh tu chay trong SPSS (OUTPUT2.pdf) -- chi dung cho Bieu do 5
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

# ------------------------------------------------------------------ kiem chung moi khang dinh trong tieu de
pct = df.pivot(index="item", columns="country", values="pct_weighted")
nn = df.pivot(index="item", columns="country", values="n")
lo = df.pivot(index="item", columns="country", values="ci95_lo")
hi = df.pivot(index="item", columns="country", values="ci95_hi")
gap = pct.max(axis=1) - pct.min(axis=1)
assert gap.idxmax() == "TT4G36" and round(gap["TT4G36"]) == 58
assert round(gap.drop("TT4G36").min(), 1) == 13.2 and round(gap.drop("TT4G36").max(), 1) == 36.2
top5 = df.sort_values("deff", ascending=False).head(5)
assert (top5.country == "SGP").sum() == 4
assert top5.iloc[0]["item"] == "TT4G36" and top5.iloc[0].country == "SGP" and top5.iloc[0].deff == 4.16
def n_overlap(it):
    return sum(lo.loc[it, a] <= hi.loc[it, b] and lo.loc[it, b] <= hi.loc[it, a]
               for i, a in enumerate(COUNTRIES) for b in COUNTRIES[i + 1:])
assert [it for it in ITEMS if n_overlap(it) == 0] == ["TT4G36"]
shift = [abs(RAW[it][c] - pct.loc[it, c]) for it in ITEMS for c in COUNTRIES]
assert abs(sum(shift) / len(shift) - 0.75) < 0.01
assert nn.loc[ITEMS[1:], "JPN"].min() == 190 and nn.loc[ITEMS[1:], "JPN"].max() == 203
for c in COUNTRIES:  # TT4G37 chi hoi nguoi tra loi "Co" o TT4G36 -> n37 ~ n36 x %dung AI
    expect = nn.loc["TT4G36", c] * pct.loc["TT4G36", c] / 100
    assert abs(nn.loc["TT4G37B", c] - expect) / expect < 0.02, c
rank1 = {it: pct.loc[it].idxmax() for it in ITEMS}
assert len(set(rank1.values())) >= 3

# ------------------------------------------------------------------ van ban 3 ngon ngu
T = {
"vi": dict(
    font="Helvetica, Arial, sans-serif",
    name={"CSH": "Thượng Hải", "JPN": "Nhật Bản", "KOR": "Hàn Quốc", "SGP": "Singapore"},
    short={"CSH": "TH", "JPN": "NB", "KOR": "HQ", "SGP": "SG"},
    label={"TT4G36": "Dùng AI nói chung (TT4G36)", "TT4G37A": "A Chấm/đánh giá bài của HS",
           "TT4G37B": "B Tìm hiểu và tóm tắt chủ đề hiệu quả", "TT4G37C": "C Soạn giáo án hoặc hoạt động",
           "TT4G37D": "D Hỗ trợ HS có nhu cầu giáo dục đặc biệt", "TT4G37E": "E Tự động điều chỉnh độ khó tài liệu",
           "TT4G37F": "F Viết phản hồi cho HS/trao đổi với PH", "TT4G37G": "G Xem dữ liệu tham gia/kết quả của HS",
           "TT4G37H": "H Giúp HS luyện kỹ năng trong tình huống thực tế", "TT4G37I": "I Mục đích khác"},
    t1="Tỉ lệ dùng AI dao động từ 17% đến 75% tuỳ hệ thống",
    s1="TT4G36 — tỉ lệ giáo viên dùng AI trong 12 tháng qua, % có trọng số, kèm cỡ mẫu n và khoảng tin cậy 95%",
    ci="KTC95%",
    t2="Chênh lệch giữa các hệ thống lớn nhất ở tỉ lệ dùng AI chung (58 điểm), hẹp hơn ở từng mục đích",
    s2="Cả 4 hệ thống cho từng biến: 2 chấm to = thấp nhất/cao nhất, 2 chấm nhỏ mờ = 2 hệ thống còn lại. Sắp theo độ chênh lệch.<br>TT4G37A-I chỉ tính trên giáo viên đã dùng AI.",
    t3="Chỉ 1 trong 10 biến tách biệt hoàn toàn cả 4 hệ thống",
    s3="Mỗi đoạn ngang = khoảng tin cậy 95% của một hệ thống; chấm tròn = điểm ước lượng.<br>Hàng tô hồng là hàng duy nhất mà không có 2 khoảng tin cậy nào chồng lên nhau.",
    a3="4 khoảng tin cậy<br>không chạm nhau", x3="% có trọng số, kèm khoảng tin cậy 95%",
    t4="Singapore chiếm 4/5 ô có DEFF cao nhất, cao nhất ở tỉ lệ dùng AI chung (4,16)",
    s4="Mỗi điểm là một ô biến × hệ thống (40 điểm). DEFF = (SE theo thiết kế mẫu / SE nếu coi là mẫu ngẫu nhiên đơn giản)².<br>5 điểm DEFF cao nhất được gắn nhãn.",
    h4="DEFF = 1 (coi như mẫu ngẫu nhiên đơn giản)", x4="% có trọng số", y4="DEFF (hệ số phóng đại phương sai)",
    t5="Trọng số hầu như không làm đổi phần trăm — hầu hết điểm nằm sát đường chéo",
    s5="Trục ngang: % thô (SPSS, chưa trọng số). Trục đứng: % có trọng số (BRR-Fay).<br>Đường đứt nét x = y: điểm càng xa đường, trọng số càng đổi % nhiều. Độ lệch tuyệt đối trung bình 0,75 điểm.",
    d5="đường chéo: % thô = % có trọng số", sh5="lệch {:.1f} điểm",
    x5="% thô (chưa trọng số, SPSS)", y5="% có trọng số (BRR-Fay)",
    t6="Không hệ thống nào luôn dẫn đầu — thứ hạng đổi theo từng mục đích",
    s6="Thứ hạng 1 (cao nhất) đến 4 (thấp nhất) theo % có trọng số trong từng biến.<br>Thứ hạng chỉ dựa trên điểm ước lượng; nhiều chênh lệch ở TT4G37 không có ý nghĩa thống kê (xem Biểu đồ 3).",
    r6=["Hạng 1 (cao nhất)", "Hạng 2", "Hạng 3", "Hạng 4 (thấp nhất)"],
    t7="Cỡ mẫu thực tế nhỏ hơn hẳn ở 9/10 biến, vì TT4G37 chỉ hỏi người đã dùng AI",
    s7="TT4G36 hỏi toàn bộ giáo viên; TT4G37A-I chỉ hỏi người trả lời \"Có\" ở TT4G36,<br>nên cỡ mẫu nhỏ hơn và khác nhau giữa 4 hệ thống (Nhật Bản chỉ 190-203 giáo viên).",
    y7="Cỡ mẫu phân tích thật (n)",
    fig="Biểu đồ",
    source="Nguồn: OECD TALIS 2024, giáo viên THCS (ISCED 2). Ước lượng có trọng số TCHWGT; sai số chuẩn và KTC95% theo BRR-Fay (100 trọng số lặp, Fay = 0,5).",
),
"en": dict(
    font="Helvetica, Arial, sans-serif",
    name={"CSH": "Shanghai (China)", "JPN": "Japan", "KOR": "Korea", "SGP": "Singapore"},
    short={"CSH": "SH", "JPN": "JP", "KOR": "KR", "SGP": "SG"},
    label={"TT4G36": "Used AI at all (TT4G36)", "TT4G37A": "A Assess or mark student work",
           "TT4G37B": "B Efficiently learn about & summarise a topic", "TT4G37C": "C Generate lesson plans or activities",
           "TT4G37D": "D Support students with special education needs", "TT4G37E": "E Automatically adjust material difficulty",
           "TT4G37F": "F Generate student feedback / parent communication", "TT4G37G": "G Review student participation/performance data",
           "TT4G37H": "H Help students practise skills in real-life scenarios", "TT4G37I": "I Other"},
    t1="AI use ranges from 17% to 75% depending on the system",
    s1="TT4G36 — share of teachers who used AI in the past 12 months, weighted %, with sample size n and 95% CI",
    ci="95% CI",
    t2="The gap between systems is widest for overall AI use (58 points) and narrower for each purpose",
    s2="All 4 systems per item: 2 large dots = lowest/highest, 2 small faded dots = the other two systems. Sorted by gap.<br>TT4G37A-I cover AI users only.",
    t3="Only 1 of 10 items fully separates all four systems",
    s3="Each segment = one system's 95% CI; dot = point estimate.<br>The shaded row is the only item where no two of the four intervals overlap.",
    a3="no two CIs<br>overlap", x3="Weighted %, with 95% CI",
    t4="Singapore holds 4 of the 5 highest DEFF values, peaking at overall AI use (4.16)",
    s4="Each dot is one item × system cell (40 dots). DEFF = (design-based SE / simple-random-sample SE)².<br>The 5 highest values are labelled.",
    h4="DEFF = 1 (same as a simple random sample)", x4="Weighted %", y4="DEFF (design effect)",
    t5="Weighting barely changes the percentages — most points sit on the diagonal",
    s5="Horizontal: unweighted % (SPSS). Vertical: weighted % (BRR-Fay).<br>Dashed x = y line: the farther a point sits from it, the more weighting changed that %. Mean absolute shift 0.75 points.",
    d5="diagonal: unweighted % = weighted %", sh5="shift {:.1f} pts",
    x5="Unweighted % (SPSS)", y5="Weighted % (BRR-Fay)",
    t6="No system is always on top — ranks shift from purpose to purpose",
    s6="Rank 1 (highest) to 4 (lowest) by weighted % on each item.<br>Ranks use point estimates only; many TT4G37 gaps are not statistically significant (see Chart 3).",
    r6=["Rank 1 (highest)", "Rank 2", "Rank 3", "Rank 4 (lowest)"],
    t7="Real sample size is much smaller for 9/10 items, because TT4G37 is only asked of AI users",
    s7="TT4G36 is asked of every teacher; TT4G37A-I only of those answering \"Yes\" to TT4G36,<br>so n is smaller and differs across systems (Japan only 190-203 teachers).",
    y7="Analytic sample size (n)",
    fig="Chart",
    source="Source: OECD TALIS 2024, lower-secondary teachers (ISCED 2). Estimates weighted with TCHWGT; standard errors and 95% CIs via BRR-Fay (100 replicate weights, Fay = 0.5).",
),
"zh": dict(
    font="Hiragino Sans GB, Heiti SC, PingFang SC, Microsoft YaHei, sans-serif",
    name={"CSH": "中国上海", "JPN": "日本", "KOR": "韩国", "SGP": "新加坡"},
    short={"CSH": "上海", "JPN": "日本", "KOR": "韩国", "SGP": "新加坡"},
    label={"TT4G36": "总体使用AI（TT4G36）", "TT4G37A": "A 评估或批改学生作业",
           "TT4G37B": "B 高效学习和总结主题", "TT4G37C": "C 生成教案或活动",
           "TT4G37D": "D 支持有特殊教育需求的学生", "TT4G37E": "E 自动调整学习材料难度",
           "TT4G37F": "F 生成学生反馈或家校沟通文本", "TT4G37G": "G 查看学生参与度或表现数据",
           "TT4G37H": "H 帮助学生在现实场景中练习新技能", "TT4G37I": "I 其他"},
    t1="教师AI使用率因教育系统而异，从17%到75%不等",
    s1="TT4G36｜过去12个月在教学中使用AI的教师比例（加权%），附样本量n与95%置信区间",
    ci="95% CI",
    t2="教育系统间的差距在总体使用率上最大（58个百分点），在各具体用途上较小",
    s2="每行显示四个教育系统：大圆点＝最低/最高，小浅色圆点＝其余两个系统；按差距大小排序。<br>TT4G37A–I 仅统计使用AI的教师。",
    t3="10个变量中仅有1个能将四个教育系统完全区分开",
    s3="每条横线＝一个教育系统的95%置信区间，圆点＝点估计。<br>阴影行是唯一一个四个置信区间两两互不重叠的变量。",
    a3="四个置信区间<br>互不重叠", x3="加权%（含95%置信区间）",
    t4="DEFF最高的5个单元格中有4个属于新加坡，最高为总体使用率（4.16）",
    s4="每个点为一个“变量×教育系统”单元格（共40个）。DEFF＝（按抽样设计计算的SE ÷ 按简单随机抽样计算的SE）²。<br>标注DEFF最高的5个点。",
    h4="DEFF = 1（等同简单随机抽样）", x4="加权%", y4="DEFF（设计效应）",
    t5="加权几乎不改变比例——大多数点紧贴对角线",
    s5="横轴：未加权%（SPSS）；纵轴：加权%（BRR-Fay）。<br>虚线为 x = y：点离虚线越远，加权对该比例的影响越大。平均绝对差为0.75个百分点。",
    d5="对角线：未加权% = 加权%", sh5="相差{:.1f}个百分点",
    x5="未加权%（SPSS）", y5="加权%（BRR-Fay）",
    t6="没有哪个教育系统始终领先——排名随用途而变化",
    s6="按各变量的加权%排名，1＝最高，4＝最低。<br>排名仅依据点估计；TT4G37中不少差异在统计上并不显著（见图3）。",
    r6=["第1名（最高）", "第2名", "第3名", "第4名（最低）"],
    t7="10个变量中有9个样本量明显较小，因为TT4G37只询问使用过AI的教师",
    s7="TT4G36面向全部教师；TT4G37A–I仅询问在TT4G36中回答“是”的教师，<br>因此样本量较小且各系统不同（日本仅190–203人）。",
    y7="实际分析样本量（n）",
    fig="图",
    source="数据来源：OECD TALIS 2024，初中教师（ISCED 2）。使用教师最终权重TCHWGT加权；标准误与95%置信区间采用BRR-Fay法（100个重复权重，Fay = 0.5）。",
),
}
LABEL_MARGIN = {"vi": 350, "en": 380, "zh": 270}


def base(L, title, sub, width, height, l=210, r=90, t=110, b=60):
    return dict(paper_bgcolor="white", plot_bgcolor="white",
                font=dict(family=L["font"], color=INK, size=15),
                title=dict(text=f"<b>{title}</b><br><span style='font-size:13px;color:{MUTED}'>{sub}</span>",
                           x=0.01, xanchor="left", yref="container", y=1, yanchor="top",
                           pad=dict(t=18), font=dict(size=20)),
                margin=dict(l=l, r=r, t=t, b=b), width=width, height=height)


def poster_base(L, width, height, l, r=30, t=20, b=20):
    return dict(paper_bgcolor="white", plot_bgcolor="white",
                font=dict(family=L["font"], color=INK, size=19),
                margin=dict(l=l, r=r, t=t, b=b), width=width, height=height)


def save(fig, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.write_image(str(path), scale=3)


# ------------------------------------------------------------------ Bieu do 1
def chart1(L, poster=False):
    order = sorted(COUNTRIES, key=lambda c: pct.loc["TT4G36", c])
    vals = [pct.loc["TT4G36", c] for c in order]
    top = max(vals)
    fig = go.Figure(go.Bar(
        x=vals, y=[L["name"][c] for c in order], orientation="h",
        marker=dict(color=[RED if v == top else BLUE for v in vals]),
        error_x=dict(type="data", symmetric=False,
                     array=[hi.loc["TT4G36", c] - pct.loc["TT4G36", c] for c in order],
                     arrayminus=[pct.loc["TT4G36", c] - lo.loc["TT4G36", c] for c in order],
                     color=INK, thickness=2.5 if poster else 2, width=8 if poster else 6)))
    for yi, c in enumerate(order):
        v, a, b_, n = pct.loc["TT4G36", c], lo.loc["TT4G36", c], hi.loc["TT4G36", c], int(nn.loc["TT4G36", c])
        txt = (f"<b>{v:.1f}%</b>  [{a:.1f}–{b_:.1f}]  n={n}" if poster
               else f"<b>{v:.1f}%</b>  ·  n={n}  ·  {L['ci']} {a:.1f}–{b_:.1f}")
        fig.add_annotation(x=b_ + 2.5, y=yi, xanchor="left", yanchor="middle", showarrow=False, text=txt,
                           font=dict(size=21 if poster else 13, color=RED if v == top else INK))
    if poster:
        fig.update_layout(**poster_base(L, 1200, 470, l={"vi": 175, "en": 225, "zh": 140}[lang_of(L)], r=330))
        fig.update_yaxes(tickfont=dict(size=23, color=INK))
    else:
        fig.update_layout(**base(L, L["t1"], L["s1"], 1180, 450, l={"vi": 150, "en": 190, "zh": 130}[lang_of(L)], r=280))
        fig.update_yaxes(tickfont=dict(size=15, color=INK))
    fig.update_xaxes(visible=False, range=[0, 100])
    fig.update_yaxes(ticksuffix="  ")
    return fig


# ------------------------------------------------------------------ Bieu do 2
def chart2(L, poster=False):
    rows = sorted(ITEMS, key=lambda it: gap[it])
    fig = go.Figure()
    big, small, txt = (19, 12, 17) if poster else (16, 10, 12)
    for i, it in enumerate(rows):
        order_c = sorted(COUNTRIES, key=lambda c: pct.loc[it, c])
        lo_c, hi_c = order_c[0], order_c[-1]
        fig.add_trace(go.Scatter(x=[pct.loc[it, lo_c], pct.loc[it, hi_c]], y=[i, i], mode="lines",
                                 line=dict(color=TRACK, width=6 if poster else 5), showlegend=False, hoverinfo="skip"))
        for c in order_c[1:3]:
            fig.add_trace(go.Scatter(x=[pct.loc[it, c]], y=[i], mode="markers", showlegend=False, hoverinfo="skip",
                                     marker=dict(size=small, color=COL[c], opacity=0.55)))
        fig.add_trace(go.Scatter(x=[pct.loc[it, lo_c]], y=[i], mode="markers+text", showlegend=False,
                                 marker=dict(size=big, color=COL[lo_c]), textposition="middle left",
                                 text=[f"{L['short'][lo_c]} {pct.loc[it, lo_c]:.0f}"], textfont=dict(size=txt, color=MUTED)))
        fig.add_trace(go.Scatter(x=[pct.loc[it, hi_c]], y=[i], mode="markers+text", showlegend=False,
                                 marker=dict(size=big, color=COL[hi_c]), textposition="middle right",
                                 text=[f"<b>{L['short'][hi_c]} {pct.loc[it, hi_c]:.0f}</b>"], textfont=dict(size=txt, color=INK)))
    for c in COUNTRIES:
        fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers", marker=dict(size=14, color=COL[c]), name=L["name"][c]))
    lm = LABEL_MARGIN[lang_of(L)]
    if poster:
        fig.update_layout(**poster_base(L, 1300, 1000, l=int(lm * 1.45), t=70))
        fig.update_layout(legend=dict(orientation="h", y=1.0, yanchor="bottom", x=0.5, xanchor="center", font=dict(size=19)))
        fig.update_yaxes(tickfont=dict(size=19, color=INK))
    else:
        fig.update_layout(**base(L, L["t2"], L["s2"], 1180, 720, l=lm, b=70))
        fig.update_layout(legend=dict(orientation="h", y=-0.05, x=0.5, xanchor="center", font=dict(size=13)))
        fig.update_yaxes(tickfont=dict(size=13, color=INK))
    fig.update_xaxes(visible=False, range=[-14, 100])
    fig.update_yaxes(tickmode="array", tickvals=list(range(len(rows))), ticktext=[L["label"][it] for it in rows],
                     zeroline=False, showline=False, range=[-0.6, len(rows) - 0.4])
    return fig


# ------------------------------------------------------------------ Bieu do 3
def chart3(L):
    order3 = sorted(ITEMS, key=lambda it: -(hi.loc[it].max() - lo.loc[it].min()))
    fig = go.Figure()
    for i, it in enumerate(order3):
        yb = len(order3) - 1 - i
        hero = it == "TT4G36"
        for k, c in enumerate(COUNTRIES):
            yy = yb + (k - 1.5) * 0.13
            col = COL[c] if hero else FADED
            fig.add_trace(go.Scatter(x=[lo.loc[it, c], hi.loc[it, c]], y=[yy, yy], mode="lines",
                                     line=dict(color=col, width=4), showlegend=False, hoverinfo="skip"))
            fig.add_trace(go.Scatter(x=[pct.loc[it, c]], y=[yy], mode="markers", marker=dict(color=col, size=7),
                                     showlegend=False, hoverinfo="skip"))
        if hero:
            fig.add_hrect(y0=yb - 0.42, y1=yb + 0.42, fillcolor=RED, opacity=0.07, line_width=0)
            fig.add_annotation(x=86, y=yb, text=L["a3"], showarrow=False, xanchor="left",
                               font=dict(size=12, color=RED))
    for c in COUNTRIES:
        fig.add_trace(go.Scatter(x=[None], y=[None], mode="markers", marker=dict(size=11, color=COL[c]), name=L["name"][c]))
    fig.update_layout(**base(L, L["t3"], L["s3"], 1200, 760, l=LABEL_MARGIN[lang_of(L)], b=140))
    fig.update_xaxes(range=[0, 100], gridcolor=GRID, title=L["x3"])
    fig.update_yaxes(tickmode="array", tickvals=list(range(len(order3))),
                     ticktext=[L["label"][it] for it in order3[::-1]], tickfont=dict(size=13, color=INK),
                     zeroline=False, showline=False, range=[-0.6, len(order3) - 0.4])
    fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
    return fig


# ------------------------------------------------------------------ Bieu do 4
def chart4(L):
    fig = go.Figure()
    for c in COUNTRIES:
        s = df[df.country == c]
        fig.add_trace(go.Scatter(x=s.pct_weighted, y=s.deff, mode="markers", name=L["name"][c],
                                 marker=dict(size=13, color=COL[c], line=dict(width=1.2, color="white"))))
    fig.add_hline(y=1.0, line=dict(color=MUTED, width=1.3, dash="dash"))
    fig.add_annotation(x=3, y=1.1, text=L["h4"], showarrow=False, xanchor="left", font=dict(size=11, color=MUTED))
    for _, row in top5.iterrows():
        fig.add_annotation(x=row.pct_weighted, y=row.deff, showarrow=True, arrowhead=0, arrowcolor=MUTED,
                           text=f"{CODE[row['item']]}-{L['short'][row.country]} (DEFF {row.deff:.2f})",
                           ax=30, ay=-40 if (row["item"] == "TT4G36" and row.country == "SGP") else -28,
                           font=dict(size=11, color=RED if row.country == "SGP" else INK))
    fig.update_layout(**base(L, L["t4"], L["s4"], 1080, 700, l=90, b=130))
    fig.update_xaxes(gridcolor=GRID, title=L["x4"])
    fig.update_yaxes(gridcolor=GRID, title=L["y4"])
    fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
    return fig


# ------------------------------------------------------------------ Bieu do 5
def chart5(L):
    pts = [(RAW[it][c], pct.loc[it, c], c, it) for it in ITEMS for c in COUNTRIES]
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=[0, 90], y=[0, 90], mode="lines", showlegend=False, hoverinfo="skip",
                             line=dict(color=MUTED, width=1.5, dash="dash")))
    fig.add_annotation(x=66, y=72, text=L["d5"], showarrow=False, textangle=-38, font=dict(size=11, color=MUTED))
    for c in COUNTRIES:
        fig.add_trace(go.Scatter(x=[p[0] for p in pts if p[2] == c], y=[p[1] for p in pts if p[2] == c],
                                 mode="markers", name=L["name"][c],
                                 marker=dict(size=12, color=COL[c], line=dict(width=1.2, color="white"))))
    # 3 diem lech nhieu nhat deu nam DUOI duong cheo (Nhat Ban) -> dat nhan vao vung trong phia duoi-phai
    for k, p in enumerate(sorted(pts, key=lambda p: abs(p[0] - p[1]), reverse=True)[:3]):
        fig.add_annotation(x=p[0], y=p[1], showarrow=True, arrowhead=0, arrowcolor=MUTED, ax=[60, 110, 110][k], ay=[110, 60, 40][k],
                           xanchor="left",
                           text=f"{CODE[p[3]]}-{L['short'][p[2]]} ({L['sh5'].format(abs(p[0] - p[1]))})",
                           font=dict(size=11, color=INK))
    fig.update_layout(**base(L, L["t5"], L["s5"], 1080, 800, l=90, t=130, b=140))
    fig.update_xaxes(range=[0, 90], gridcolor=GRID, title=L["x5"])
    fig.update_yaxes(range=[0, 90], gridcolor=GRID, title=L["y5"])
    fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
    return fig


# ------------------------------------------------------------------ Bieu do 6
def chart6(L, poster=False):
    fig = go.Figure()
    xs = [CODE[it] for it in ITEMS]
    for c in COUNTRIES:
        ranks = [int(pct.loc[it].rank(ascending=False)[c]) for it in ITEMS]
        fig.add_trace(go.Scatter(x=xs, y=ranks, mode="lines+markers", name=L["name"][c],
                                 line=dict(color=COL[c], width=4.5 if poster else 3),
                                 marker=dict(size=14 if poster else 10)))
    if poster:
        fig.update_layout(**poster_base(L, 1300, 660, l={"vi": 215, "en": 185, "zh": 165}[lang_of(L)], t=70, b=50))
        fig.update_layout(legend=dict(orientation="h", y=1.0, yanchor="bottom", x=0.5, xanchor="center", font=dict(size=19)))
        tf = 19
    else:
        fig.update_layout(**base(L, L["t6"], L["s6"], 1080, 600, l=170, b=100))
        fig.update_layout(legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
        tf = 13
    fig.update_yaxes(tickmode="array", tickvals=[1, 2, 3, 4], ticktext=L["r6"], autorange="reversed",
                     gridcolor=GRID, zeroline=False, tickfont=dict(size=tf + 2, color=INK))
    fig.update_xaxes(tickfont=dict(size=tf, color=INK), showgrid=False)
    return fig


# ------------------------------------------------------------------ Bieu do 7
def chart7(L):
    fig = go.Figure()
    for c in COUNTRIES:
        fig.add_trace(go.Bar(x=[CODE[it] for it in ITEMS], y=[int(nn.loc[it, c]) for it in ITEMS],
                             name=L["name"][c], marker_color=COL[c]))
    fig.update_layout(**base(L, L["t7"], L["s7"], 1080, 600, l=90, b=100))
    fig.update_yaxes(title=L["y7"], gridcolor=GRID)
    fig.update_xaxes(tickfont=dict(size=13, color=INK))
    fig.update_layout(barmode="group", legend=dict(orientation="h", y=-0.2, x=0.5, xanchor="center", font=dict(size=13)))
    return fig


def lang_of(L):
    return next(k for k, v in T.items() if v is L)


REPORT = [(1, "1_tile_dung_AI", chart1), (2, "2_pham_vi_4_he_thong", chart2), (3, "3_forest_plot", chart3),
          (4, "4_deff", chart4), (5, "5_tho_vs_trong_so", chart5), (6, "6_thu_hang", chart6), (7, "7_co_mau", chart7)]
POSTER = [(1, "1_tile_dung_AI", chart1), (2, "2_pham_vi_4_he_thong", chart2), (6, "6_thu_hang", chart6)]

written = []
for lang, L in T.items():
    for k, stem, fn in REPORT:
        p = HERE / lang / "report" / f"{lang}_{stem}.png"; save(fn(L), p); written.append(p)
    for k, stem, fn in POSTER:
        p = HERE / lang / "poster" / f"{lang}_poster_{stem}.png"; save(fn(L, poster=True), p); written.append(p)
    lines = []
    for k in range(1, 8):
        sub = L[f"s{k}"].replace("<br>", " ")
        lines.append(f"{L['fig']} {k}. {L[f't{k}']}\n{sub}\n")
    lines.append(L["source"] + "\n")
    cap = HERE / lang / "captions.txt"; cap.write_text("\n".join(lines), encoding="utf-8"); written.append(cap)
    print(lang, "ok")

with zipfile.ZipFile(HERE / "TALIS2024_Q2_charts_VI_EN_ZH.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for p in written + [HERE / "make_poster_charts.py", HERE / "weighted_results_q2.csv"]:
        z.write(p, p.relative_to(HERE))
print("done:", len(written), "files + zip")
