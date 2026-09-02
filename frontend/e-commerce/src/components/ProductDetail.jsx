import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLogin } from "../context/AuthContext"

export default function ProductDetail() {
    const { cart, addToCart } = useCart()
    const { access } = useLogin()
    const navigate = useNavigate()
    const { slug } = useParams()

    const [product, setProduct] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const inCart = product
        ? cart.some((item) => item.id === product.id)
        : false

    useEffect(() => {
        setLoading(true)
        setError("")

        axios
            .get(`http://localhost:8000/api/products/${slug}/`)
            .then((response) => {
                setProduct(response.data)
            })
            .catch((err) => {
                setError(
                    err.response?.status === 404
                        ? "Product not found."
                        : "Failed to load product."
                )
            })
            .finally(() => {
                setLoading(false)
            })
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-3 border-2 border-gray-300 border-t-gray-800 dark:border-gray-600 dark:border-t-white rounded-full animate-spin" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading product...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {error}
                    </h2>

                    <Link
                        to="/"
                        className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                        Back to Shopping
                    </Link>
                </div>
            </div>
        )
    }

    const outOfStock = product.stock <= 0

    return (
        <div className="max-w-6xl mx-auto px-4 py-5 sm:py-6 md:px-8 md:py-10">

            {/* Product */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">

                {/* Product Image */}
                <section
                    className="
                        bg-white
                        rounded-2xl
                        border border-gray-100
                        p-4 sm:p-6 md:p-8
                        flex items-center justify-center
                        min-h-75
                        sm:min-h-95
                        md:min-h-125
                        overflow-hidden
                    "
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="
                            w-full
                            max-h-80
                            sm:max-h-100
                            md:max-h-112.5
                            object-contain
                            rounded-xl
                        "
                    />
                </section>


                {/* Product Information */}
                <section className="flex flex-col min-w-0">

                    {/* Product Name */}
                    <h1
                        className="
                            text-2xl
                            sm:text-3xl
                            font-semibold
                            text-gray-900 dark:text-white
                            leading-snug
                            wrap-break-words
                        "
                    >
                        {product.name}
                    </h1>


                    {/* Rating */}
                    <div className="mt-4 flex items-center gap-2">
                        <div
                            className="
                                inline-flex items-center gap-2
                                bg-gray-100 dark:bg-gray-800
                                px-3 py-1.5
                                rounded-md
                            "
                        >
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                {product.display_rating}
                            </span>

                            <span className="text-emerald-600 dark:text-emerald-400">
                                ★
                            </span>

                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {product.rating_count
                                    ? product.rating_count.toLocaleString()
                                    : 0}
                            </span>
                        </div>
                    </div>


                    {/* Price */}
                    <div className="mt-6 flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ₹{product.discounted_price}
                        </span>

                        {product.price && (
                            <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                                ₹{product.price}
                            </span>
                        )}
                    </div>


                    {/* Stock Status */}
                    <div className="mt-3">
                        {outOfStock ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
                                Out of Stock
                            </span>
                        ) : product.stock <= 5 ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
                                Only {product.stock} left in stock
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-medium">
                                In Stock
                            </span>
                        )}
                    </div>


                    {/* Description */}
                    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-5 mt-6">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            About this Item
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed wrap-break-words">
                            {product.description}
                        </p>
                    </div>


                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                        {outOfStock ? (
                            <button
                                disabled
                                className="
                                    flex-1
                                    bg-gray-200 dark:bg-gray-700
                                    text-gray-400 dark:text-gray-500
                                    font-medium
                                    py-3 px-6
                                    rounded-lg
                                    cursor-not-allowed
                                "
                            >
                                Out of Stock
                            </button>
                        ) : (
                            <>
                                {inCart ? (
                                    <Link
                                        to="/cart"
                                        className="
                                            flex-1
                                            bg-green-500
                                            hover:bg-green-600
                                            text-white
                                            font-medium
                                            py-3 px-6
                                            rounded-lg
                                            transition-colors
                                            shadow-sm
                                            text-center
                                        "
                                    >
                                        Go to Cart
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!access) {
                                                navigate("/login")
                                                return
                                            }

                                            addToCart(product)
                                        }}
                                        className="
                                            flex-1
                                            bg-yellow-400
                                            hover:bg-yellow-500
                                            text-black
                                            font-medium
                                            py-3 px-6
                                            rounded-lg
                                            transition-colors
                                            shadow-sm
                                        "
                                    >
                                        Add to Cart
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (!access) {
                                            navigate("/login")
                                            return
                                        }

                                        navigate("/checkout", {
                                            state: {
                                                product: product,
                                                quantity: 1,
                                            },
                                        })
                                    }}
                                    className="
                                        flex-1
                                        bg-orange-500
                                        hover:bg-orange-600
                                        text-white
                                        font-medium
                                        py-3 px-6
                                        rounded-lg
                                        transition-colors
                                        shadow-sm
                                    "
                                >
                                    Buy Now
                                </button>
                            </>
                        )}

                    </div>

                </section>

            </div>
        </div>
    )
}