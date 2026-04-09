import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/legal',
});

export const legalApi = {
  getNews: (query) => api.get(`/news?query=${query || ''}`)
};