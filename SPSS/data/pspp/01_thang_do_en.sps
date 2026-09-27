* ============================================================
* Module 01 -- Scales of Measurement & the Nature of Quantitative Data
* Data: vnm_truong_195_tong_hop.sav (PISA 2025 Vietnam, 195 schools)
* Purpose: illustrate the 4 scales of measurement with real variables.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- Nominal: REGION is just a region label, no order ---
FREQUENCIES VARIABLES=REGION
  /STATISTICS=NONE
  /FORMAT=NOTABLE.
FREQUENCIES VARIABLES=REGION.

* --- Ordinal: SCHSIZE_Q is an international quartile (1-4) ---
FREQUENCIES VARIABLES=SCHSIZE_Q.

* --- Interval: EDULEAD is a WLE index, has no true zero ---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV MIN MAX.

* --- Ratio: W_NRASCHBWT has a true zero, ratios are meaningful ---
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MEAN STDDEV MIN MAX.

* Note: in SPSS/PSPP, both EDULEAD (interval) and W_NRASCHBWT (ratio)
* are declared as Measure = Scale in Variable View -- the software
* merges these two theoretical scales into one category (see Module 01, section 1).
