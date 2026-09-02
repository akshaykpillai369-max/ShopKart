import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useProduct } from "../context/productContext"
import { useTheme } from "../context/ThemeContext"
import SearchBar from "./Search"
import { useLogin } from "../context/AuthContext"

export default function Navbar() {
    const { cart } = useCart()
    const { handleSearch } = useProduct()
    const { theme, toggleTheme } = useTheme()
    const { isLoggedIn, logout, authLoading } = useLogin()

    const [accountOpen, setAccountOpen] = useState(false)

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm w-full mb-6">

            <div className="max-w-7xl mx-auto px-4 py-3 md:px-6">

                {/* Main Row */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2.5 shrink-0 group"
                    >
                        <div
                            className="
                                w-9 h-9
                                rounded-lg
                                bg-blue-600
                                group-hover:bg-blue-700
                                flex items-center justify-center
                                text-white
                                font-bold
                                text-lg
                                transition-colors
                            "
                        >
                            S
                        </div>

                        <span
                            className="
                                hidden sm:block
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
                    <div className="flex-1 min-w-0">
                        <SearchBar onSearch={handleSearch} />
                    </div>


                    {/* Right Side */}
                    <div className="flex items-center gap-1.5 md:gap-2 shrink-0">


                        {/* Account / Login */}
                        {authLoading ? null : isLoggedIn ? (

                            <div className="relative">

                                <button
                                    onClick={() => setAccountOpen(!accountOpen)}
                                    className="
                                        w-10 h-10
                                        rounded-lg
                                        flex items-center justify-center
                                        bg-gray-100 dark:bg-gray-800
                                        text-gray-700 dark:text-gray-200
                                        hover:bg-gray-200 dark:hover:bg-gray-700
                                        transition-colors
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-gray-300
                                        dark:focus:ring-gray-600
                                    "
                                    title="Account"
                                    aria-label="Account"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                        />
                                    </svg>
                                </button>


                                {/* Account Dropdown */}
                                {accountOpen && (

                                    <div
                                        className="
                                            absolute
                                            right-0
                                            top-12
                                            w-56
                                            bg-white dark:bg-gray-800
                                            rounded-xl
                                            shadow-xl
                                            border
                                            border-gray-200 dark:border-gray-700
                                            py-2
                                            z-50
                                            overflow-hidden
                                        "
                                    >

                                        {/* Account Header */}
                                        <div className="
                                            px-4 py-3
                                            border-b
                                            border-gray-100 dark:border-gray-700
                                        ">
                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-900 dark:text-white
                                            ">
                                                My Account
                                            </p>

                                            <p className="
                                                mt-0.5
                                                text-xs
                                                text-gray-500 dark:text-gray-400
                                            ">
                                                Manage your account
                                            </p>
                                        </div>


                                        {/* My Profile */}
                                        <Link
                                            to="/account"
                                            onClick={() => setAccountOpen(false)}
                                            className="
                                                flex items-center gap-3
                                                px-4 py-3
                                                text-sm
                                                text-gray-700 dark:text-gray-200
                                                hover:bg-gray-50 dark:hover:bg-gray-700
                                                transition-colors
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="w-4 h-4 shrink-0"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
                                                />
                                            </svg>

                                            My Profile
                                        </Link>


                                        {/* My Orders */}
                                        <Link
                                            to="/orders"
                                            onClick={() => setAccountOpen(false)}
                                            className="
                                                flex items-center gap-3
                                                px-4 py-3
                                                text-sm
                                                text-gray-700 dark:text-gray-200
                                                hover:bg-gray-50 dark:hover:bg-gray-700
                                                transition-colors
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="w-4 h-4 shrink-0"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.75 6.75h16.5v12.5H3.75z"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M7.5 6.75V5.5A1.75 1.75 0 0 1 9.25 3.75h5.5A1.75 1.75 0 0 1 16.5 5.5v1.25"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 11.5h8M8 15h5"
                                                />
                                            </svg>

                                            My Orders
                                        </Link>


                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                logout()
                                                setAccountOpen(false)
                                            }}
                                            className="
                                                w-full
                                                flex items-center gap-3
                                                text-left
                                                px-4 py-3
                                                text-sm
                                                text-red-600 dark:text-red-400
                                                hover:bg-red-50 dark:hover:bg-red-900/20
                                                transition-colors
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="w-4 h-4 shrink-0"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9.75 4.5H5.5a1.75 1.75 0 0 0-1.75 1.75v11.5A1.75 1.75 0 0 0 5.5 19.5h4.25"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m14.25 8.25 3.75 3.75-3.75 3.75M18 12H9"
                                                />
                                            </svg>

                                            Logout
                                        </button>

                                    </div>

                                )}

                            </div>

                        ) : (

                            /* Login */
                            <Link
                                to="/login"
                                className="
                                    px-3.5 md:px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-medium
                                    text-gray-700 dark:text-gray-200
                                    hover:bg-gray-100 dark:hover:bg-gray-800
                                    transition-colors
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
                                rounded-lg
                                flex items-center justify-center
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-200
                                hover:bg-gray-200 dark:hover:bg-gray-700
                                transition-colors
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-300
                                dark:focus:ring-gray-600
                            "
                            title="Cart"
                            aria-label="Cart"
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 4.5h2l1.65 9.2a2 2 0 0 0 1.97 1.65h7.86a2 2 0 0 0 1.94-1.52L20.5 8H7"
                                />

                                <circle cx="10" cy="19" r="1.25" />
                                <circle cx="17" cy="19" r="1.25" />
                            </svg>


                            {/* Cart Badge */}
                            {cart.length > 0 && (

                                <span
                                    className="
                                        absolute
                                        -top-1.5
                                        -right-1.5
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
                                rounded-lg
                                flex items-center justify-center
                                bg-gray-100 dark:bg-gray-800
                                text-gray-700 dark:text-gray-200
                                hover:bg-gray-200 dark:hover:bg-gray-700
                                transition-colors
                                focus:outline-none
                                focus:ring-2
                                focus:ring-gray-300
                                dark:focus:ring-gray-600
                            "
                            title="Change theme"
                            aria-label="Change theme"
                        >

                            {theme === "dark" ? (

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="w-5 h-5"
                                >
                                    <circle cx="12" cy="12" r="4" />
                                    <path
                                        strokeLinecap="round"
                                        d="M12 2.5v1.5M12 20v1.5M4.58 4.58l1.06 1.06M18.36 18.36l1.06 1.06M2.5 12H4M20 12h1.5M4.58 19.42l1.06-1.06M18.36 5.64l1.06-1.06"
                                    />
                                </svg>

                            ) : (

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20.5 15.25A8.5 8.5 0 0 1 8.75 3.5 8.5 8.5 0 1 0 20.5 15.25Z"
                                    />
                                </svg>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </nav>
    )
}

