"""
Doi chieu ket qua Python (BRR-Fay, tinh tu data/weighted_results_q2.csv) voi ket qua
Khanh Linh tu chay ra tu IEA IDB Analyzer (dien vao templates/idb_analyzer_ket_qua_template.csv,
hai cot can dien la idb_pct va idb_se, lay tu file Excel IDB Analyzer xuat ra).

Cach dung:
  1. Mo file Excel IDB Analyzer xuat ra, chep cac gia tri Percentage va SE tuong ung
     vao dung hang item/country trong templates/idb_analyzer_ket_qua_template.csv
     (hoac luu ban moi, truyen duong dan qua --idb).
  2. Chay: python3 compare_with_idb.py [--idb duong_dan_file_da_dien.csv]
  3. Ket qua in ra 3 dang bang: console (can le dep), CSV (data/comparison_table.csv),
     Markdown (data/comparison_table.md) -- de dan thang vao bao cao/Google Docs.

Nguong canh bao mac dinh: lech % > 0.5 diem phan tram hoac lech SE > 0.3 diem phan tram
thi danh dau can kiem tra lai (CANH BAO); con lai la KHOP.
"""
import argparse
import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PY = os.path.join(HERE, "..", "data", "weighted_results_q2.csv")
DEFAULT_IDB = os.path.join(HERE, "..", "templates", "idb_analyzer_ket_qua_template.csv")
OUT_CSV = os.path.join(HERE, "..", "data", "comparison_table.csv")
OUT_MD = os.path.join(HERE, "..", "data", "comparison_table.md")

TOL_PCT = 0.5
TOL_SE = 0.3


def load_python_results(path):
    out = {}
    with open(path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            out[(row["item"], row["country"])] = row
    return out


def load_idb_results(path):
    out = {}
    with open(path, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            if row["idb_pct"].strip() == "":
                continue
            out[(row["item"], row["country"])] = row
    return out


def build_comparison(py_res, idb_res):
    rows = []
    for key, idb in idb_res.items():
        py = py_res.get(key)
        if py is None:
            continue
        item, country = key
        py_pct = float(py["pct_weighted"])
        py_se = float(py["se_brr_fay"])
        idb_pct = float(idb["idb_pct"])
        idb_se = float(idb["idb_se"]) if idb["idb_se"].strip() else None

        diff_pct = round(idb_pct - py_pct, 2)
        diff_se = round(idb_se - py_se, 2) if idb_se is not None else None

        flag = "KHOP"
        if abs(diff_pct) > TOL_PCT or (diff_se is not None and abs(diff_se) > TOL_SE):
            flag = "CANH BAO"

        rows.append(dict(
            item=item, country=country,
            python_pct=py_pct, idb_pct=idb_pct, diff_pct=diff_pct,
            python_se=py_se, idb_se=idb_se, diff_se=diff_se,
            flag=flag,
        ))
    return rows


def print_console(rows):
    if not rows:
        print("Chua co hang nao duoc dien trong file IDB template -- khong co gi de doi chieu.")
        return
    header = f"{'item':<9}{'ctry':<6}{'py%':>8}{'idb%':>8}{'diff%':>8}{'py_se':>8}{'idb_se':>8}{'diff_se':>8}  flag"
    print(header)
    print("-" * len(header))
    for r in rows:
        idb_se_s = f"{r['idb_se']:.2f}" if r["idb_se"] is not None else "   -"
        diff_se_s = f"{r['diff_se']:.2f}" if r["diff_se"] is not None else "   -"
        print(f"{r['item']:<9}{r['country']:<6}{r['python_pct']:>8.2f}{r['idb_pct']:>8.2f}{r['diff_pct']:>8.2f}"
              f"{r['python_se']:>8.2f}{idb_se_s:>8}{diff_se_s:>8}  {r['flag']}")


def write_csv(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["item", "country", "python_pct", "idb_pct", "diff_pct", "python_se", "idb_se", "diff_se", "flag"])
        for r in rows:
            w.writerow([r["item"], r["country"], r["python_pct"], r["idb_pct"], r["diff_pct"],
                        r["python_se"], r["idb_se"], r["diff_se"], r["flag"]])


def write_markdown(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    lines = [
        "| Biến | Nước | % Python (BRR-Fay) | % IDB Analyzer | Lệch % | SE Python | SE IDB | Lệch SE | Kết luận |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    for r in rows:
        idb_se_s = f"{r['idb_se']:.2f}" if r["idb_se"] is not None else "—"
        diff_se_s = f"{r['diff_se']:.2f}" if r["diff_se"] is not None else "—"
        lines.append(
            f"| {r['item']} | {r['country']} | {r['python_pct']:.2f} | {r['idb_pct']:.2f} | {r['diff_pct']:.2f} | "
            f"{r['python_se']:.2f} | {idb_se_s} | {diff_se_s} | {r['flag']} |"
        )
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--idb", default=DEFAULT_IDB, help="Duong dan file CSV da dien ket qua IDB Analyzer")
    ap.add_argument("--py", default=DEFAULT_PY, help="Duong dan file ket qua Python (mac dinh data/weighted_results_q2.csv)")
    args = ap.parse_args()

    py_res = load_python_results(args.py)
    idb_res = load_idb_results(args.idb)
    rows = build_comparison(py_res, idb_res)

    print_console(rows)
    if rows:
        write_csv(rows, OUT_CSV)
        write_markdown(rows, OUT_MD)
        print(f"\nDa ghi: {OUT_CSV}")
        print(f"Da ghi: {OUT_MD}")


if __name__ == "__main__":
    main()
