import ProductDetail from "./components/ProductDetail"
import ProductList from "./components/ProductsList"
import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/NavBar";
import CartProvider from './context/CartContext';
import { ProductProvider } from "./context/productContext";


export default function App() {
  return (
    <CartProvider>
      <ProductProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
          </Routes>
        </main>
      </div>
      </ProductProvider>
    </CartProvider>
  )
}