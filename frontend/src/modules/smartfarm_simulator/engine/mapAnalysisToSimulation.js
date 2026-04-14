export function mapAnalysisToSimulation(analysis) {
  const text = JSON.stringify(analysis || {}).toLowerCase();

  const nextValues = {
    contractRiskLevel: "low",
    maintenanceOwner: "shared",
    terminationPenaltyLevel: "none",
    liabilityLevel: "low",
    subsidyClawbackTrigger: false,
    dataOwnership: "shared",
    evidence: [],
  };

  const pushEvidence = (title, reason) => {
    nextValues.evidence.push({ title, reason });
  };

  if (
    text.includes("하자보수는 별도로 정하지 않") ||
    text.includes("유지보수 및 고장은 전적으로 을의 책임") ||
    text.includes("하자에 대해 책임지지 않") ||
    text.includes("유지보수")
  ) {
    nextValues.maintenanceOwner = "user";
    nextValues.contractRiskLevel = "high";
    pushEvidence(
      "유지보수 책임 집중",
      "계약서에서 유지보수·하자 대응 책임이 사용자에게 집중되거나, 하자보수 기준이 불명확하게 보입니다."
    );
  }

  if (
    text.includes("위약금") ||
    text.includes("총 계약금액의 50%") ||
    text.includes("중도해지")
  ) {
    nextValues.terminationPenaltyLevel = "high";
    nextValues.contractRiskLevel = "high";
    pushEvidence(
      "중도해지 / 위약금 조항",
      "중도해지 시 과도한 위약금 또는 일방적으로 불리한 해지 조건이 감지되었습니다."
    );
  }

  if (
    text.includes("모든 책임") ||
    text.includes("무제한 책임") ||
    text.includes("손해배상")
  ) {
    nextValues.liabilityLevel = "high";
    nextValues.contractRiskLevel = "high";
    pushEvidence(
      "과도한 책임 범위",
      "손해배상 또는 법적 책임 범위가 사용자에게 과도하게 불리하게 설정된 것으로 보입니다."
    );
  }

  if (
    text.includes("환수") ||
    text.includes("전액 환수") ||
    text.includes("사유 없이 지원금을 환수")
  ) {
    nextValues.subsidyClawbackTrigger = true;
    pushEvidence(
      "보조금 환수 트리거",
      "보조금 환수 또는 의무 미이행 시 불이익 조항이 포함된 것으로 보입니다."
    );
  }

  if (
    text.includes("데이터 소유권") ||
    text.includes("센서 소유권")
  ) {
    nextValues.dataOwnership = "company";
    pushEvidence(
      "데이터 소유권",
      "센서 데이터나 운영 데이터의 소유권이 업체 측에 귀속되는 표현이 감지되었습니다."
    );
  }

  return nextValues;
}