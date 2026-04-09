import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/analyze",
});

export const analyzeApi = {
  uploadContract: (file, industry, documentType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("industry", industry);
    formData.append("document_type", documentType);

    return api.post("/contract", formData);
  },
  simulateSmartFarm: (formData) => {
    return api.post('/simulate', formData);
  }
};