import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import Header from "../../components/Header";
import ProductCard from "../../components/ProductCard";
import ProductModal from "../../components/ProductModal";
import CartSidebar from "../../components/CartSidebar";
import OrderConfirmationPopup from "../../components/OrderConfirmationPopup";
import WhatsAppButton from "../../components/WhatsAppButton";
import ThemeToggle from "../../components/ThemeToggle";

import AdminLoginModal from "../../components/AdminLoginModal";
import AdminPanel from "../../components/AdminPanel";
import { auth } from "../../firebase.config";

import SplashScreen from "../../components/SplashScreen";
import WelcomeScreen from "../../components/WelcomeScreen";


import { createOrder } from "../../data/orders";
import { mapApiProduct, extractList, CATEGORIAS } from "../../data/productMapper";
import { productService } from "../../services/productService";
import { updateStock } from "../../services/stockService";

// categorias = o enum Categoria do backend
const BASE_CATEGORIES = CATEGORIAS.map((c) => c.label);

// guarda dados da sessão (etapa da tela inicial e carrinho) para não perder
// ao ir para /login e voltar
function readSession(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sem sessionStorage: segue sem guardar
  }
}

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stage, setStage] = useState(() => readSession("fieclab-stage", "splash"));
  const [cart, setCart] = useState(() => readSession("fieclab-cart", []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [ratingOverrides, setRatingOverrides] = useState({});
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  // produtos vindos do backend (banco de dados)
  const [productList, setProductList] = useState([]);
  // "loading" | "ready" | "error"
  const [productsStatus, setProductsStatus] = useState("loading");
  const [productsError, setProductsError] = useState("");

  // lembra a etapa e o carrinho ao navegar para outras páginas
  useEffect(() => {
    writeSession("fieclab-stage", stage);
  }, [stage]);

  useEffect(() => {
    writeSession("fieclab-cart", cart);
  }, [cart]);

  // vindo da página de login pelo link "acesso de administrador"
  useEffect(() => {
    if (location.state && location.state.openAdmin) setIsAdminModalOpen(true);
  }, [location.state]);

  // mantém o estado de login do admin sincronizado com o Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setAdminUser(user));
    return unsubscribe;
  }, []);

  // ao sair da conta admin, fecha o painel
  useEffect(() => {
    if (!adminUser) setIsAdminPanelOpen(false);
  }, [adminUser]);

  // busca os produtos no backend
  function loadProducts() {
    setProductsStatus("loading");
    setProductsError("");

    // size alto para trazer o catálogo todo (o backend devolve paginado)
    return productService
      .findAll({ page: 0, size: 100 })
      .then((data) => {
        setProductList(
          extractList(data)
            .map(mapApiProduct)
            .filter((product) => product.ativo) // produtos desativados não aparecem
        );
        setProductsStatus("ready");
      })
      .catch((err) => {
        console.error("Não foi possível carregar os produtos:", err);
        const status = err.response && err.response.status;
        setProductsError(
          status === 401 || status === 403
            ? "O servidor recusou o acesso aos produtos (401/403)."
            : "Não foi possível conectar ao servidor."
        );
        setProductsStatus("error");
      });
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // abas: as categorias base + qualquer outra que apareça nos produtos
  const categories = [
    ...new Set([...BASE_CATEGORIES, ...productList.map((p) => p.category)]),
  ];

  const filteredProducts =
    selectedCategory === "Todos"
      ? productList
      : productList.filter((product) => product.category === selectedCategory);

  // atualiza a média de avaliação do produto com a nova nota do usuário
  function handleRate(productId, value) {
    setRatingOverrides((prev) => {
      const product = productList.find((p) => p.id === productId);
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
        onAdminClick={() =>
          adminUser ? setIsAdminModalOpen(true) : navigate("/login")
        }
        onPanelClick={() => setIsAdminPanelOpen(true)}
      />

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
          {categories.map((category) => (
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

        {productsStatus === "loading" ? (
          <p className="py-10 text-center text-sm text-muted">
            Carregando produtos...
          </p>
        ) : productsStatus === "error" ? (
          <div className="py-10 text-center text-sm text-muted">
            <p className="m-0 mb-3">{productsError}</p>
            <button
              type="button"
              className="cursor-pointer rounded-full border-0 bg-primary px-5 py-2.5 font-body text-[13px] font-semibold text-white transition hover:bg-primary-dark"
              onClick={loadProducts}
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            {selectedCategory === "Todos"
              ? "Nenhum produto cadastrado ainda."
              : "Nenhum produto nesta categoria no momento."}
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
          categories={categories}
          onSaveProduct={handleSaveProduct}
          onSaveStock={handleSaveStock}
        />
      )}

      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
}

