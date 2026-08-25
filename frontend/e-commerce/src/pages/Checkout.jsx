import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { useLogin } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function Checkout() {
    const { access } = useLogin()
    const { cart, clearCart } = useCart()
    const navigate = useNavigate()

    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!access) {
            navigate("/login")
            return
        }

        axios.get("http://localhost:8000/api/profile/", {
            headers: {
                Authorization: "Bearer " + access
            }
        })
        .then((response) => {
            setAddress(response.data.address || "")
            setLoading(false)
        })
        .catch(() => {
            setError("Failed to load your profile.")
            setLoading(false)
        })
    }, [access, navigate])

    let totalCost = 0

    for (const item of cart) {
        totalCost += item.discounted_price * item.quantity
    }

    const handlePlaceOrder = () => {
        if (!address.trim()) {
            setError("Please add a delivery address before placing the order.")
            return
        }

        setPlacingOrder(true)
        setError("")

        axios.post(
            "http://localhost:8000/api/orders/",
            {
                address: address
            },
            {
                headers: {
                    Authorization: "Bearer " + access
                }
            }
        )
        .then(() => {
            clearCart()
            navigate("/order-success")
        })
        .catch((error) => {
            setError(
                error.response?.data?.message ||
                "Failed to place order."
            )
            setPlacingOrder(false)
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-50">
                <h2 className="text-sm text-gray-500 animate-pulse">
                    Loading checkout...
                </h2>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Your cart is empty.
                </h2>

                <Link
                    to="/"
                    className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
                >
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-8">

                <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Delivery Address
                        </h2>

                        <Link
                            to="/account"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Edit Address
                        </Link>
                    </div>

                    {address.trim() ? (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                {address}
                            </p>
                        </div>
                    ) : (
                        <div className="border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <p className="text-red-600 dark:text-red-400">
                                You haven't added a delivery address yet.
                            </p>

                            <Link
                                to="/account"
                                className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
                            >
                                Add Address
                            </Link>
                        </div>
                    )}

                    {error && (
                        <p className="mt-4 text-sm text-red-500">
                            {error}
                        </p>
                    )}
                </section>

                <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        Order Summary
                    </h2>

                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {item.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        ₹{item.discounted_price} × {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium text-gray-900 dark:text-white">
                                    ₹{item.discounted_price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Total
                        </span>

                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ₹{totalCost}
                        </span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || !address.trim()}
                        className="w-full mt-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-medium transition"
                    >
                        {placingOrder ? "Placing Order..." : "Place Order"}
                    </button>
                </section>

            </div>
        </div>
    )
}