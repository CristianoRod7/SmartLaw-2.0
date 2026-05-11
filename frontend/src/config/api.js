const normalizeApiBaseUrl = (value) => {
  const normalized = String(value || "").trim().replace(/\/$/, "");

  if (!normalized || normalized === "undefined" || normalized === "null") {
    return "";
  }

  return normalized;
};

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const apiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
