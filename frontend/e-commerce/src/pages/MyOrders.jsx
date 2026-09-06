import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useLogin } from "../context/AuthContext"

export default function MyOrders() {
    const { access, authLoading } = useLogin()
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const now = new Date()

    useEffect(() => {
        if (authLoading) {
            return
        }

        if (!access) {
            navigate("/login")
            return
        }

        setLoading(true)
        setError("")

        axios
           .get(`${import.meta.env.VITE_API_URL}/api/orders/`, {
                headers: {
                    Authorization: "Bearer " + access,
                },
            })
            .then((response) => {
                setOrders(response.data)
            })
            .catch(() => {
                setError("Failed to load your orders.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [access, authLoading, navigate])

    const getStatusStyle = (status) => {
        const normalizedStatus = status?.toLowerCase()

        if (normalizedStatus === "delivered") {
            return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
        }

        if (
            normalizedStatus === "cancelled" ||
            normalizedStatus === "canceled"
        ) {
            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
        }

        if (normalizedStatus === "shipped") {
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        }

        if (normalizedStatus === "processing") {
            return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
        }

        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 sm:py-10">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-7 sm:mb-8">
                        <div className="h-8 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />

                        <div className="h-4 w-52 bg-gray-200 dark:bg-gray-800 rounded mt-3 animate-pulse" />
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                    <div className="space-y-3">
                                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                                        <div className="h-3 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                    </div>

                                    <div className="h-7 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 mt-5 pt-5 space-y-4">
                                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />

                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-12 h-12 mx-auto rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <span className="text-red-500 dark:text-red-400 text-xl">
                            !
                        </span>
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Couldn't load your orders
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center">
                        <svg
                            className="w-7 h-7 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.7"
                                d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3m16 0H4"
                            />
                        </svg>
                    </div>

                    <h1 className="mt-5 text-2xl font-semibold text-gray-900 dark:text-white">
                        No orders yet
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        Once you place an order, you'll be able to track and
                        manage it here.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-7 sm:py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-7 sm:mb-8">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        View your previous orders and their current status.
                    </p>
                </div>

                {/* Orders */}
                <div className="space-y-4 sm:space-y-5">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
                        >
                            {/* Order Header */}
                            <div className="px-4 py-4 sm:px-5 sm:py-5 md:px-6 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            Order #{order.id}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Placed on{" "}
                                            {formatDate(order.created_at)}
                                        </p>
                                    </div>

                                    <span
                                        className={`inline-flex w-fit items-center px-3 py-1.5 rounded-full border text-xs font-medium shrink-0 ${getStatusStyle(order.status)}`}
                                    >
                                        <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current" />
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="px-4 py-4 sm:px-5 sm:py-5 md:px-6">
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between gap-3 sm:gap-4 min-w-0"
                                        >
                                            {/* Item Info */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-5 text-gray-900 dark:text-white wrap-break-words">
                                                    {item.product.name}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    ₹{item.price} ×{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            {/* Item Total */}
                                            <p className="shrink-0 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                ₹
                                                {(
                                                    item.price * item.quantity
                                                ).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-4 sm:px-5 sm:py-5 md:px-6 bg-gray-50/70 dark:bg-gray-950/40 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Order Total
                                        </p>

                                        <p className="mt-0.5 text-lg font-semibold text-gray-900 dark:text-white">
                                            ₹
                                            {Number(
                                                order.total_cost
                                            ).toLocaleString("en-IN")}
                                        </p>

                                        {order.status !== "Delivered" ? (
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Expected delivery:{" "}
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {formatDate(
                                                        order.expected_delivery
                                                    )}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                Delivered on:{" "}
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {formatDate(
                                                        order.expected_delivery
                                                    )}
                                                </span>
                                            </p>
                                        )}
                                    </div>

                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-medium transition-colors"
                                    >
                                        View Details

                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.8"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    )
}