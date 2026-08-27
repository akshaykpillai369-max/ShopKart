import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {

    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

    const subtotal = cart.reduce(
        (total, item) => total + item.discounted_price * item.quantity,
        0
    );

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">

                <div className="text-6xl mb-5">
                    🛒
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Your cart is empty
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Looks like you haven't added anything yet.
                </p>

                <Link
                    to="/"
                    className="
                        mt-6
                        px-6 py-2.5
                        rounded-lg
                        bg-black dark:bg-white
                        text-white dark:text-black
                        text-sm font-medium
                        hover:opacity-80
                        transition
                    "
                >
                    Continue Shopping
                </Link>

                <Link
                    to="/orders"
                    className="
                        mt-6
                        px-6 py-2.5
                        rounded-lg
                        bg-gray-200 dark:bg-gray-700
                        text-gray-900 dark:text-white
                        text-sm font-medium
                        hover:opacity-80
                        transition
                        block
                        text-center
                    "
                >
                    View My Orders
                </Link>

            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            {/* Heading */}

            <div className="mb-8">

                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Your Cart
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
                </p>

            </div>


            {/* Main Layout */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                {/* Cart Items */}

                <div className="lg:col-span-2 space-y-4">

                    {cart.map((item) => (

                        <div
                            key={item.id}
                            className="
                                bg-white dark:bg-gray-800
                                border border-gray-100 dark:border-gray-700
                                rounded-xl
                                p-4
                                flex gap-4
                                shadow-sm
                            "
                        >

                            {/* Product Image */}

                            <div
                                className="
                                    w-24 h-24
                                    shrink-0
                                    rounded-lg
                                    bg-gray-50 dark:bg-gray-700
                                    flex items-center justify-center
                                    overflow-hidden
                                "
                            >

                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="max-h-20 w-auto object-contain"
                                    />
                                )}

                            </div>


                            {/* Product Information */}

                            <div className="flex-1 min-w-0">

                                <Link
                                    to={`/product/${item.slug}`}
                                    className="
                                        text-sm font-medium
                                        text-gray-900 dark:text-white
                                        hover:underline
                                    "
                                >
                                    {item.name}
                                </Link>

                                <p className="text-sm font-bold text-gray-900 dark:text-white mt-2">
                                    ₹{item.discounted_price}
                                </p>


                                {/* Quantity */}

                                <div className="flex items-center gap-3 mt-4">

                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="
                                            w-8 h-8
                                            rounded-md
                                            border border-gray-200 dark:border-gray-600
                                            text-gray-700 dark:text-gray-200
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                        "
                                    >
                                        −
                                    </button>

                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="
                                            w-8 h-8
                                            rounded-md
                                            border border-gray-200 dark:border-gray-600
                                            text-gray-700 dark:text-gray-200
                                            hover:bg-gray-100 dark:hover:bg-gray-700
                                        "
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            {/* Delete */}

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="
                                    self-start
                                    text-gray-400
                                    hover:text-red-500
                                    transition
                                "
                                title="Remove item"
                            >
                                🗑
                            </button>

                        </div>

                    ))}

                </div>


                {/* Order Summary */}

                <div className="lg:col-span-1">

                    <div
                        className="
                            bg-white dark:bg-gray-800
                            border border-gray-100 dark:border-gray-700
                            rounded-xl
                            p-5
                            shadow-sm
                            sticky top-24
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

                                <span className="font-medium text-emerald-600">
                                    Free
                                </span>
                            </div>


                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between">

                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Total
                                </span>

                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                    ₹{subtotal}
                                </span>

                            </div>

                            <Link
                                to="/orders"
                                className="
                                    w-full
                                    mt-3
                                    py-3
                                    rounded-lg
                                    bg-gray-200 dark:bg-gray-700
                                    text-gray-900 dark:text-white
                                    text-sm font-medium
                                    hover:opacity-80
                                    transition
                                    block
                                    text-center
                                "
                            >
                                View My Orders
                            </Link>

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
                                to="/"
                                className="
                                    block
                                    text-center
                                    text-sm
                                    text-gray-500 dark:text-gray-400
                                    hover:text-gray-900 dark:hover:text-white
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
    );
}