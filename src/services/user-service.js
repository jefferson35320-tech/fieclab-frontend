import api from './api';

export const userService = {
  /**
   * Lista todos os usuários
   */
  async findAll() {
    const response = await api.get('/users/findAll');
    return response.data;
  },

  /**
   * Busca usuário por ID via parâmetro de query
   * @param {string} id - UUID do usuário
   */
  async findById(id) {
    const response = await api.get(`/users/find/${id}`, {
      params: { id }
    });
    return response.data;
  },

  /**
   * Cria um usuário
   * @param {Object} userData - { email, name, password }
   */
  async createUser(userData) {
    const response = await api.post('/users/UserCreate', userData);
    return response.data;
  },

  /**
   * Atualiza informações do usuário
   * @param {string} id - UUID do usuário
   * @param {string} token - Token de validação de parâmetro
   * @param {Object} userData - Objeto contendo UserDTO
   */
  async update(id, token, userData) {
    const response = await api.put(`/users/update/${id}`, userData, {
      params: { id, token }
    });
    return response.data;
  },

  /**
   * Define/atualiza token do usuário
   * @param {Object} tokenData - { token }
   */
  async setToken(tokenData) {
    const response = await api.post('/users/token', tokenData);
    return response.data;
  },

  /**
   * Remove um usuário pelo ID
   * @param {string} id - UUID do usuário
   */
  async deleteUser(id) {
    const response = await api.delete(`/users/delete/${id}`, {
      params: { id }
    });
    return response.data;
  }
};