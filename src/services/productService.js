import api from "../config/api";

const BASE_URL = "/api/products";

import api from './api';

export const productService = {
  /**
   * Lista produtos com paginação
   * @param {Object} params - { page, size, sort }
   */
  async findAll(params = {}) {
    const response = await api.get('/api/products', { params });
    return response.data;
  },

  /**
   * Cria um novo produto
   * @param {Object} productData - Objeto contendo os dados do ProductDTO
   */
  async create(productData) {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  /**
   * Busca um produto pelo ID (UUID)
   * @param {string} id - UUID do produto
   */
  async findById(id) {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  /**
   * Atualiza um produto existente
   * @param {string} id - UUID do produto
   * @param {Object} productData - Objeto contendo os novos dados do produto
   */
  async update(id, productData) {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  /**
   * Remove um produto pelo ID
   * @param {string} id - UUID do produto
   */
  async delete(id) {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  /**
   * Busca dinâmica de produtos com filtros e paginação
   * @param {Object} filters - { name, type, minPrice, maxPrice, expDateBefore, page, size, sort }
   */
  async searchDynamic(filters = {}) {
    const response = await api.get('/api/products/search', { params: filters });
    return response.data;
  }
};