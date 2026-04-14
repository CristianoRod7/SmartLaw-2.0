export const riskRules = {
  debtRatio: [
    { max: 30, score: 5, label: "낮음" },
    { max: 60, score: 15, label: "중간" },
    { max: 100, score: 30, label: "높음" },
  ],

  interestRate: [
    { max: 3, score: 5, label: "낮음" },
    { max: 6, score: 15, label: "중간" },
    { max: 100, score: 25, label: "높음" },
  ],

  subsidyRisk: {
    none: 0,
    low: 10,
    medium: 20,
    high: 30,
  },

  contractRisk: {
    none: 0,
    low: 10,
    medium: 20,
    high: 30,
  },

  maintenanceRisk: {
    company: 5,
    shared: 15,
    user: 25,
  },

  cropRisk: {
    딸기: 12,
    토마토: 10,
    파프리카: 14,
    엽채류: 8,
    화훼: 16,
    버섯: 18,
    기타: 10,
  },

  facilityRisk: {
    비닐하우스: 8,
    유리온실: 16,
    수직농장: 22,
    기타: 10,
  },
};