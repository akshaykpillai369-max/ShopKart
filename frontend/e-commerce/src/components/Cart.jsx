import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function Cart() {
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
    } = useCart()

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.discounted_price * item.quantity,
        0
    )

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">

                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="w-7 h-7 text-gray-500 dark:text-gray-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 4.5h2l1.65 9.2a2 2 0 0 0 1.97 1.65h7.86a2 2 0 0 0 1.94-1.52L20.5 8H7"
                            />
                            <circle cx="10" cy="19" r="1.25" />
                            <circle cx="17" cy="19" r="1.25" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Your cart is empty
                    </h1>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Looks like you haven't added anything yet.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">

                        <Link
                            to="/"
                            className="
                                px-6 py-2.5
                                rounded-lg
                                bg-black dark:bg-white
                                text-white dark:text-black
                                text-sm font-medium
                                hover:opacity-80
                                transition
                                text-center
                            "
                        >
                            Continue Shopping
                        </Link>

                        <Link
                            to="/orders"
                            className="
                                px-6 py-2.5
                                rounded-lg
                                border border-gray-200 dark:border-gray-700
                                text-gray-700 dark:text-gray-200
                                text-sm font-medium
                                hover:bg-gray-50 dark:hover:bg-gray-800
                                transition
                                text-center
                            "
                        >
                            View Orders
                        </Link>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:px-8">

            {/* Heading */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Your Cart
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cart.length}{" "}
                    {cart.length === 1 ? "item" : "items"} in your cart
                </p>
            </div>


            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">

                    {cart.map((item) => {

                        const reachedStockLimit =
                            item.quantity >= item.stock

                        const remainingStock =
                            item.stock - item.quantity

                        return (
                            <div
                                key={item.id}
                                className="
                                    bg-white dark:bg-gray-800
                                    border border-gray-200 dark:border-gray-700
                                    rounded-xl
                                    p-4 sm:p-5
                                    shadow-sm
                                "
                            >

                                {/* Product */}
                                <div className="flex gap-3 sm:gap-4">

                                    {/* Product Image */}
                                    <div
                                        className="
                                            w-20 h-20
                                            sm:w-28 sm:h-28
                                            shrink-0
                                            rounded-lg
                                            bg-gray-50
                                            flex items-center justify-center
                                            overflow-hidden
                                        "
                                    >
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="
                                                    max-w-full
                                                    max-h-20
                                                    sm:max-h-24
                                                    w-auto
                                                    object-contain
                                                "
                                            />
                                        )}
                                    </div>


                                    {/* Product Information */}
                                    <div className="flex-1 min-w-0">

                                        {/* Product Name */}
                                        <Link
                                            to={`/product/${item.slug}`}
                                            className="
                                                block
                                                pr-1
                                                text-sm sm:text-base
                                                font-medium
                                                leading-snug
                                                text-gray-900 dark:text-white
                                                hover:text-blue-600
                                                dark:hover:text-blue-400
                                                transition-colors
                                                break-words
                                            "
                                        >
                                            {item.name}
                                        </Link>


                                        {/* Remove */}
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="
                                                mt-2
                                                text-xs
                                                font-medium
                                                text-gray-400
                                                dark:text-gray-500
                                                hover:text-red-500
                                                dark:hover:text-red-400
                                                transition-colors
                                            "
                                        >
                                            Remove
                                        </button>


                                        {/* Price */}
                                        <p className="text-base font-semibold text-gray-900 dark:text-white mt-3">
                                            ₹{item.discounted_price}
                                        </p>


                                        {/* Quantity */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4">

                                            <div
                                                className="
                                                    flex items-center
                                                    border border-gray-200
                                                    dark:border-gray-600
                                                    rounded-lg
                                                    overflow-hidden
                                                    shrink-0
                                                "
                                            >

                                                <button
                                                    onClick={() =>
                                                        decreaseQuantity(item.id)
                                                    }
                                                    className="
                                                        w-9 h-9
                                                        flex items-center justify-center
                                                        text-gray-600
                                                        dark:text-gray-300
                                                        hover:bg-gray-100
                                                        dark:hover:bg-gray-700
                                                        transition-colors
                                                    "
                                                >
                                                    −
                                                </button>

                                                <span
                                                    className="
                                                        w-10
                                                        text-center
                                                        text-sm font-medium
                                                        text-gray-900
                                                        dark:text-white
                                                    "
                                                >
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        increaseQuantity(item.id)
                                                    }
                                                    disabled={reachedStockLimit}
                                                    className="
                                                        w-9 h-9
                                                        flex items-center justify-center
                                                        text-gray-600
                                                        dark:text-gray-300
                                                        hover:bg-gray-100
                                                        dark:hover:bg-gray-700
                                                        disabled:opacity-30
                                                        disabled:cursor-not-allowed
                                                        disabled:hover:bg-transparent
                                                        dark:disabled:hover:bg-transparent
                                                        transition-colors
                                                    "
                                                >
                                                    +
                                                </button>

                                            </div>


                                            {/* Stock information */}
                                            {reachedStockLimit ? (
                                                <span
                                                    className="
                                                        text-xs
                                                        text-orange-600
                                                        dark:text-orange-400
                                                    "
                                                >
                                                    Maximum available
                                                </span>
                                            ) : item.stock <= 5 ? (
                                                <span
                                                    className="
                                                        text-xs
                                                        text-gray-500
                                                        dark:text-gray-400
                                                    "
                                                >
                                                    {remainingStock} left
                                                </span>
                                            ) : null}

                                        </div>

                                    </div>

                                </div>


                                {/* Item Total */}
                                <div
                                    className="
                                        mt-4
                                        pt-4
                                        border-t border-gray-100
                                        dark:border-gray-700
                                        flex justify-between items-center
                                    "
                                >
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Item total
                                    </span>

                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        ₹{item.discounted_price * item.quantity}
                                    </span>
                                </div>

                            </div>
                        )
                    })}

                </div>


                {/* Order Summary */}
                <div className="lg:col-span-1">

                    <div
                        className="
                            bg-white dark:bg-gray-800
                            border border-gray-200 dark:border-gray-700
                            rounded-xl
                            p-5
                            shadow-sm
                            lg:sticky lg:top-24
                        "
                    >

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Order Summary
                        </h2>


                        <div className="mt-6 space-y-4">

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Subtotal
                                </span>

                                <span className="font-medium text-gray-900 dark:text-white">
                                    ₹{subtotal}
                                </span>
                            </div>


                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Shipping
                                </span>

                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                    Free
                                </span>
                            </div>


                            <div
                                className="
                                    border-t border-gray-200
                                    dark:border-gray-700
                                    pt-4
                                    flex justify-between
                                "
                            >
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    ₹{subtotal}
                                </span>
                            </div>


                            <Link
                                to="/checkout"
                                className="
                                    w-full
                                    mt-3
                                    py-3
                                    rounded-lg
                                    bg-black dark:bg-white
                                    text-white dark:text-black
                                    text-sm font-medium
                                    hover:opacity-80
                                    transition
                                    block
                                    text-center
                                "
                            >
                                Proceed to Checkout
                            </Link>


                            <Link
                                to="/orders"
                                className="
                                    w-full
                                    mt-3
                                    py-3
                                    rounded-lg
                                    border border-gray-200
                                    dark:border-gray-700
                                    text-gray-700
                                    dark:text-gray-200
                                    text-sm font-medium
                                    hover:bg-gray-50
                                    dark:hover:bg-gray-700
                                    transition
                                    block
                                    text-center
                                "
                            >
                                View My Orders
                            </Link>


                            <Link
                                to="/"
                                className="
                                    block
                                    text-center
                                    text-sm
                                    text-gray-500
                                    dark:text-gray-400
                                    hover:text-gray-900
                                    dark:hover:text-white
                                    mt-3
                                "
                            >
                                Continue Shopping
                            </Link>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}