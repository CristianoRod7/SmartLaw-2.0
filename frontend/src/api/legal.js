import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/legal`,
});

export const legalApi = {
  getNews: (query) => api.get(`/news?query=${query || ''}`)
};