import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/analyze`,
});

function getIndustryFromDocumentType(documentType) {
  if (
    documentType === "스마트팜 구축 계약" ||
    documentType === "농지 임대차 계약" ||
    documentType === "보조금 관련 문서" ||
    documentType === "스마트팜 종합 분석"
  ) {
    return "smartfarm";
  }

  if (documentType?.includes("부동산")) return "real_estate";
  if (documentType?.includes("프리랜서")) return "freelancer";

  return "smartfarm";
}

export const analyzeApi = {
  uploadContract: (file, documentType = "스마트팜 구축 계약") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("industry", getIndustryFromDocumentType(documentType));
    formData.append("document_type", documentType);

    return api.post("/contract", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  simulateSmartfarm: (file, payload) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contract_type", payload.contract_type);
    formData.append("land_type", payload.land_type);
    formData.append("subsidy", payload.subsidy);
    formData.append("investment", payload.investment);
    formData.append("outsourcing", payload.outsourcing);
    formData.append("operator", payload.operator);

    return api.post("/simulate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};