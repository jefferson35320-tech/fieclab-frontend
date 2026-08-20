import { useState } from "react";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartSidebar from "./components/CartSidebar";
import OrderConfirmationPopup from "./components/OrderConfirmationPopup";
import WhatsAppButton from "./components/WhatsAppButton";

import products from "./data/products";
import { createOrder } from "./data/orders";

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

      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-10 sm:px-14">
        <h1 className="m-0 mb-1.5 font-display text-2xl font-bold text-primary-dark sm:text-[32px]">
          Nossos produtos
        </h1>
        <p className="m-0 mb-8 text-[15px] text-muted">
          Escolha o tamanho e o aroma antes de adicionar ao carrinho.
        </p>

        <div
          className="mb-7 flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Categorias de produtos"
        >
          <button
            type="button"
            className={`rounded-full border border-transparent px-[18px] py-2.5 font-body text-[13px] font-semibold transition ${
              selectedCategory === "Todos"
                ? "bg-primary text-white"
                : "bg-primary-light text-primary-dark hover:bg-line"
            }`}
            onClick={() => setSelectedCategory("Todos")}
          >
            Todos
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`rounded-full border border-transparent px-[18px] py-2.5 font-body text-[13px] font-semibold transition ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-primary-light text-primary-dark hover:bg-line"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Nenhum produto nesta categoria no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 cols-2:grid-cols-2 cols-3:grid-cols-3 cols-4:grid-cols-4">
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

      <WhatsAppButton />
    </div>
  );
}

export default App;
