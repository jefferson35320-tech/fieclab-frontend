import { useState } from "react";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartSidebar from "./components/CartSidebar";
import OrderConfirmationPopup from "./components/OrderConfirmationPopup";

import products from "./data/products";
import { createOrder } from "./data/orders";

import "./App.css";

const CATEGORIES = ["Higiene", "Limpeza", "Cama, Mesa e Banho"];

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [ratingOverrides, setRatingOverrides] = useState({});

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // atualiza a média de avaliação do produto com a nova nota do usuário
  function handleRate(productId, value) {
    setRatingOverrides((prev) => {
      const product = products.find((p) => p.id === productId);
      const current = prev[productId] || {
        rating: product.rating,
        count: product.ratingCount,
      };

      const newCount = current.count + 1;
      const newRating =
        (current.rating * current.count + value) / newCount;

      return {
        ...prev,
        [productId]: { rating: newRating, count: newCount },
      };
    });
  }

  // adiciona um item (produto + tamanho + aroma já escolhidos no card);
  // se o mesmo item (mesmo produto/tamanho/aroma) já existir, só soma a quantidade
  function addToCart(item) {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (cartItem) => cartItem.cartItemId === item.cartItemId
      );

      if (existing) {
        return prevCart.map((cartItem) =>
          cartItem.cartItemId === item.cartItemId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...prevCart, item];
    });

    setOrder(null);
    setIsConfirmationPopupOpen(false);
    setIsCartOpen(true);
  }

  function increaseQuantity(cartItemId) {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.cartItemId === cartItemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  }

  function decreaseQuantity(cartItemId) {
    setCart((prevCart) =>
      prevCart
        .map((cartItem) =>
          cartItem.cartItemId === cartItemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  }

  function removeFromCart(cartItemId) {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.cartItemId !== cartItemId)
    );
  }

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function finalizeOrder() {
    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = createOrder(cart, total);

    setOrder(newOrder);
    setCart([]);
    setIsConfirmationPopupOpen(true);
  }

  function startNewOrder() {
    setOrder(null);
    setIsCartOpen(false);
    setIsConfirmationPopupOpen(false);
  }

  return (
    <div>
      <Header cartCount={cart.length} toggleCart={toggleCart} />

      <div className="page">
        <h1 className="page-title">Nossos produtos</h1>
        <p className="page-subtitle">
          Escolha o tamanho e o aroma antes de adicionar ao carrinho.
        </p>

        <div className="category-tabs" role="tablist" aria-label="Categorias de produtos">
          <button
            type="button"
            className={`category-tab ${selectedCategory === "Todos" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Todos")}
          >
            Todos
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-tab ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="empty-category-message">
            Nenhum produto nesta categoria no momento.
          </p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={setSelectedProduct}
                ratingOverride={ratingOverrides[product.id]}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
          ratingOverride={ratingOverrides[selectedProduct.id]}
          onRate={handleRate}
        />
      )}

      {order && isConfirmationPopupOpen && (
        <OrderConfirmationPopup
          order={order}
          onClose={() => setIsConfirmationPopupOpen(false)}
        />
      )}

      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        toggleCart={toggleCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        removeFromCart={removeFromCart}
        finalizeOrder={finalizeOrder}
        order={order}
        startNewOrder={startNewOrder}
      />
    </div>
  );
}

export default App;
