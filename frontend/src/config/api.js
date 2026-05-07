const LOCAL_API_BASE_URL = "http://localhost:8000";

const normalizeApiBaseUrl = (value) => {
  const normalized = String(value || "").trim().replace(/\/$/, "");

  if (!normalized || normalized === "undefined" || normalized === "null") {
    return LOCAL_API_BASE_URL;
  }

  return normalized;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
