import axios from "axios";
/*
// instância única do axios: todas as chamadas ao backend passam por aqui
const api = axios.create({
  // endereço do backend; pode ser trocado pela variável REACT_APP_API_URL (arquivo .env)
  baseURL: (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(
    /\/$/,
    ""
  ),
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// se existir um token de login salvo, manda no cabeçalho
// (hoje o backend exige token para acessar /api/products)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("fieclab-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
  }
  return config;
});

export default api;
*/

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o Token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para tratar respostas e erros de autorização (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Opcional: Limpar token e redirecionar se expirado/inválido
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;