// js/safeflight/ruleTable.js
export const CONTRAINDICATION_RULES = [

  // ── ICD-10 prefix rules ──────────────────────────────────────
  {
    id: 'R001',
    label: 'Interstitial emphysema',
    icd10Prefixes: ['J98'],
    baseRisk: 'RED',
    reason: 'Air trapping risk at altitude',
    recommendation: 'Do not fly. Requires physician clearance before air travel.'
  },
  {
    id: 'R002',
    label: 'Emphysema',
    icd10Prefixes: ['J43'],
    baseRisk: 'YELLOW',
    reason: 'Reduced pulmonary reserve at cabin altitude',
    recommendation: 'Consult pulmonologist before flying. May need supplemental oxygen.'
  },
  {
    id: 'R003',
    label: 'COPD',
    icd10Prefixes: ['J44'],
    baseRisk: 'YELLOW',
    reason: 'Reduced pulmonary reserve at cabin altitude',
    recommendation: 'Discuss with pulmonologist. Consider supplemental oxygen evaluation.'
  },
  {
    id: 'R004',
    label: 'Pneumothorax',
    icd10Prefixes: ['J93'],
    baseRisk: 'RED',
    reason: 'Cabin pressure change risks tension pneumothorax',
    recommendation: 'Do not fly. Wait minimum 2–3 weeks post-resolution and obtain physician clearance.'
  },
  {
    id: 'R005',
    label: 'Epilepsy — uncontrolled',
    icd10Prefixes: ['G40'],
    baseRisk: 'RED',
    reason: 'Seizure risk in confined aircraft environment',
    recommendation: 'Physician clearance required. Must demonstrate adequate seizure control.'
  },
  {
    id: 'R006',
    label: 'Recent abdominal surgery',
    icd10Prefixes: ['K91'],
    baseRisk: 'YELLOW',
    temporalModifier: { withinWeeks: 4, otherwiseRisk: 'GREEN' },
    reason: 'Post-op gas expansion risk at altitude',
    recommendation: 'Avoid flying within 4 weeks of abdominal surgery.'
  },
  {
    id: 'R007',
    label: 'Decompensated CHF',
    icd10Prefixes: ['I50'],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Hypoxia at altitude may worsen cardiac decompensation',
    recommendation: 'Consult cardiologist. Flight contraindicated until compensation achieved.'
  },

  // ── ICD-10 range rules ────────────────────────────────────────
  {
    id: 'R010',
    label: 'Untreated psychosis',
    icd10Ranges: [{ letter: 'F', low: 20, high: 29 }],
    baseRisk: 'GREEN',
    reason: 'Behavior monitoring recommended',
    recommendation: 'Ensure adequate medication compliance. Companion escort recommended.'
  },
  {
    id: 'R011',
    label: 'Substance use disorders',
    icd10Ranges: [{ letter: 'F', low: 10, high: 19 }],
    baseRisk: 'GREEN',
    reason: 'No direct physiological flight contraindication',
    recommendation: 'No medical flight restriction. Behavioral monitoring may apply.'
  },
  {
    id: 'R012',
    label: 'Severe anemia',
    icd10Ranges: [{ letter: 'D', low: 50, high: 64 }],
    baseRisk: 'YELLOW',
    reason: 'Reduced oxygen-carrying capacity worsened at altitude',
    recommendation: 'Check hemoglobin before flight. Consider supplemental oxygen if Hgb < 8.5 g/dL.'
  },
  {
    id: 'R013',
    label: 'Severe hypertension',
    icd10Ranges: [{ letter: 'I', low: 10, high: 15 }],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Uncontrolled hypertension increases cardiovascular risk at altitude',
    recommendation: 'Physician review required. Ensure BP controlled before travel.'
  },
  {
    id: 'R014',
    label: 'Recent stroke / cerebrovascular disease',
    icd10Ranges: [{ letter: 'I', low: 60, high: 69 }],
    baseRisk: 'CONSULT_PHYSICIAN',
    temporalModifier: { withinWeeks: 4, otherwiseRisk: 'YELLOW' },
    reason: 'Risk of extension or secondary stroke at altitude',
    recommendation: 'Physician clearance mandatory. No flight within 4 weeks of acute stroke.'
  },

  // ── ICD-10 exact rules ────────────────────────────────────────
  {
    id: 'R020',
    label: 'Fear of flying',
    icd10Exact: ['F40.243'],
    baseRisk: 'GREEN',
    reason: 'No physiological flight contraindication',
    recommendation: 'No medical restriction. Behavioral/anxiety management may be helpful.'
  },
  {
    id: 'R021',
    label: 'Unstable angina',
    icd10Exact: ['I20.0'],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Exertion and hypoxia may trigger ischemic event',
    recommendation: 'Do not fly until stabilized. Cardiologist clearance required.'
  },
  {
    id: 'R022',
    label: 'Recent myocardial infarction',
    icd10Prefixes: ['I21', 'I22'],
    baseRisk: 'CONSULT_PHYSICIAN',
    temporalModifier: { withinWeeks: 6, otherwiseRisk: 'YELLOW' },
    reason: 'Risk of arrhythmia and hemodynamic instability at altitude',
    recommendation: 'No flight within 6 weeks of MI. Cardiologist clearance required.'
  },
  {
    id: 'R023',
    label: 'Oxygen-dependent',
    icd10Exact: ['Z99.81'],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Requires supplemental O2 arrangement with airline',
    recommendation: 'Pre-arrange in-flight oxygen. Physician letter required by most airlines.'
  },
  {
    id: 'R024',
    label: 'End-stage renal disease',
    icd10Exact: ['N18.6'],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Dialysis scheduling and fluid management required',
    recommendation: 'Arrange dialysis at destination. Physician travel clearance required.'
  },
  {
    id: 'R025',
    label: 'Renal dialysis dependence',
    icd10Exact: ['Z99.2'],
    baseRisk: 'CONSULT_PHYSICIAN',
    reason: 'Dialysis scheduling and fluid management required',
    recommendation: 'Pre-arrange dialysis at destination before travel.'
  },

  // ── Personality disorders ────────────────────────────────────
  {
    id: 'R030',
    label: 'Personality disorders',
    icd10Prefixes: ['F60'],
    baseRisk: 'GREEN',
    reason: 'No direct physiological flight contraindication',
    recommendation: 'No medical flight restriction.'
  },

  // ── SNOMED procedure rules ────────────────────────────────────
  {
    id: 'P001',
    label: 'Vitrectomy',
    snomedCodes: ['75732000'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Intraocular gas bubble contraindicated at altitude',
    recommendation: 'No flight until intraocular gas fully absorbed. Verify with ophthalmologist.'
  },
  {
    id: 'P002',
    label: 'Pneumatic retinopexy',
    snomedCodes: ['231766008'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Intraocular gas bubble contraindicated at altitude',
    recommendation: 'No flight until intraocular gas fully absorbed. Ophthalmologist clearance required.'
  },
  {
    id: 'P003',
    label: 'Scleral buckling',
    snomedCodes: ['426534009'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Post-surgical ocular pressure sensitivity at altitude',
    recommendation: 'No flight until cleared by ophthalmologist.'
  },
  {
    id: 'P004',
    label: 'Macular hole repair',
    snomedCodes: ['700373001'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Intraocular gas contraindicated at altitude',
    recommendation: 'No flight until confirmed gas absorption by ophthalmologist.'
  },
  {
    id: 'P005',
    label: 'Chest tube / thoracostomy',
    snomedCodes: ['31198006', '264957007'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Recent pleural intervention contraindicated at altitude',
    recommendation: 'No flight until chest tube removed and lung fully expanded. Physician clearance required.'
  },
  {
    id: 'P006',
    label: 'Lung biopsy',
    snomedCodes: ['430752003'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Risk of pneumothorax at altitude post-biopsy',
    recommendation: 'No flight until cleared by pulmonologist. Imaging confirmation of lung re-expansion needed.'
  },
  {
    id: 'P007',
    label: 'Wedge resection',
    snomedCodes: ['232635006'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Reduced pulmonary reserve post-resection at altitude',
    recommendation: 'Thoracic surgery clearance required before flight.'
  },
  {
    id: 'P008',
    label: 'Lobectomy',
    snomedCodes: ['739141006'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Significantly reduced pulmonary reserve at altitude',
    recommendation: 'Pulmonologist/thoracic surgeon clearance required. O2 assessment recommended.'
  },
  {
    id: 'P009',
    label: 'Pneumonectomy',
    snomedCodes: ['232737004'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'GREEN' },
    pendingClinicalReview: true,
    reason: 'Single-lung patient — high altitude hypoxia risk',
    recommendation: 'Physician clearance and supplemental O2 assessment mandatory.'
  },
  {
    id: 'P010',
    label: 'Lung transplant',
    snomedCodes: ['16172007'],
    baseRisk: 'RED',
    temporalModifier: { withinWeeks: 12, otherwiseRisk: 'CONSULT_PHYSICIAN' },
    pendingClinicalReview: true,
    reason: 'Immunosuppression and pulmonary fragility at altitude',
    recommendation: 'Transplant team clearance required at any time post-transplant.'
  },

];
