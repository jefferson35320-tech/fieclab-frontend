import api from './api';

export const authService = {
  /**
   * Realiza o login do usuário
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/api/v1/auth/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  /**
   * Registra um novo usuário
   * @param {Object} userData - { name, email, password }
   */
  async register(userData) {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  /**
   * Encerra a sessão removendo o token local
   */
  logout() {
    localStorage.removeItem('token');
  },

  /**
   * Retorna o token armazenado
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Verifica se o usuário possui token armazenado
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};