"""
Tinh ty le co trong so (BRR-Fay, k=0.5) cho Cau hoi 2 cua nhom TALIS 2024:
  - TT4G36        : ty le giao vien co dung AI trong 12 thang qua (toan mau)
  - TT4G37A..I    : muc dich su dung AI (chi tinh trong nhom da tra loi "Co" o TT4G36)

Bon he thong so sanh: CSH (Thuong Hai), JPN (Nhat Ban), KOR (Han Quoc), SGP (Singapore).

Yeu cau: file du lieu quoc te TALIS 2024 giao vien (btgintt4.sav) phai co san cuc bo.
Duong dan mac dinh tro toi noi file nay dang duoc luu trong may cua Nghia; doi lai
bien SAV_PATH ben duoi neu chay tren may khac (file nay KHONG duoc dua vao repo vi
qua lon va thuoc dien du lieu han che chia se lai nguyen file).

Chay: python3 weighted_stats_q2.py
Ket qua: data/weighted_results_q2.json + data/weighted_results_q2.csv
"""
import json
import csv
import os
import sys

import numpy as np
import pyreadstat

SAV_PATH = os.environ.get(
    "TALIS_SAV_PATH",
    "/Users/tuannghiat/Downloads/Đào tạo riêng - SPSS for Social Science/"
    "2-10-De-tai-VKL/TALIS 2024/teachers_SPSS/btgintt4.sav",
)

COUNTRIES = ["CSH", "JPN", "KOR", "SGP"]
ITEMS_37 = [f"TT4G37{c}" for c in "ABCDEFGHI"]
FAY_K = 0.5
N_REPLICATES = 100

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_JSON = os.path.join(HERE, "..", "data", "weighted_results_q2.json")
OUT_CSV = os.path.join(HERE, "..", "data", "weighted_results_q2.csv")


def brr_fay_stats(sub, yvar):
    s = sub[sub[yvar].isin([1.0, 2.0])]
    n = len(s)
    if n == 0:
        return None
    y = (s[yvar] == 1.0).astype(float).values
    w0 = s["TCHWGT"].values
    theta = np.average(y, weights=w0)

    naive_var = np.average((y - theta) ** 2, weights=w0) / n
    naive_se = float(np.sqrt(naive_var))

    sq_devs = []
    for r in range(1, N_REPLICATES + 1):
        wr = s[f"TRWGT{r}"].values
        theta_r = np.average(y, weights=wr)
        sq_devs.append((theta_r - theta) ** 2)
    fay_var = sum(sq_devs) / (N_REPLICATES * (1 - FAY_K) ** 2)
    fay_se = float(np.sqrt(fay_var))

    deff = (fay_se / naive_se) ** 2 if naive_se > 0 else None

    return dict(
        n=int(n),
        pct=round(theta * 100, 2),
        naive_se=round(naive_se * 100, 2),
        se=round(fay_se * 100, 2),
        deff=round(deff, 2) if deff else None,
        lo=round((theta - 1.96 * fay_se) * 100, 2),
        hi=round((theta + 1.96 * fay_se) * 100, 2),
    )


def main():
    if not os.path.exists(SAV_PATH):
        sys.exit(
            f"Khong tim thay file du lieu: {SAV_PATH}\n"
            "Dat bien moi truong TALIS_SAV_PATH tro dung duong dan btgintt4.sav tren may nay."
        )

    cols = ["CNTRY", "TT4G36"] + ITEMS_37 + ["TCHWGT"] + [f"TRWGT{i}" for i in range(1, N_REPLICATES + 1)]
    df, meta = pyreadstat.read_sav(SAV_PATH, usecols=cols, user_missing=True)
    foc = df[df["CNTRY"].isin(COUNTRIES)].copy()
    labels = {v: meta.column_names_to_labels.get(v, "") for v in ITEMS_37}
    labels["TT4G36"] = meta.column_names_to_labels.get("TT4G36", "")

    results = {}
    for item in ["TT4G36"] + ITEMS_37:
        base = foc if item == "TT4G36" else foc[foc["TT4G36"] == 1.0]
        results[item] = {"label": labels.get(item, ""), "by_country": {}}
        for c, sub in base.groupby("CNTRY"):
            r = brr_fay_stats(sub, item)
            if r:
                results[item]["by_country"][c] = r

    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["item", "label", "country", "n", "pct_weighted", "se_naive", "se_brr_fay", "deff", "ci95_lo", "ci95_hi"])
        for item, obj in results.items():
            for c, r in obj["by_country"].items():
                w.writerow([item, obj["label"], c, r["n"], r["pct"], r["naive_se"], r["se"], r["deff"], r["lo"], r["hi"]])

    print(f"Da ghi: {OUT_JSON}")
    print(f"Da ghi: {OUT_CSV}")
    for item, obj in results.items():
        print(f"\n{item} — {obj['label']}")
        for c in COUNTRIES:
            r = obj["by_country"].get(c)
            if r:
                print(f"  {c}: n={r['n']:>5}  %={r['pct']:>6.2f}  SE_BRR={r['se']:>5.2f}  DEFF={r['deff']:>5.2f}  CI95=[{r['lo']:.2f}, {r['hi']:.2f}]")


if __name__ == "__main__":
    main()
