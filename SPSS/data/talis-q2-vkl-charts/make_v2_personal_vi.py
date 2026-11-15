# -*- coding: utf-8 -*-
"""v2 redesign -- individual project (AI post-editing follow-up learning).
No real data exists yet -- every number here is random/placeholder, clearly labelled.
Run: python3 -I make_v2_personal.py
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from style import set_style, clean_axes, title, INK, MUTED, GRID, GRAY, HIGHLIGHT, GOOD, BLUE

HERE = Path(__file__).resolve().parent
OUT = HERE / "out"
set_style()
rng = np.random.default_rng(7)

# ============================================================ 7. Bland-Altman, redesigned with shaded agreement band
n = 30
mean_score = rng.uniform(1, 5, n)
diff = rng.normal(0, 0.35, n)
md, sd = diff.mean(), diff.std()
fig, ax = plt.subplots(figsize=(8.2, 6.0))
ax.axhspan(md - 1.96 * sd, md + 1.96 * sd, color="#eef2fb", zorder=0)
ax.scatter(mean_score, diff, s=70, color=BLUE, edgecolor="white", linewidth=0.8, alpha=0.9, zorder=3)
ax.axhline(md, color=INK, lw=1.6, zorder=2)
ax.axhline(md + 1.96 * sd, color=HIGHLIGHT, lw=1.2, ls=(0, (4, 3)), zorder=2)
ax.axhline(md - 1.96 * sd, color=HIGHLIGHT, lw=1.2, ls=(0, (4, 3)), zorder=2)
ax.text(mean_score.max() + 0.05, md, " chênh lệch TB", fontsize=10.5, va="center", color=INK)
ax.text(mean_score.max() + 0.05, md + 1.96 * sd, " +1,96 SD", fontsize=10.5, va="center", color=HIGHLIGHT)
ax.text(mean_score.max() + 0.05, md - 1.96 * sd, " -1,96 SD", fontsize=10.5, va="center", color=HIGHLIGHT)
clean_axes(ax, keep=("left", "bottom")); ax.grid(axis="y", color=GRID, lw=0.7)
ax.set_xlabel("Điểm trung bình 2 người chấm (minh hoạ)")
ax.set_ylabel("Người chấm A trừ Người chấm B (minh hoạ)")
title(fig, ax, "CẤU TRÚC MINH HOẠ: hai người chấm có lệch nhau hay nhất trí đều?",
      "Bước 3 trong kế hoạch — Bland-Altman, độ nhất trí 2 người chấm. Cả 30 điểm đều là số ngẫu nhiên.")
fig.savefig(OUT / "vi_v2_7_bland_altman.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_7")

# ============================================================ 8. Item-rest correlation, redesigned
items5 = [f"Câu {i}" for i in range(1, 6)]
corr = np.array([0.61, 0.58, 0.19, 0.52, 0.47])
order = np.argsort(corr)
fig, ax = plt.subplots(figsize=(8.0, 4.6))
ycol = [HIGHLIGHT if c < 0.30 else GRAY for c in corr[order]]
bars = ax.barh(range(5), corr[order], color=ycol, height=0.55)
for yi, c in zip(range(5), corr[order]):
    ax.text(c + 0.015, yi, f"{c:.2f}", va="center", fontsize=12, fontweight="bold", color=INK)
ax.axvline(0.30, color=MUTED, lw=1.2, ls=(0, (4, 3)))
ax.text(0.305, 4.45, "nên giữ trên mức này (~0,30)", fontsize=10, color=MUTED, va="bottom")
ax.set_yticks(range(5)); ax.set_yticklabels([items5[i] for i in order], fontsize=12.5)
ax.set_xlim(0, 0.75); ax.set_xticks([]); clean_axes(ax, keep=())
title(fig, ax, "CẤU TRÚC MINH HOẠ: câu nào đang kéo Cronbach's alpha xuống?",
      "Bước 2 trong kế hoạch — tương quan biến-tổng. Cả 5 cột đều là số giả định, không phải khảo sát thật.")
fig.savefig(OUT / "vi_v2_8_item_rest_corr.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_8")

# ============================================================ 9. Group comparison, redesigned as a Gardner-Altman style estimation plot
rng2 = np.random.default_rng(11)
groups = ["Thấp", "Trung bình", "Cao"]
data = [rng2.normal(5.2, 1.3, 10), rng2.normal(6.4, 1.2, 10), rng2.normal(7.6, 1.1, 10)]
cols = ["#c7c6c0", "#8fb6e0", BLUE]
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10.4, 5.4), gridspec_kw={"width_ratios": [1.3, 1]})
for i, (d, c) in enumerate(zip(data, cols)):
    jitter = rng2.uniform(-0.1, 0.1, len(d))
    ax1.scatter(np.full(len(d), i) + jitter, d, s=60, color=c, edgecolor="white", linewidth=0.6, zorder=3)
    ax1.plot([i - 0.16, i + 0.16], [np.mean(d)] * 2, color=INK, lw=2.4, zorder=4)
ax1.set_xticks([0, 1, 2]); ax1.set_xticklabels([f"{g}\nphản tư" for g in groups], fontsize=12)
ax1.set_ylabel("Điểm ghi nhớ trì hoãn (minh hoạ)")
clean_axes(ax1, keep=("left", "bottom")); ax1.grid(axis="y", color=GRID, lw=0.7)
ax1.set_title("điểm minh hoạ của từng sinh viên", fontsize=11.5, color=MUTED, loc="left")

diffs = [np.mean(data[1]) - np.mean(data[0]), np.mean(data[2]) - np.mean(data[0])]
boot = [[np.mean(rng2.choice(data[1], 10)) - np.mean(rng2.choice(data[0], 10)) for _ in range(2000)],
        [np.mean(rng2.choice(data[2], 10)) - np.mean(rng2.choice(data[0], 10)) for _ in range(2000)]]
for i, (d, lab) in enumerate(zip(boot, ["TB trừ\nThấp", "Cao trừ\nThấp"])):
    lo, hi = np.percentile(d, [2.5, 97.5])
    ax2.plot([i, i], [lo, hi], color=HIGHLIGHT, lw=3, solid_capstyle="round", zorder=2)
    ax2.plot(i, np.mean(d), "o", color=HIGHLIGHT, ms=10, zorder=3)
ax2.axhline(0, color=MUTED, lw=1.2, ls=(0, (4, 3)))
ax2.set_xticks([0, 1]); ax2.set_xticklabels(["TB trừ\nThấp", "Cao trừ\nThấp"], fontsize=12)
ax2.set_ylabel("Chênh lệch trung bình (minh hoạ, kèm CI95%)")
clean_axes(ax2, keep=("left", "bottom")); ax2.grid(axis="y", color=GRID, lw=0.7)
ax2.set_title("độ lớn hiệu ứng, nếu đây là số thật", fontsize=11.5, color=MUTED, loc="left")
title(fig, ax1, "CẤU TRÚC MINH HOẠ: nhìn theo độ lớn hiệu ứng, không chỉ 3 hộp (Bước 4b, số liệu ngẫu nhiên)")
fig.savefig(OUT / "vi_v2_9_estimation_plot.png", bbox_inches="tight"); plt.close(fig)
print("saved v2_9")
print("done")
