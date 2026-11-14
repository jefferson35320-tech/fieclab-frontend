import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "./pages/home/HomePage";
import { CreateProductPage } from "./pages/create-product/CreateProductPage";
import ProductDetailPage from "./pages/product-datail/ProductDetailPage";
import { OAuthRedirectPage } from "./OAuthRedirectPage";
import { LoginPage } from "./pages/login/LoginPage";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
