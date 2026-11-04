import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import { HomePage } from "./pages/home/HomePage";
import {CreateProductPage} from "./pages/create-product/CreateProductPage";
import ProductDetailPage from "./pages/product-datail/ProductDetailPage";
import { OAuthRedirectPage } from "./OAuthRedirectPage";

function App() {
    return (
      <div>
        <Router>
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/oauth2/redirect" element={<OAuthRedirectPage />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
