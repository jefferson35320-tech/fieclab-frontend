import React, { useEffect, useState } from 'react';
import { productService, authService } from './services';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.findAll({ page: 0, size: 10 });
        setProducts(data.content || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (authService.isAuthenticated()) {
      loadProducts();
    }
  }, []);

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name} - R$ {product.price}</li>
      ))}
    </ul>
  );
}