import { useCart } from '../context/CartContext';

export default function Navbar() {
  // Open the portal and pull out the cart array
  const { cart } = useCart()

  return (
    <nav className="bg-white shadow-sm p-4 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">My Store</h1>
        <div className="bg-gray-100 px-3 py-1 rounded-full font-medium">
          🛒 Cart: <span className="text-blue-600 font-bold">{cart.length}</span>
        </div>
      </div>
    </nav>
  );
}