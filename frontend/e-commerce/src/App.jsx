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
import MyOrders from "./pages/MyOrders"
import ResetPassword from "./components/ResetPassword"
import ForgotPassword from "./components/ForgotPassword"
import VerifyEmail from "./components/VerifyEmail"
import OrderDetail from "./pages/OrderDetail"
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";

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
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/reset-password/:uid/:token" element={<ResetPassword />}/>
              <Route path="/forgot-password" element={<ForgotPassword />}/>
              <Route path="/verify-email/:uid/:token" element={<VerifyEmail />}/>
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />
              
              
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