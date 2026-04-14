import { getRiskGrade } from "./scoreCalculator.js";

export function buildScenarioResult(form, scoreData) {
  const {
    score,
    debtRatio,
    monthlyCost,
    profitGap,
    breakdown = [],
  } = scoreData;

  const grade = getRiskGrade(score);

  const sixMonths = [];
  const oneYear = [];
  const actions = [];

  if (debtRatio >= 60) {
    sixMonths.push({
      issue: "대출 상환 부담 증가",
      probability: "높음",
      impact: "현금흐름 압박 가능",
      reason: `초기 투자 대비 대출 비율이 ${debtRatio}%로 높습니다.`,
    });
    actions.push("대출 비중 재조정 또는 상환 계획 재검토");
  }

  if (profitGap < 0) {
    sixMonths.push({
      issue: "운영 적자 발생 가능성",
      probability: "높음",
      impact: `월 ${Math.abs(profitGap).toLocaleString()}원 수준 손실 가능`,
      reason: "월매출보다 월 고정비·변동비·인건비·에너지비 합계가 더 큽니다.",
    });
    actions.push("월 고정비 절감 또는 판로/단가 개선 필요");
  }

  if (form.subsidyRiskLevel === "medium" || form.subsidyRiskLevel === "high" || form.subsidyClawbackTrigger) {
    oneYear.push({
      issue: "보조금 환수 리스크",
      probability:
        form.subsidyRiskLevel === "high" || form.subsidyClawbackTrigger ? "높음" : "중간",
      impact: "지원금 환수 또는 행정상 불이익 가능",
      reason: "의무 운영기간, 성과보고, 환수 트리거가 반영되었습니다.",
    });
    actions.push("보조금 의무 운영기간·성과보고 조건 재확인");
  }

  if (
    form.contractRiskLevel === "medium" ||
    form.contractRiskLevel === "high" ||
    form.terminationPenaltyLevel === "high" ||
    form.liabilityLevel === "high"
  ) {
    oneYear.push({
      issue: "계약 분쟁 가능성",
      probability:
        form.contractRiskLevel === "high" || form.terminationPenaltyLevel === "high"
          ? "높음"
          : "중간",
      impact: "해지 분쟁, 위약금 부담 가능",
      reason: "중도해지 또는 손해배상 조항이 사용자에게 불리합니다.",
    });
    actions.push("중도해지·손해배상 조항 수정 검토");
  }

  if (form.maintenanceOwner === "user") {
    sixMonths.push({
      issue: "유지보수 비용 집중",
      probability: "중간",
      impact: "장애 발생 시 추가 비용 지출 가능",
      reason: "유지보수 책임이 사용자에게 집중되어 있습니다.",
    });
    actions.push("유지보수 책임 범위와 장애 대응 SLA 명확화");
  }

  if (sixMonths.length === 0) {
    sixMonths.push({
      issue: "단기 운영 리스크 낮음",
      probability: "낮음",
      impact: "즉각적인 손실 가능성 제한적",
      reason: "현재 입력 기준으로 단기 재무·운영 위험이 비교적 낮습니다.",
    });
  }

  if (oneYear.length === 0) {
    oneYear.push({
      issue: "중장기 리스크 관찰 필요",
      probability: "낮음",
      impact: "정책·시장 변화에 따라 변동 가능",
      reason: "현재 입력값 기준으로 중장기 고위험 신호는 제한적입니다.",
    });
  }

  if (actions.length === 0) {
    actions.push("현재 조건 유지하되 월별 운영비와 계약 조건을 정기 점검");
  }

  return {
    score,
    summary: `종합 위험도는 '${grade}' 수준입니다. 월 운영비는 ${monthlyCost.toLocaleString()}원이며, 월 손익 차이는 ${profitGap.toLocaleString()}원입니다.`,
    breakdown,
    evidence: form.analysisEvidence || [],
    future_risk: {
      "6_months": sixMonths,
      "1_year": oneYear,
    },
    actions,
  };
}