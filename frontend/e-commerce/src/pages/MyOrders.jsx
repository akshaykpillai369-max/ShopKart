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

    useEffect(() => {
    if (authLoading) {
        return
    }

    if (!access) {
        navigate("/login")
        return
    }

    axios.get("http://localhost:8000/api/orders/", {
        headers: {
            Authorization: "Bearer " + access
        }
    })
    .then((response) => {
        setOrders(response.data)
        setLoading(false)
    })
    .catch(() => {
        setError("Failed to load your orders.")
        setLoading(false)
    })
}, [access, authLoading, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">
                    Loading your orders...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="text-6xl mb-4">
                        📦
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        No Orders Yet
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        You haven't placed any orders yet.
                    </p>

                    <Link
                        to="/"
                        className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">

            <div className="max-w-4xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    My Orders
                </h1>

                <div className="space-y-5">

                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                                <div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                       Ordered On :  {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <span className="inline-block w-fit px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium">
                                    {order.status}
                                </span>

                            </div>

                            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">

                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center gap-4"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {item.product.name}
                                            </p>

                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ₹{item.price} × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="font-medium text-gray-900 dark:text-white">
                                            ₹{item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}

                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 mt-5 pt-4 flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total
                                    </p>

                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        ₹{order.total_cost}
                                    </p>
                                </div>

                                <Link
                                    to={`/orders/${order.id}`}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    )
}