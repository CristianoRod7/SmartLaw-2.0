import axios from "axios";
import { apiUrl } from "../config/api";

const api = axios.create({
  baseURL: apiUrl("/api/v1/legal"),
});

export const legalApi = {
  getNews: (query, days = 180) => api.get("/news", {
    params: {
      query: query || undefined,
      days,
    },
  }),
};
