import axios from "axios";
import { apiUrl } from "../../../config/api";

const api = axios.create({
  baseURL: apiUrl('/api/v1/analyze'),
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

  if (documentType?.includes("농지")) return "smartfarm";
  if (documentType?.includes("부동산") || documentType?.includes("전세") || documentType?.includes("월세")) {
    return "real_estate";
  }
  if (
    documentType?.includes("프리랜서") ||
    documentType?.includes("용역") ||
    documentType?.includes("외주") ||
    documentType?.includes("비밀유지") ||
    documentType?.includes("NDA") ||
    documentType?.includes("유지보수") ||
    documentType?.includes("소프트웨어")
  ) {
    return "it";
  }

  return "general";
}

export const analyzeApi = {
  uploadContract: (file, industry = "general", documentType) => {
    const calledWithDocumentTypeOnly = documentType === undefined && industry !== "general";
    const resolvedDocumentType = calledWithDocumentTypeOnly
      ? industry
      : (documentType || "일반 계약서");
    const resolvedIndustry = calledWithDocumentTypeOnly
      ? getIndustryFromDocumentType(resolvedDocumentType)
      : (industry && industry !== "undefined" ? industry : getIndustryFromDocumentType(resolvedDocumentType));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("industry", resolvedIndustry);
    formData.append("document_type", resolvedDocumentType);

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