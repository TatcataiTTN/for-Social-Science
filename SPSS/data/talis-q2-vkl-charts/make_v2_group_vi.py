# -*- coding: utf-8 -*-
"""v2 redesign -- group project (TALIS 2024, Question 2), real verified data only.
Run: python3 -I make_v2_group.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import pandas as pd, numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from style import set_style, clean_axes, title, takeaway, COUNTRY_COLOR, COUNTRY_NAME, COUNTRY_SHORT, INK, MUTED, GRID, GRAY, HIGHLIGHT

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
CSV = HERE.parent.parent / "talis2024-nhom-vkl-cauhoi2" / "data" / "weighted_results_q2.csv"
df = pd.read_csv(CSV)
set_style()

COUNTRIES = ["CSH", "JPN", "KOR", "SGP"]
COUNTRY_NAME = {"CSH": "Thượng Hải", "JPN": "Nhật Bản", "KOR": "Hàn Quốc", "SGP": "Singapore"}
COUNTRY_SHORT = {"CSH": "TH", "JPN": "NB", "KOR": "HQ", "SGP": "SG"}
ITEMS = ["TT4G36"] + [f"TT4G37{c}" for c in "ABCDEFGHI"]
LABEL = {
    "TT4G36": "Dùng AI (TT4G36)", "TT4G37A": "Chấm/đánh giá bài",
    "TT4G37B": "Tìm hiểu/tóm tắt chủ đề", "TT4G37C": "Kế hoạch bài học",
    "TT4G37D": "Hỗ trợ HS đặc biệt", "TT4G37E": "Điều chỉnh độ khó",
    "TT4G37F": "Phản hồi/giao tiếp PH", "TT4G37G": "Xem dữ liệu HS",
    "TT4G37H": "Luyện kỹ năng thực tế", "TT4G37I": "Mục đích khác",
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

# ============================================================ 1. Headline card: TT4G36
sub = df[df.item == "TT4G36"].set_index("country")
order = sorted(COUNTRIES, key=lambda c: sub.loc[c, "pct_weighted"])
fig, ax = plt.subplots(figsize=(8.6, 4.6))
y = np.arange(len(order))
vals = [sub.loc[c, "pct_weighted"] for c in order]
cols = [HIGHLIGHT if c in ("SGP", "JPN") else GRAY for c in order]
bars = ax.barh(y, vals, color=cols, height=0.56)
for yi, c, v in zip(y, order, vals):
    ax.text(v + 1.5, yi, f"{v:.0f}%", va="center", fontsize=14, fontweight="bold", color=INK)
    ax.text(-1.5, yi, COUNTRY_NAME[c], va="center", ha="right", fontsize=13, color=INK)
ax.set_yticks([]); ax.set_xlim(0, 95); ax.set_xlabel("")
ax.set_xticks([]); clean_axes(ax, keep=())
lo, hi = sub.loc["JPN", "pct_weighted"], sub.loc["SGP", "pct_weighted"]
ax.text(94, len(order) - 1.5, f"chênh lệch {hi / lo:.1f} lần, Singapore so với Nhật Bản", ha="right", va="center",
        fontsize=12, color=HIGHLIGHT, fontweight="bold")
title(fig, ax, "Tỉ lệ dùng AI dao động từ 17% đến 75% tuỳ hệ thống", "Tỉ lệ giáo viên dùng AI trong 12 tháng qua (TT4G36, có trọng số)")
fig.savefig(OUT / "vi_v2_1_headline_tt4g36.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_1")

# ============================================================ 2. Dumbbell / spread chart, all 10 items
rows = []
for item in ITEMS:
    s = df[df.item == item].set_index("country")
    vals = {c: s.loc[c, "pct_weighted"] for c in COUNTRIES}
    lo_c = min(vals, key=vals.get); hi_c = max(vals, key=vals.get)
    rows.append((item, vals[lo_c], vals[hi_c], lo_c, hi_c, vals[hi_c] - vals[lo_c]))
rows.sort(key=lambda r: r[5])
fig, ax = plt.subplots(figsize=(9.5, 7.2))
y = np.arange(len(rows))
for yi, (item, lo, hi, lo_c, hi_c, spread) in zip(y, rows):
    ax.plot([lo, hi], [yi, yi], color=GRID, lw=3, solid_capstyle="round", zorder=1)
    ax.plot(lo, yi, "o", ms=11, color=COUNTRY_COLOR[lo_c], zorder=2)
    ax.plot(hi, yi, "o", ms=11, color=COUNTRY_COLOR[hi_c], zorder=2)
    ax.text(lo - 2, yi, f"{COUNTRY_SHORT[lo_c]} {lo:.0f}", ha="right", va="center", fontsize=10.5, color=MUTED)
    ax.text(hi + 2, yi, f"{COUNTRY_SHORT[hi_c]} {hi:.0f}", ha="left", va="center", fontsize=10.5, color=INK, fontweight="bold")
ax.set_yticks(y); ax.set_yticklabels([LABEL[r[0]] for r in rows], fontsize=11.5)
ax.set_xlim(-5, 95); ax.set_xticks([]); clean_axes(ax, keep=())
title(fig, ax, "Mục đích dùng AI khác biệt giữa các hệ thống nhiều hơn hẳn tỉ lệ chung",
      "Hệ thống thấp nhất tới cao nhất cho từng mục, % có trọng số (sắp theo độ chênh lệch)")
fig.savefig(OUT / "vi_v2_2_dumbbell_spread.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_2")

# ============================================================ 3. Forest plot, redesigned
fig, ax = plt.subplots(figsize=(10, 7.6))
order3 = sorted(ITEMS, key=lambda it: -(df[df.item == it].ci95_hi.max() - df[df.item == it].ci95_lo.min()))
for r, item in enumerate(order3):
    y0 = len(order3) - r
    s = df[df.item == item].set_index("country")
    is_hero = item == "TT4G36"
    if is_hero:
        ax.axhspan(y0 - 0.46, y0 + 0.46, color="#fbf1ea", zorder=0)
    for k, c in enumerate(COUNTRIES):
        row = s.loc[c]
        yy = y0 + (k - 1.5) * 0.15
        col = COUNTRY_COLOR[c] if is_hero else GRAY
        ax.plot([row.ci95_lo, row.ci95_hi], [yy, yy], color=col, lw=2.4, solid_capstyle="round", zorder=2)
        ax.plot(row.pct_weighted, yy, "o", color=col, ms=5.5, zorder=3)
ax.set_yticks([len(order3) - i for i in range(len(order3))])
ax.set_yticklabels([LABEL[it] for it in order3], fontsize=11)
ax.set_xlim(0, 90); ax.set_xlabel("% có trọng số kèm CI95%"); clean_axes(ax, keep=("bottom",))
ax.grid(axis="x", color=GRID, lw=0.8)
hero_y = len(order3) - order3.index("TT4G36")
ax.text(91, hero_y, "biến duy nhất mà\ncả 4 hệ thống tách biệt", fontsize=10.5, color=HIGHLIGHT, va="center")
title(fig, ax, "Chỉ 1 trong 10 biến tách biệt hoàn toàn cả 4 hệ thống",
      "Khoảng tin cậy 95% theo hệ thống; các hàng sắp theo độ rộng chênh lệch tổng thể")
fig.savefig(OUT / "vi_v2_3_forest.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_3")

# ============================================================ 4. Scatter: weighted % vs DEFF
fig, ax = plt.subplots(figsize=(8.4, 6.4))
for c in COUNTRIES:
    s = df[df.country == c]
    ax.scatter(s.pct_weighted, s.deff, s=90, color=COUNTRY_COLOR[c], edgecolor="white", linewidth=0.8,
               label=COUNTRY_NAME[c], zorder=3, alpha=0.92)
ax.axhline(1.0, color=MUTED, lw=1.2, ls=(0, (4, 3)))
ax.text(2, 1.08, "DEFF = 1 (bằng ngẫu nhiên đơn giản)", fontsize=10, color=MUTED)
outlier = df.loc[(df.item == "TT4G36") & (df.country == "SGP")].iloc[0]
ax.annotate("TT4G36 x Singapore\n(DEFF 4,16)", xy=(outlier.pct_weighted, outlier.deff),
            xytext=(outlier.pct_weighted - 22, outlier.deff - 0.1), fontsize=10.5, color=INK,
            arrowprops=dict(arrowstyle="-", color=INK, lw=1))
clean_axes(ax); ax.grid(axis="y", color=GRID, lw=0.8)
ax.set_xlabel("% có trọng số"); ax.set_ylabel("DEFF (hệ số phóng đại phương sai)")
ax.legend(frameon=False, fontsize=11, loc="upper left")
title(fig, ax, "Hiệu ứng phân cụm của Singapore lớn nhất đúng ở nơi tỉ lệ dùng AI cao nhất",
      "Mỗi điểm = 1 ô biến x hệ thống (n=40); DEFF càng cao, SE kiểu đơn giản càng đánh giá thấp độ bất định")
fig.savefig(OUT / "vi_v2_4_scatter_deff.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_4")

# ============================================================ 5. Scatter: raw vs weighted %
fig, ax = plt.subplots(figsize=(7.6, 7.2))
pts = []
for item in ITEMS:
    s = df[df.item == item].set_index("country")
    for c in COUNTRIES:
        pts.append((RAW[item][c], s.loc[c, "pct_weighted"], c, item))
for c in COUNTRIES:
    xs = [p[0] for p in pts if p[2] == c]; ys = [p[1] for p in pts if p[2] == c]
    ax.scatter(xs, ys, s=80, color=COUNTRY_COLOR[c], edgecolor="white", linewidth=0.7, label=COUNTRY_NAME[c], alpha=0.9, zorder=3)
ax.plot([0, 90], [0, 90], color=MUTED, lw=1.2, ls=(0, (4, 3)), zorder=1)
ax.text(70, 74, "thô = có trọng số", fontsize=10, color=MUTED, rotation=38)
big = sorted(pts, key=lambda p: abs(p[0] - p[1]))[-1]
ax.annotate(f"{big[3].replace('TT4G37','37').replace('TT4G36','36')}-{COUNTRY_SHORT[big[2]]}\n(chênh lệch lớn nhất)",
            xy=(big[0], big[1]), xytext=(big[0] - 28, big[1] + 10), fontsize=10.5,
            arrowprops=dict(arrowstyle="-", color=INK, lw=1))
clean_axes(ax); ax.grid(color=GRID, lw=0.8)
ax.set_xlim(0, 90); ax.set_ylim(0, 90)
ax.set_xlabel("% thô (không trọng số, SPSS)"); ax.set_ylabel("% có trọng số (BRR-Fay)")
ax.legend(frameon=False, fontsize=11, loc="upper left")
title(fig, ax, "Trọng số hầu như không làm đổi %  — gần hết các điểm nằm sát đường chéo",
      "Toàn bộ 40 ô biến x hệ thống; khoảng cách tới đường chéo = mức trọng số làm đổi ước lượng")
fig.savefig(OUT / "vi_v2_5_scatter_raw_weighted.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_5")

# ============================================================ 6. Bonus: bump chart of country rank per item
fig, ax = plt.subplots(figsize=(9.5, 6.0))
ranks = {}
for item in ITEMS:
    s = df[df.item == item].set_index("country")["pct_weighted"]
    order_r = s.sort_values(ascending=False).index.tolist()
    ranks[item] = {c: order_r.index(c) + 1 for c in COUNTRIES}
x = np.arange(len(ITEMS))
for c in COUNTRIES:
    ys = [ranks[it][c] for it in ITEMS]
    ax.plot(x, ys, "-o", color=COUNTRY_COLOR[c], lw=2.2, ms=7, label=COUNTRY_NAME[c], zorder=3)
ax.set_xticks(x); ax.set_xticklabels([it.replace("TT4G37", "37").replace("TT4G36", "36") for it in ITEMS], fontsize=10.5)
ax.set_yticks([1, 2, 3, 4]); ax.set_yticklabels(["Hạng 1 (cao nhất)", "Hạng 2", "Hạng 3", "Hạng 4 (thấp nhất)"])
ax.invert_yaxis()
clean_axes(ax, keep=("bottom",)); ax.grid(axis="y", color=GRID, lw=0.8)
ax.legend(frameon=False, fontsize=11, ncol=4, loc="upper center", bbox_to_anchor=(0.5, -0.14))
title(fig, ax, "Không hệ thống nào luôn dẫn đầu — thứ hạng đổi theo từng mục",
      "Thứ hạng % có trọng số của mỗi hệ thống trong 4 hệ thống, cho từng mục trong 10 mục")
fig.savefig(OUT / "vi_v2_6_bump_rank.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_6")
print("done")
