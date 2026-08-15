import ProductDetail from "./components/ProductDetail"
import ProductList from "./components/ProductsList"
import { Routes, Route } from 'react-router-dom'

export default function App() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My E-Commerce Store</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:slug" element = {<ProductDetail />} />
        </Routes>
      </main>
    </div>
  )

}

