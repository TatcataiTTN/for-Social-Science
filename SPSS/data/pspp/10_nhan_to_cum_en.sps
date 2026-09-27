* ============================================================
* Module 10 -- Exploratory Factor Analysis & Cluster Analysis
* Data: lop_hoc_240.sav (EFA) + vnm_truong_195_tong_hop.sav (cluster)
* Human-reviewed English translation -- syntax is identical to the VI file.
* ============================================================
GET FILE='../lop_hoc_240.sav'.

* --- 1. Exploratory Factor Analysis (EFA), fixed at 2 factors ---
FACTOR VARIABLES=h1 h2 h3 a1 a2 a3
  /EXTRACTION=PC
  /CRITERIA=FACTORS(2)
  /ROTATION=VARIMAX.
* Expected result: h1-h3 load onto one factor, a1-a3 load onto the other
* (matches the "interest" vs "anxiety" latent structure used to simulate
* the dataset).
* Note: PSPP uses EXTRACTION=PC (Principal Component), whose loadings are
* not 100% identical to "principal axis factoring" in Python, but the
* conclusion about which variables belong to which factor is the same.

GET FILE='../sav/vnm_truong_195_tong_hop.sav'.

* --- 2. K-means cluster analysis on 5 school-level WLE indices ---
QUICK CLUSTER EDULEAD NEGSCLIM STAFFSHORT EDUSHORT DIGPREP
  /CRITERIA CLUSTER(3)
  /PRINT INITIAL.
* Expected result: PSPP's cluster sizes will DIFFER from Python's (KMeans)
* because of different K-means initialization strategies -- this is a
* known, expected difference explained in the lesson, not a bug.

* ============================================================
* Note: the Silhouette score (cluster quality metric) and multilevel/SEM
* models have NO equivalent PSPP command -- see notebook
* 10_nhan_to_cum_en.ipynb to compute the Silhouette score in Python
* (scikit-learn).
* ============================================================
