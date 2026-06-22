// js/safeflight/riskEngine.js
import { CONTRAINDICATION_RULES } from './ruleTable.js';

const RISK_ORDER = { GREEN: 0, YELLOW: 1, RED: 2, CONSULT_PHYSICIAN: 3 };

function maxRisk(a, b) {
  return RISK_ORDER[a] >= RISK_ORDER[b] ? a : b;
}

function downgradeRisk(level) {
  const order = ['GREEN', 'YELLOW', 'RED', 'CONSULT_PHYSICIAN'];
  const idx = order.indexOf(level);
  return order[Math.max(0, idx - 1)];
}

function buildIndex(rules) {
  const exactIcd10  = new Map();
  const prefixIcd10 = new Map();
  const rangeIcd10  = [];
  const exactSnomed = new Map();

  for (const rule of rules) {
    rule.icd10Exact?.forEach(code  => exactIcd10.set(code, rule));
    rule.icd10Prefixes?.forEach(pfx  => prefixIcd10.set(pfx, rule));
    rule.icd10Ranges?.forEach(range  => rangeIcd10.push({ range, rule }));
    rule.snomedCodes?.forEach(code   => exactSnomed.set(code, rule));
  }

  return { exactIcd10, prefixIcd10, rangeIcd10, exactSnomed };
}

const INDEX = buildIndex(CONTRAINDICATION_RULES);

function matchIcd10(code) {
  if (INDEX.exactIcd10.has(code)) return INDEX.exactIcd10.get(code);

  for (let len = code.length; len > 0; len--) {
    const pfx = code.slice(0, len);
    if (INDEX.prefixIcd10.has(pfx)) return INDEX.prefixIcd10.get(pfx);
  }

  const letter = code[0].toUpperCase();
  const numStr = code.slice(1).replace(/\..+/, '');
  const num = parseFloat(numStr);
  if (!isNaN(num)) {
    for (const { range, rule } of INDEX.rangeIcd10) {
      if (range.letter === letter && num >= range.low && num <= range.high) {
        return rule;
      }
    }
  }

  return null;
}

function matchSnomed(code) {
  return INDEX.exactSnomed.get(code) || null;
}

function applyTemporalModifier(rule, dateStr) {
  if (!rule.temporalModifier) return rule.baseRisk;
  if (!dateStr) return rule.baseRisk; // conservative: assume recent

  const eventDate = new Date(dateStr);
  const now = new Date();
  const weeksDiff = (now - eventDate) / (1000 * 60 * 60 * 24 * 7);

  return weeksDiff <= rule.temporalModifier.withinWeeks
    ? rule.baseRisk
    : rule.temporalModifier.otherwiseRisk;
}

function evaluateCondition(condition) {
  const rule = matchIcd10(condition.code);
  if (!rule) {
    return {
      code: condition.code,
      display: condition.display,
      system: 'icd10',
      risk: 'GREEN',
      matched: false,
      reason: 'No contraindication rule found.',
      recommendation: 'No flight restriction identified.'
    };
  }

  let risk = applyTemporalModifier(rule, condition.onsetDate);

  if (condition.clinicalStatus === 'resolved') {
    risk = downgradeRisk(risk);
  }

  return {
    code: condition.code,
    display: condition.display || rule.label,
    system: 'icd10',
    risk,
    matched: true,
    ruleId: rule.id,
    ruleLabel: rule.label,
    reason: rule.reason,
    recommendation: rule.recommendation,
    pendingClinicalReview: rule.pendingClinicalReview || false
  };
}

function evaluateProcedure(procedure) {
  const rule = matchSnomed(procedure.code);
  if (!rule) {
    return {
      code: procedure.code,
      display: procedure.display,
      system: 'snomed',
      risk: 'GREEN',
      matched: false,
      reason: 'No contraindication rule found.',
      recommendation: 'No flight restriction identified.'
    };
  }

  const risk = applyTemporalModifier(rule, procedure.performedDate);

  return {
    code: procedure.code,
    display: procedure.display || rule.label,
    system: 'snomed',
    risk,
    matched: true,
    ruleId: rule.id,
    ruleLabel: rule.label,
    reason: rule.reason,
    recommendation: rule.recommendation,
    pendingClinicalReview: rule.pendingClinicalReview || false
  };
}

export function runRiskEngine({ conditions = [], procedures = [] }) {
  const findings = [
    ...conditions.map(evaluateCondition),
    ...procedures.map(evaluateProcedure)
  ];

  let overallRisk = 'GREEN';
  let yellowCount = 0;
  let redCount = 0;

  for (const f of findings) {
    overallRisk = maxRisk(overallRisk, f.risk);
    if (f.risk === 'YELLOW') yellowCount++;
    if (f.risk === 'RED')    redCount++;
  }

  if (yellowCount >= 3) overallRisk = maxRisk(overallRisk, 'CONSULT_PHYSICIAN');
  if (redCount >= 2)    overallRisk = maxRisk(overallRisk, 'CONSULT_PHYSICIAN');

  const matchedFindings  = findings.filter(f => f.matched);
  const unmatchedCount   = findings.filter(f => !f.matched).length;
  const hasPendingReview = findings.some(f => f.pendingClinicalReview && f.matched);

  return {
    overallRisk,
    findings,
    matchedFindings,
    unmatchedCount,
    hasPendingReview,
    summary: buildSummary(overallRisk, hasPendingReview)
  };
}

function buildSummary(risk, hasPendingReview) {
  const messages = {
    GREEN:             'No flight contraindications identified from your medical records.',
    YELLOW:            'Some conditions may require attention before flying. Review recommendations below.',
    RED:               'One or more conditions are a contraindication to flight. Do not fly without physician clearance.',
    CONSULT_PHYSICIAN: 'Your medical history requires physician evaluation before travel. Do not fly without clearance.'
  };
  let msg = messages[risk];
  if (hasPendingReview) {
    msg += ' Note: some surgical recovery windows are pending final clinical validation.';
  }
  return msg;
}
