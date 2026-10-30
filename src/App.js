import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import CartSidebar from "./components/CartSidebar";
import OrderConfirmationPopup from "./components/OrderConfirmationPopup";
import WhatsAppButton from "./components/WhatsAppButton";
import { Search, X } from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";

import AdminLoginModal from "./components/AdminLoginModal";
import AdminPanel from "./components/AdminPanel";
import { auth } from "./firebase.config";

import SplashScreen from "./components/SplashScreen";
import WelcomeScreen from "./components/WelcomeScreen";


import products from "./data/products";
import { createOrder } from "./data/orders";
import { fetchStock, updateStock } from "./services/stockService";

const CATEGORIES = ["Higiene", "Limpeza", "Cama, Mesa e Banho"];

// categorias disponíveis no painel admin (inclui as já usadas pelos produtos)
const ADMIN_CATEGORIES = [
  ...new Set([...CATEGORIES, ...products.map((product) => product.category)]),
];

function App() {
  const [stage, setStage] = useState("splash");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [ratingOverrides, setRatingOverrides] = useState({});
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  // lista de produtos em estado: permite que o admin edite o catálogo
  // (por enquanto só em memória — volta ao original ao recarregar a página)
  const [productList, setProductList] = useState(products);

  // mantém o estado de login do admin sincronizado com o Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setAdminUser(user));
    return unsubscribe;
  }, []);

  // ao sair da conta admin, fecha o painel
  useEffect(() => {
    if (!adminUser) setIsAdminPanelOpen(false);
  }, [adminUser]);

  // carrega o estoque pelo serviço (ponto de integração com o backend)
  useEffect(() => {
    let cancelled = false;

    fetchStock(products)
      .then((stockMap) => {
        if (cancelled) return;
        setProductList((prev) =>
          prev.map((product) =>
            stockMap[product.id] !== undefined
              ? { ...product, stock: stockMap[product.id] }
              : product
          )
        );
      })
      .catch((err) => console.error("Não foi possível carregar o estoque:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  // atualiza campos de um produto (tudo, exceto estoque, vive só no front por enquanto)
  function handleSaveProduct(productId, fields) {
    setProductList((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...fields } : product
      )
    );
  }

  // grava o estoque via serviço; só atualiza a tela se o "backend" aceitar
  async function handleSaveStock(productId, stock) {
    await updateStock(productId, stock);
    handleSaveProduct(productId, { stock });
  }

  const filteredProducts =
    selectedCategory === "Todos"
      ? productList
      : productList.filter((product) => product.category === selectedCategory);

  const byCategory = 
    selectedCategory === "Todos" 
    ? products
    : products.filter((p)=>p.category === selectedCategory);

  const filteredProducts = byCategory.filter((p) => normalize(p.name).includes(normalize(searchTerm)));
  //Adicao para funcionar
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

  if (stage === "splash") {
    return <SplashScreen onFinish={() => setStage("welcome")} />;
  }

  if (stage === "welcome") {
    return <WelcomeScreen onContinue={() => setStage("catalog")} />;
  }


  return (
    <div>
      <Header
        cartCount={cart.length}
        toggleCart={toggleCart}
        adminUser={adminUser}
        onAdminClick={() => setIsAdminModalOpen(true)}
        onPanelClick={() => setIsAdminPanelOpen(true)}
      />

      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-10 sm:px-14">
        <h1 className="m-0 mb-1.5 font-display text-2xl font-bold text-primary-dark sm:text-[32px]">
          Nossos produtos
        </h1>
        <p className="m-0 mb-8 text-[15px] text-muted">
          Escolha o tamanho e o aroma antes de adicionar ao carrinho.
        </p>

        <div className="relative mb-7 max-w-md">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={2}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full rounded-full border border-line bg-white py-2.5 pl-10 pr-10 font-body text-[14px] text-primary-dark outline-none transition focus:border-primary"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary-dark"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

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

      {isAdminModalOpen && (
        <AdminLoginModal
          adminUser={adminUser}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {adminUser && (
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          products={productList}
          categories={ADMIN_CATEGORIES}
          onSaveProduct={handleSaveProduct}
          onSaveStock={handleSaveStock}
        />
      )}

      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
}

export default App;
