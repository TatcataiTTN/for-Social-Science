# -*- coding: utf-8 -*-
"""Shared clean chart style -- bigger fonts, no chartjunk, gray-context + one-color-highlight,
direct labels instead of legends wherever possible. Imported by every v2 chart script."""
import matplotlib.pyplot as plt

INK = "#1a1a1a"
MUTED = "#9a9a95"
GRID = "#e8e7e2"
GRAY = "#c7c6c0"
HIGHLIGHT = "#d6553a"   # warm red-orange, reserved for "look here"
GOOD = "#1baf7a"
BLUE = "#2a78d6"

COUNTRY_COLOR = {"CSH": "#2a78d6", "JPN": "#eb6834", "KOR": "#1baf7a", "SGP": "#eda100"}
COUNTRY_NAME = {"CSH": "Shanghai", "JPN": "Japan", "KOR": "Korea", "SGP": "Singapore"}
COUNTRY_SHORT = {"CSH": "SH", "JPN": "JP", "KOR": "KR", "SGP": "SG"}

def set_style():
    plt.rcParams.update({
        "font.size": 13,
        "font.family": "DejaVu Sans",
        "axes.edgecolor": GRID,
        "axes.linewidth": 1.0,
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        "savefig.dpi": 160,
        "savefig.facecolor": "white",
        "text.color": INK,
        "axes.labelcolor": INK,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
    })

def clean_axes(ax, keep=("left", "bottom")):
    for side, spine in ax.spines.items():
        spine.set_visible(side in keep)
        if side in keep:
            spine.set_color(GRID)
    ax.tick_params(length=0)

def title(fig, ax, text, sub=None, top=0.80):
    """Big bold finding-as-sentence title + smaller gray subtitle, placed in fixed figure-fraction
    space ABOVE the axes. Call this AFTER all plotting is done. Internally: tight_layout() first
    (so labels/ticks get proper margins), then subplots_adjust(top=...) carves out the title band,
    then the two text lines are placed by fixed fraction -- avoids suptitle's unpredictable spacing."""
    fig.tight_layout()
    fig.subplots_adjust(top=top)
    fig.text(0.02, 0.975, text, fontsize=16, fontweight="bold", color=INK, ha="left", va="top")
    if sub:
        fig.text(0.02, top + 0.065, sub, fontsize=11.5, color=MUTED, ha="left", va="top")

def takeaway(fig, text, y=-0.02):
    fig.text(0.5, y, text, ha="center", va="top", fontsize=11.5, color=INK,
              bbox=dict(boxstyle="round,pad=0.5", fc="#fbf1ea", ec="none"))
