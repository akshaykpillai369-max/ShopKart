import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductsList";
import { Routes, Route } from "react-router-dom";
import CartProvider from "./context/CartContext";
import { ProductProvider } from "./context/productContext";
import SignUpForm from "./components/signup";
import StoreLayout from "./layouts/StoreLayouts";
import ThemeProvider from "./context/ThemeContext";
import LoginForm from "./components/login";
import Cart from "./components/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"

export default function App() {
  return (
    
    <ThemeProvider>
      <CartProvider>
        <ProductProvider>

          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">

            <Routes>

              {/* Store pages */}
              <Route element={<StoreLayout />}>

                <Route path="/" element={<ProductList />}
                />

                <Route path="/product/:slug" element={<ProductDetail />}
                />

              </Route>

              
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/cart" element= {<Cart/> } />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              <Route path="/account" element={
                <ProtectedRoute>
                    <Account />
                </ProtectedRoute>
    }
/>
 

            </Routes>

          </div>

        </ProductProvider>
      </CartProvider>
    </ThemeProvider>
  );
}