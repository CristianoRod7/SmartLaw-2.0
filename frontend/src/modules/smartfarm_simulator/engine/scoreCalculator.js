import { riskRules } from "./riskRules.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const getRangeMatch = (value, rules) => {
  const matched = rules.find((rule) => value <= rule.max);
  return matched || { score: 0, label: "없음" };
};

export function calculateSimulationScore(form) {
  const {
    initialCost = 0,
    loanAmount = 0,
    interestRate = 0,
    monthlyFixedCost = 0,
    monthlyVariableCost = 0,
    monthlyRevenue = 0,
    subsidyRiskLevel = "none",
    contractRiskLevel = "none",
    maintenanceOwner = "shared",
    crop = "기타",
    facilityType = "기타",
    laborCost = 0,
    energyCost = 0,
    logisticsCost = 0,
    mandatoryOperationPeriod = 0,
    reportingDuty = false,
    subsidyClawbackTrigger = false,
    terminationPenaltyLevel = "none",
    liabilityLevel = "none",
  } = form;

  const debtRatio =
    initialCost > 0 ? Math.round((loanAmount / initialCost) * 100) : 0;

  const monthlyCost =
    Number(monthlyFixedCost) +
    Number(monthlyVariableCost) +
    Number(laborCost) +
    Number(energyCost) +
    Number(logisticsCost);

  const profitGap = Number(monthlyRevenue) - monthlyCost;

  const debtMatch = getRangeMatch(debtRatio, riskRules.debtRatio);
  const interestMatch = getRangeMatch(Number(interestRate), riskRules.interestRate);

  const subsidyScore = riskRules.subsidyRisk[subsidyRiskLevel] ?? 0;
  const contractScore = riskRules.contractRisk[contractRiskLevel] ?? 0;
  const maintenanceScore = riskRules.maintenanceRisk[maintenanceOwner] ?? 0;
  const cropScore = riskRules.cropRisk[crop] ?? riskRules.cropRisk["기타"];
  const facilityScore =
    riskRules.facilityRisk[facilityType] ?? riskRules.facilityRisk["기타"];

  let policyDutyScore = 0;
  if (mandatoryOperationPeriod >= 36) policyDutyScore += 10;
  else if (mandatoryOperationPeriod >= 12) policyDutyScore += 5;

  if (reportingDuty) policyDutyScore += 5;
  if (subsidyClawbackTrigger) policyDutyScore += 15;

  let penaltyScore = 0;
  if (terminationPenaltyLevel === "high") penaltyScore += 15;
  else if (terminationPenaltyLevel === "medium") penaltyScore += 8;

  if (liabilityLevel === "high") penaltyScore += 15;
  else if (liabilityLevel === "medium") penaltyScore += 8;

  let profitScore = 0;
  if (profitGap < 0) profitScore += 25;
  else if (profitGap < monthlyCost * 0.1) profitScore += 15;
  else if (profitGap < monthlyCost * 0.2) profitScore += 8;

  const breakdown = [
    {
      key: "debt",
      label: "대출 부담",
      score: debtMatch.score,
      detail: `초기 투자 대비 대출 비율 ${debtRatio}%`,
    },
    {
      key: "interest",
      label: "금리 부담",
      score: interestMatch.score,
      detail: `적용 금리 ${interestRate}%`,
    },
    {
      key: "subsidy",
      label: "보조금 리스크",
      score: subsidyScore + policyDutyScore,
      detail: `보조금 위험 ${subsidyRiskLevel}, 의무 운영기간 ${mandatoryOperationPeriod || 0}개월`,
    },
    {
      key: "contract",
      label: "계약 분쟁 리스크",
      score: contractScore + penaltyScore,
      detail: `계약 위험 ${contractRiskLevel}, 위약금/책임 범위 반영`,
    },
    {
      key: "maintenance",
      label: "유지보수 책임",
      score: maintenanceScore,
      detail: `유지보수 책임 주체: ${maintenanceOwner}`,
    },
    {
      key: "operation",
      label: "작목 / 시설 리스크",
      score: cropScore + facilityScore,
      detail: `${crop}, ${facilityType}`,
    },
    {
      key: "profit",
      label: "수익성 위험",
      score: profitScore,
      detail: `월 손익 차이 ${profitGap.toLocaleString()}원`,
    },
  ];

  const rawScore = breakdown.reduce((sum, item) => sum + item.score, 0);

  return {
    score: clamp(Math.round(rawScore), 0, 100),
    debtRatio,
    monthlyCost,
    profitGap,
    breakdown,
  };
}

export function getRiskGrade(score) {
  if (score >= 70) return "높음";
  if (score >= 40) return "주의";
  return "낮음";
}