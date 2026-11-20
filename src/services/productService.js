import api from "../config/api";

const BASE_URL = "/api/products";

export const productService = {
  /**
   * Lista produtos com paginação
   * @param {Object} params - { page, size, sort }
   */
  async findAll(params = {}) {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  /**
   * Cria um novo produto
   * @param {Object} productData - Objeto contendo os dados do ProductDTO
   */
  async create(productData) {
    const response = await api.post(BASE_URL, productData);
    return response.data;
  },

  /**
   * Busca um produto pelo ID (UUID)
   * @param {string} id - UUID do produto
   */
  async findById(id) {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Atualiza um produto existente
   * @param {string} id - UUID do produto
   * @param {Object} productData - Objeto contendo os novos dados do produto
   */
  async update(id, productData) {
    const response = await api.put(`${BASE_URL}/${id}`, productData);
    return response.data;
  },

  /**
   * Remove um produto pelo ID
   * @param {string} id - UUID do produto
   */
  async delete(id) {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Busca dinâmica de produtos com filtros e paginação
   * @param {Object} filters - { name, type, minPrice, maxPrice, expDateBefore, page, size, sort }
   */
  async searchDynamic(filters = {}) {
    const response = await api.get(`${BASE_URL}/search`, { params: filters });
    return response.data;
  },

  /**
   * Envia a foto do produto (multipart, campo "file")
   * @param {string} id - id do produto
   * @param {File} file - arquivo de imagem
   */
  async uploadImage(id, file) {
    const body = new FormData();
    body.append('file', file);
    const response = await api.post(`${BASE_URL}/${id}/image`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Retorna a URL direta da imagem do produto (use quando o GET for público)
   * @param {string} id - UUID do produto
   */
  getImageUrl(id) {
    if (!id) return '';
    const host = api.defaults.baseURL || '';
    return `${host}${BASE_URL}/${id}/image`;
  },

  /**
   * Busca a imagem via Axios (com interceptor JWT) e gera uma URL temporária
   * @param {string} id - UUID do produto
   */
  async getImage(id) {
    const response = await api.get(`${BASE_URL}/${id}/image`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },

  // nomes usados pela ProductDetailPage
  getProductById(id) {
    return productService.findById(id);
  },
  updateProduct(id, productData) {
    return productService.update(id, productData);
  },
  deleteProduct(id) {
    return productService.delete(id);
  },
};