import { Link } from "react-router-dom"

export default function OrderSuccess() {

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">

            <div className="text-center bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full animate-[fadeIn_0.5s_ease-out]">

                {/* Success Icon */}
                <div className="flex justify-center mb-6">

                    <div className="relative flex items-center justify-center w-24 h-24">

                        <div className="absolute inset-0 rounded-full border-4 border-green-200 dark:border-green-900 animate-ping opacity-60"></div>

                        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 border-4 border-green-500 dark:border-green-400">

                            <span className="text-4xl font-bold text-green-600 dark:text-green-400 animate-[scaleIn_0.4s_ease-out]">
                                ✓
                            </span>

                        </div>

                    </div>

                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Order Placed Successfully!
                </h1>

                <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                    Thank you for your purchase. Your order has been placed successfully.
                </p>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    You can view your order details anytime from your orders.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-7">

                    <Link
                        to="/orders"
                        className="
                            flex-1
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            rounded-lg
                            font-medium
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                            text-center
                        "
                    >
                        View Orders
                    </Link>

                    <Link
                        to="/"
                        className="
                            flex-1
                            bg-gray-200
                            hover:bg-gray-300
                            dark:bg-gray-700
                            dark:hover:bg-gray-600
                            text-gray-900
                            dark:text-white
                            py-3
                            rounded-lg
                            font-medium
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:shadow-md
                            text-center
                        "
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    )
}