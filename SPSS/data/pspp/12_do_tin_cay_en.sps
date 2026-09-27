* ============================================================
* Module 12 -- Reliability, Validity & Research Ethics
* Data: lop_hoc_240.sav
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Cronbach's Alpha for the Interest scale (h1,h2,h3) ---
RELIABILITY
  /VARIABLES=h1 h2 h3
  /SCALE('Interest') ALL
  /MODEL=ALPHA
  /SUMMARY=TOTAL.
* Expected result: Alpha=.71, item-total correlation h1=.57 h2=.49 h3=.54,
* alpha-if-deleted h1=.58 h2=.67 h3=.62.

* --- 2. Cronbach's Alpha for the Anxiety scale (a1,a2,a3) ---
RELIABILITY
  /VARIABLES=a1 a2 a3
  /SCALE('Anxiety') ALL
  /MODEL=ALPHA
  /SUMMARY=TOTAL.
* Expected result: Alpha=.76.

* ============================================================
* Note: EFA (evidence for construct validity) was run in
* 10_nhan_to_cum_en.sps -- go back and compare it against the Alpha
* results here.
* Research ethics (section 4 on the web page) is conceptual content,
* there is no corresponding PSPP command.
* ============================================================
