import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useLogin } from "../context/AuthContext"

export default function OrderDetail() {
    const { access, authLoading } = useLogin()
    const navigate = useNavigate()
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

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
            .get(`${import.meta.env.VITE_API_URL}/api/orders/${id}/`, {
                headers: {
                    Authorization: "Bearer " + access,
                },
            })
            .then((response) => {
                setOrder(response.data)
            })
            .catch((err) => {
                if (err.response?.status === 404) {
                    setError("Order not found.")
                } else {
                    setError("Failed to load order details.")
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [access, authLoading, id, navigate])

    if (authLoading || loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-3 border-2 border-gray-300 border-t-gray-800 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading order...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-xl font-semibold">
                        !
                    </div>

                    <h1 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                        {error}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        We couldn't find the order you're looking for.
                    </p>

                    <Link
                        to="/orders"
                        className="inline-flex mt-6 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium transition-colors"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        )
    }

    const orderDate = new Date(order.created_at).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    )

    const totalItems = order.items.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const getStatusStyle = (status) => {
        const value = status?.toLowerCase()

        if (value === "delivered") {
            return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
        }

        if (value === "cancelled" || value === "canceled") {
            return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        }

        if (value === "shipped") {
            return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
        }

        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
    }

    // Delivery tracker
    const deliverySteps = [
        {
            key: "ordered",
            label: "Ordered",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 6h18M5 6v13a2 2 0 002 2h10a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
                    />
                </svg>
            ),
        },
        {
            key: "processing",
            label: "Processing",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
        {
            key: "shipped",
            label: "Shipped",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7v-7zm-8 9a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z"
                    />
                </svg>
            ),
        },
        {
            key: "delivered",
            label: "Delivered",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            ),
        },
    ]

    const normalizedStatus = order.status?.toLowerCase()

    const statusIndex =
        normalizedStatus === "delivered"
            ? 3
            : normalizedStatus === "shipped"
                ? 2
                : normalizedStatus === "processing"
                    ? 1
                    : 0

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        ← Back to Orders
                    </Link>

                    <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order #{order.id}
                            </p>

                            <h1 className="mt-1 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                                Order Details
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Placed on {orderDate}
                            </p>

                            {order.status !== "Delivered" ? (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Expected delivery:{" "}
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {formatDate(order.expected_delivery)}
                                    </span>
                                </p>
                            ) : (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Delivered on:{" "}
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {formatDate(order.expected_delivery)}
                                    </span>
                                </p>
                            )}
                        </div>

                        <span
                            className={`inline-flex w-fit px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}
                        >
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Delivery Tracker */}
                <section className="mb-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        Delivery Status
                    </h2>

                    <div className="mt-7 flex items-start">
                        {deliverySteps.map((step, index) => {
                            const completed = index <= statusIndex
                            const isCurrent = index === statusIndex
                            const isLast =
                                index === deliverySteps.length - 1

                            return (
                                <div
                                    key={step.key}
                                    className="flex-1 flex items-start"
                                >
                                    <div className="flex flex-col items-center min-w-0">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                                completed
                                                    ? "bg-blue-600 border-blue-600 text-white"
                                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                                            }`}
                                        >
                                            {completed && !isCurrent ? (
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                step.icon
                                            )}
                                        </div>

                                        <p
                                            className={`mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap ${
                                                completed
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-gray-400 dark:text-gray-500"
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                    </div>

                                    {!isLast && (
                                        <div className="flex-1 px-2 sm:px-3 pt-5">
                                            <div
                                                className={`h-0.5 w-full ${
                                                    index < statusIndex
                                                        ? "bg-blue-600"
                                                        : "bg-gray-200 dark:bg-gray-700"
                                                }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="px-5 md:px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Items in your order
                            </h2>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {totalItems}{" "}
                                {totalItems === 1 ? "item" : "items"}
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-5 md:p-6 flex gap-4"
                                >
                                    {/* Product Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl bg-gray-50 dark:bg-gray-50 flex items-center justify-center overflow-hidden">
                                        {item.product?.image ? (
                                            <img
                                                src={
                                                    item.product.image?.startsWith(
                                                        "http"
                                                    )
                                                        ? item.product.image
                                                        : `${import.meta.env.VITE_API_URL}${item.product.image}`
                                                }
                                                alt={item.product.name}
                                                className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl bg-gray-50 dark:bg-gray-50 object-contain"
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                No image
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {item.product.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            ₹{item.price} × {item.quantity}
                                        </p>

                                        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Delivery Address */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Delivery Address
                            </h2>

                            <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                    {order.address}
                                </p>
                            </div>
                        </section>

                        {/* Order Summary */}
                        <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 md:p-6">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        Total items
                                    </span>

                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {totalItems}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-between">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        ₹{order.total_cost}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}