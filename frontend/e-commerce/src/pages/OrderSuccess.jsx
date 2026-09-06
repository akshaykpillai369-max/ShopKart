import { Link } from "react-router-dom"

export default function OrderSuccess() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-5">
                        <svg
                            className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>

                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                        ORDER CONFIRMED
                    </p>

                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Thanks for your order.
                    </h1>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                        Your order has been placed successfully and is now
                        being processed.
                    </p>
                </div>

                {/* Confirmation Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    {/* Status */}
                    <div className="px-6 md:px-8 py-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Your order is confirmed
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    We'll process your order shortly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="px-6 md:px-8 py-7">
                        <div className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white dark:text-gray-900"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>

                                <span className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Ordered
                                </span>
                            </div>

                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mx-3 mb-5" />

                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                                </div>

                                <span className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    Processing
                                </span>
                            </div>

                            <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700 mx-3 mb-5" />

                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                                </div>

                                <span className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    Delivered
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 md:px-8 py-6 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                to="/orders"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                            >
                                View My Orders
                            </Link>

                            <Link
                                to="/"
                                className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
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