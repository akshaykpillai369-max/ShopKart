import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProduct } from "../context/productContext";
import { useTheme } from "../context/ThemeContext";
import SearchBar from "./Search";
import { useLogin } from "../context/AuthContext";

export default function Navbar() {

  const { cart } = useCart();
  const { handleSearch } = useProduct();
  const { theme, toggleTheme } = useTheme();
  const { user } = useLogin();

  return (
    <nav
      className="
        bg-white dark:bg-gray-900
        border-b border-gray-100 dark:border-gray-800
        shadow-sm
        w-full
        mb-6
      "
    >

      <div
        className="
          max-w-7xl mx-auto
          px-4 py-3
          flex items-center gap-5
        "
      >

        {/* Logo + Brand */}

        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
        >

          {/* Blue Logo */}

          <div
            className="
              w-9 h-9
              rounded-xl
              bg-blue-600
              flex items-center justify-center
              text-white
              font-bold
              text-lg
              shadow-sm
            "
          >
            S
          </div>

          {/* Brand Name */}

          <span
            className="
              text-lg
              font-bold
              tracking-tight
              text-gray-900 dark:text-white
            "
          >
            ShopKart
          </span>

        </Link>


        {/* Search */}

        <div className="flex-1 max-w-2xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>


        {/* Right Side */}

        <div className="flex items-center gap-3 shrink-0">

          {/* Login */}

          {user ? (
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
         {user}
    </span>
) : (
    <Link
        to="/login"
        className="
            px-4 py-2
            rounded-lg
            text-sm font-medium
            text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition
        "
    >
        Login
    </Link>
)}


          {/* Cart */}

          <Link
            to="/cart"
            className="
              relative
              w-10 h-10
              rounded-full
              flex items-center justify-center
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-100
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition
            "
            title="Cart"
          >

            <span className="text-xl">
              🛒
            </span>


            {/* Cart Badge */}

            {cart.length > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-5 h-5
                  px-1
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                  flex items-center justify-center
                  border-2
                  border-white dark:border-gray-900
                "
              >
                {cart.length}
              </span>
            )}

          </Link>


          {/* Theme Toggle */}

          <button
            onClick={toggleTheme}
            className="
              w-10 h-10
              rounded-full
              flex items-center justify-center
              bg-gray-100 dark:bg-gray-800
              text-gray-800 dark:text-gray-100
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition
            "
            title="Change theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

        </div>

      </div>

    </nav>
  );
}