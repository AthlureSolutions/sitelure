// packages/frontend/src/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Relative path; proxies to http://localhost:4000/api
});

export default api;
