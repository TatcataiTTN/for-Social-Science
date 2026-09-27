* ============================================================
* Module 02 -- Sampling & Sample Size
* Data: vnm_truong_195_tong_hop.sav (PISA 2025 Vietnam, 195 schools)
* Purpose: verify how sample weighting changes results.
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- Step 1: mean EDULEAD UNWEIGHTED (each school counts as 1) ---
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.

* --- Step 2: apply the sample weight W_NRASCHBWT ---
WEIGHT BY W_NRASCHBWT.
DESCRIPTIVES VARIABLES=EDULEAD
  /STATISTICS=MEAN STDDEV.
* Expected: unweighted mean = 0.7653 (N=195)
*           weighted mean   = 0.7874 (effective N = sum of weights = 7284.6)

* --- Step 3: check the spread of the weight itself ---
WEIGHT OFF.
DESCRIPTIVES VARIABLES=W_NRASCHBWT
  /STATISTICS=MIN MAX MEAN.
* Weight ranges from 1.0 to 617.2 -- the highest-weighted school represents
* about 617x as many students as the lowest-weighted school.

* ============================================================
* Note: the SAMPLE-SIZE table (Julious 2005 + Cohen 1988) in Module 02
* section 4 is computed with statsmodels.stats.power.TTestIndPower in
* Python -- PSPP has NO built-in power-analysis command, see the
* 02_chon_mau_en.ipynb notebook for the full code.
* ============================================================
