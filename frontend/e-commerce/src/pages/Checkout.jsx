import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useLogin } from "../context/AuthContext"
import { useCart } from "../context/CartContext"

export default function Checkout() {
    const { access } = useLogin()
    const { cart, clearCart } = useCart()

    const navigate = useNavigate()
    const location = useLocation()

    const [address, setAddress] = useState("")
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [error, setError] = useState("")

    // Buy Now data
    const buyNowProduct = location.state?.product
    const buyNowQuantity = location.state?.quantity || 1

    // Items being checked out
    const checkoutItems = buyNowProduct
        ? [
              {
                  ...buyNowProduct,
                  quantity: buyNowQuantity,
              },
          ]
        : cart

    // Load Razorpay Checkout
    useEffect(() => {
        const script = document.createElement("script")

        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true

        document.body.appendChild(script)

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script)
            }
        }
    }, [])

    // Load user profile
    useEffect(() => {
        if (!access) {
            navigate("/login")
            return
        }

        axios
            .get("http://localhost:8000/api/profile/", {
                headers: {
                    Authorization: "Bearer " + access,
                },
            })
            .then((response) => {
                setAddress(response.data.address || "")
            })
            .catch((err) => {
                console.error("Profile error:", err)
                setError("We couldn't load your delivery address.")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [access, navigate])

    // Calculate total
    const totalCost = checkoutItems.reduce((total, item) => {
        return total + Number(item.discounted_price) * item.quantity
    }, 0)

    // Start payment
    const handlePlaceOrder = async () => {
        if (placingOrder) {
            return
        }

        if (!address.trim()) {
            setError(
                "Please add a delivery address before placing your order."
            )
            return
        }

        if (!window.Razorpay) {
            setError(
                "Payment system is still loading. Please try again."
            )
            return
        }

        if (totalCost <= 0) {
            setError("Invalid order amount.")
            return
        }

        setPlacingOrder(true)
        setError("")

        try {
            // Create Razorpay order through Django
            const response = await axios.post(
                "http://localhost:8000/api/payment/create/",
                {
                    amount: totalCost,
                },
                {
                    headers: {
                        Authorization: "Bearer " + access,
                    },
                }
            )

            const data = response.data

            console.log("Razorpay order response:", data)

          

            if (!data.order_id) {
                throw new Error("Razorpay order ID was not returned.")
            }

            if (!data.key) {
                throw new Error("Razorpay key was not returned.")
            }

            const options = {
                key: data.key,

                amount: data.amount,
                currency: data.currency || "INR",

                name: "ShopKart",
                description: "ShopKart Order",

                order_id: data.order_id,

                prefill: {
                    name: data.customer_name || "",
                    email: data.customer_email || "",
                    contact: data.customer_phone || "",
                },

                notes: {
                    address: address,
                },


                handler: async function (paymentResponse) {
                    try {
                        console.log(
                            "Razorpay payment successful:",
                            paymentResponse
                        )

                        const response = await axios.post(
                            "http://localhost:8000/api/payment/verify/",
                            {
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature,

                                address: address,

                                items: checkoutItems.map((item) => ({
                                    id: item.id,
                                    quantity: item.quantity,
                                })),
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${access}`,
                                },
                            }
                        )

                        console.log("Order created:", response.data)

                        clearCart('')
                        navigate("/order-success")

                    } catch (verifyError) {
                        console.error(
                            "Payment verification error:",
                            verifyError
                        )

                        console.error(
                            "Backend response:",
                            verifyError.response?.data
                        )

                        setError(
                            verifyError.response?.data?.message ||
                                verifyError.response?.data?.error ||
                                "Payment was completed, but verification failed."
                        )

                        setPlacingOrder(false)
                    }
                },

                modal: {
                    ondismiss: function () {
                        setPlacingOrder(false)
                    },
                },
            }

            const razorpay = new window.Razorpay(options)

            razorpay.on("payment.failed", function (paymentError) {
                console.error(
                    "Razorpay payment failed:",
                    paymentError
                )

                setError(
                    paymentError.error?.description ||
                        "Payment failed. Please try again."
                )

                setPlacingOrder(false)
            })

            razorpay.open()
        } catch (paymentError) {
            console.error("Payment error:", paymentError)
            console.error(
                "Backend response:",
                paymentError.response?.data
            )

            setError(
                paymentError.response?.data?.message ||
                    paymentError.response?.data?.error ||
                    paymentError.message ||
                    "We couldn't start the payment. Please try again."
            )

            setPlacingOrder(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 border-t-gray-800 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Preparing your checkout...
                    </p>
                </div>
            </div>
        )
    }

    // Empty cart
    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
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

                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Your cart is empty
                    </h2>

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Add some products to your cart before
                        proceeding to checkout.
                    </p>

                    <Link
                        to="/"
                        className="
                            inline-flex items-center justify-center
                            mt-6
                            px-6 py-3
                            rounded-lg
                            bg-gray-900 hover:bg-gray-800
                            dark:bg-white dark:hover:bg-gray-200
                            dark:text-gray-900
                            text-white
                            text-sm font-medium
                            transition-colors
                        "
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-6 sm:py-8 md:py-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1.5">
                        {buyNowProduct
                            ? "Quick purchase"
                            : "Review your purchase"}
                    </p>

                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        Checkout
                    </h1>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 sm:mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 px-4 py-3">
                        <div className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold">
                            !
                        </div>

                        <p className="text-sm leading-5 text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Main Layout */}
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 sm:gap-6 lg:gap-8">

                    {/* Delivery Address */}
                    <section
                        className="
                            bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            rounded-2xl
                            p-5 sm:p-6 md:p-7
                            shadow-sm
                        "
                    >
                        <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                    Step 1
                                </p>

                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Delivery Address
                                </h2>
                            </div>

                            <Link
                                to="/account"
                                className="
                                    shrink-0
                                    text-sm font-medium
                                    text-blue-600 dark:text-blue-400
                                    hover:underline
                                "
                            >
                                {address.trim() ? "Edit" : "Add"}
                            </Link>
                        </div>

                        {address.trim() ? (
                            <div
                                className="
                                    rounded-xl
                                    border border-gray-200 dark:border-gray-700
                                    bg-gray-50 dark:bg-gray-800/60
                                    p-4 sm:p-5
                                "
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />

                                    <span className="text-xs font-medium uppercase tracking-wide text-green-600 dark:text-green-400">
                                        Delivery address
                                    </span>
                                </div>

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-gray-700 dark:text-gray-300
                                        whitespace-pre-line
                                        wrap-break-words
                                    "
                                >
                                    {address}
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    rounded-xl
                                    border border-dashed
                                    border-red-300 dark:border-red-800
                                    bg-red-50/50 dark:bg-red-900/10
                                    p-4 sm:p-5
                                "
                            >
                                <p className="font-medium text-sm text-red-700 dark:text-red-400">
                                    No delivery address added
                                </p>

                                <p className="mt-1 text-sm text-red-600/80 dark:text-red-400/80">
                                    Add your address before placing this order.
                                </p>

                                <Link
                                    to="/account"
                                    className="
                                        inline-flex
                                        mt-4
                                        px-4 py-2
                                        rounded-lg
                                        bg-gray-900 hover:bg-gray-800
                                        dark:bg-white dark:hover:bg-gray-200
                                        dark:text-gray-900
                                        text-white
                                        text-sm font-medium
                                        transition-colors
                                    "
                                >
                                    Add Address
                                </Link>
                            </div>
                        )}

                        <div className="mt-5 sm:mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs leading-5 text-gray-500 dark:text-gray-500">
                                Your order will be delivered to the address
                                shown above.
                            </p>
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section
                        className="
                            bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            rounded-2xl
                            p-5 sm:p-6 md:p-7
                            shadow-sm
                        "
                    >
                        <div className="mb-5 sm:mb-6">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                Step 2
                            </p>

                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>
                        </div>

                        {/* Products */}
                        <div className="space-y-5">
                            {checkoutItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3 sm:gap-4 min-w-0"
                                >
                                    {/* Product Image */}
                                    <div
                                        className="
                                            w-16 h-16
                                            shrink-0
                                            rounded-xl
                                            bg-white
                                            border border-gray-100
                                            p-2
                                            flex items-center justify-center
                                            overflow-hidden
                                        "
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain rounded-lg"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className="
                                                font-medium
                                                text-sm
                                                leading-5
                                                text-gray-900 dark:text-white
                                                wrap-break-words
                                                line-clamp-2
                                            "
                                        >
                                            {item.name}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            ₹{item.discounted_price} ×{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    {/* Item Total */}
                                    <p
                                        className="
                                            shrink-0
                                            font-medium
                                            text-sm
                                            text-gray-900 dark:text-white
                                            whitespace-nowrap
                                        "
                                    >
                                        ₹
                                        {Number(item.discounted_price) *
                                            item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div
                            className="
                                mt-6 sm:mt-7
                                pt-5
                                border-t border-gray-200 dark:border-gray-800
                            "
                        >
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{totalCost}
                                </span>
                            </div>
                        </div>

                        {/* Pay Now */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={
                                placingOrder ||
                                !address.trim()
                            }
                            className="
                                w-full
                                mt-6
                                h-12
                                rounded-xl
                                bg-orange-500
                                hover:bg-orange-600
                                disabled:bg-gray-300
                                dark:disabled:bg-gray-700
                                disabled:text-gray-500
                                dark:disabled:text-gray-500
                                text-white
                                font-semibold
                                text-sm
                                transition-colors
                                disabled:cursor-not-allowed
                            "
                        >
                            {placingOrder ? (
                                <span className="inline-flex items-center justify-center gap-2">
                                    <span
                                        className="
                                            w-4 h-4
                                            border-2
                                            border-white/40
                                            border-t-white
                                            rounded-full
                                            animate-spin
                                        "
                                    />

                                    Processing...
                                </span>
                            ) : (
                                `Pay ₹${totalCost}`
                            )}
                        </button>

                        <p
                            className="
                                mt-3
                                text-center
                                text-xs
                                leading-5
                                text-gray-400 dark:text-gray-500
                            "
                        >
                            Secure payment powered by Razorpay.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}