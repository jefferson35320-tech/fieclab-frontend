import React, { useState } from 'react';
import { productService } from '../../services/productService';


export const ProductType = {
  CABELO: 'CABELO',
  PELE: 'PELE',
  PERFUME: 'PERFUME'
};


export function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    type: ProductType.CABELO,
    batch: '',
    mfgDate: '',
    expDate: '',
    supplierId: ''
  });


  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('batch', formData.batch);
    data.append('mfgDate', formData.mfgDate);
    data.append('expDate', formData.expDate);
    data.append('supplierId', formData.supplierId);


    if (imageFile) {
      data.append('imageUrl', imageFile);
    }


    await productService.create(formData)


    /*
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data
      });
      if (response.ok) {
        alert('Produto criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
    */
  };


  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Criar Produto</h2>


      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="price" style={{ display: 'block', marginBottom: '5px' }}>Preço:</label>
          <input
            type="number"
            step="0.01"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="type" style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            {Object.values(ProductType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label htmlFor="batch" style={{ display: 'block', marginBottom: '5px' }}>Lote (Batch):</label>
          <input
            type="number"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="mfgDate" style={{ display: 'block', marginBottom: '5px' }}>Data de Fabricação (mfgDate):</label>
          <input
            type="date"
            id="mfgDate"
            name="mfgDate"
            value={formData.mfgDate}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="expDate" style={{ display: 'block', marginBottom: '5px' }}>Data de Validade (expDate):</label>
          <input
            type="date"
            id="expDate"
            name="expDate"
            value={formData.expDate}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="supplierId" style={{ display: 'block', marginBottom: '5px' }}>ID do Fornecedor (supplierId):</label>
          <input
            type="number"
            id="supplierId"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>


        <div>
          <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '5px' }}>Imagem do Produto:</label>
          <input
            type="file"
            id="imageUrl"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />


          {imagePreview && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>Pré-visualização:</p>
              <img
                src={imagePreview}
                alt="Preview do produto"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
          )}
        </div>


        <button
          type="submit"
          style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Salvar Produto
        </button>
      </form>
    </div>
  );
}