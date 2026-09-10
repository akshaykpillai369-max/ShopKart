import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useLogin } from "../context/AuthContext"

const API = import.meta.env.VITE_API_URL

export default function ProductDetail() {
    const { cart, addToCart } = useCart()
    const { access } = useLogin()
    const navigate = useNavigate()
    const { slug } = useParams()

    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [rating, setRating] = useState(0)
    const [description, setDescription] = useState("")
    const [error, setError] = useState("")
    const [addingToCart, setAddingToCart] = useState(false)

    const inCart = product
        ? cart.some((item) => item.id === product.id)
        : false

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true)
                setError("")

                const response = await axios.get(
                    `${API}/api/products/${slug}/`
                )

                setProduct(response.data)
            } catch (err) {
                setError(
                    err.response?.status === 404
                        ? "Product not found."
                        : "Failed to load product."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    useEffect(() => {
        if (!product) return

        const fetchReviews = async () => {
            try {
                const response = await axios.get(
                    `${API}/api/reviews/?product=${product.id}`
                )

                setReviews(response.data.results || response.data)
            } catch {
                setError("Failed to load reviews.")
            }
        }

        fetchReviews()
    }, [product])

    const handleAddToCart = async () => {
        if (!access) {
            navigate("/login")
            return
        }

        try {
            setAddingToCart(true)
            await addToCart(product)
        } finally {
            setAddingToCart(false)
        }
    }

    const handleBuyNow = () => {
        if (!access) {
            navigate("/login")
            return
        }

        navigate("/checkout", {
            state: {
                product,
                quantity: 1,
            },
        })
    }

    const handleSubmit = async () => {
        if (!access || rating === 0 || !description.trim()) return

        try {
            await axios.post(
                `${API}/api/reviews/`,
                {
                    product: product.id,
                    rating,
                    description: description.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                }
            )

            setRating(0)
            setDescription("")

            const [productResponse, reviewsResponse] = await Promise.all([
                axios.get(`${API}/api/products/${slug}/`),
                axios.get(`${API}/api/reviews/?product=${product.id}`),
            ])

            setProduct(productResponse.data)
            setReviews(reviewsResponse.data.results || reviewsResponse.data)
        } catch (err) {
            console.error(err.response?.data)
        }
    }

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

    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">

                <div className="text-center">

                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {error || "Product not found."}
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

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">

                {/* Product Image */}

                <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center min-h-75 sm:min-h-95 md:min-h-125 overflow-hidden">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full max-h-80 sm:max-h-100 md:max-h-112.5 object-contain rounded-xl"
                    />

                </section>


                {/* Product Information */}

                <section className="flex flex-col min-w-0">

                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white leading-snug wrap-break-words">
                        {product.name}
                    </h1>


                    {/* Rating */}

                    {product.rating_count > 0 && (
                        <div className="mt-4">

                            <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">

                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                    {product.rating_avg}
                                </span>

                                <span className="text-emerald-600 dark:text-emerald-400">
                                    ★
                                </span>

                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.rating_count}
                                </span>

                            </div>

                        </div>
                    )}


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


                    {/* Stock */}

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


                    {/* Actions */}

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">

                        {outOfStock ? (
                            <button
                                disabled
                                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-medium py-3 px-6 rounded-lg cursor-not-allowed"
                            >
                                Out of Stock
                            </button>
                        ) : (
                            <>
                                {inCart ? (
                                    <Link
                                        to="/cart"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm text-center"
                                    >
                                        Go to Cart
                                    </Link>
                                ) : (
                                    <button
                                        disabled = {addingToCart}
                                        onClick={handleAddToCart}
                                    
                                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors shadow-sm disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        Add to Cart
                                    </button>
                                )}

                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
                                >
                                    Buy Now
                                </button>
                            </>
                        )}

                    </div>


                    {/* Description */}

                    <div className="mt-8">

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            About this Item
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed wrap-break-words">
                            {product.description}
                        </p>

                    </div>

                </section>

            </div>


            {/* Write Review */}

            {product.can_review && (
                <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Write a Review
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            How was your experience with this product?
                        </p>

                    </div>


                    {/* Rating */}

                    <div className="mt-6">

                        <div className="flex items-center justify-between mb-3">

                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                Your rating
                            </p>

                            {rating > 0 ? (
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {rating} out of 5
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    Tap a star to rate
                                </span>
                            )}

                        </div>

                        <div className="inline-flex items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">

                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                                        star <= rating
                                            ? `text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-sm`
                                            : `text-gray-300 dark:text-gray-600 hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20`
                                    }`}
                                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                                >

                                    <span
                                        className={`text-2xl sm:text-3xl leading-none transition-transform duration-200 ${
                                            star <= rating ? "drop-shadow-sm" : ""
                                        }`}
                                    >
                                        ★
                                    </span>

                                </button>
                            ))}

                        </div>

                    </div>


                    {/* Review Text */}

                    <div className="mt-6">

                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Your review
                        </label>

                        <div className="relative">

                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell other shoppers what you liked or disliked..."
                                rows={5}
                                maxLength={500}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all focus:bg-white dark:focus:bg-gray-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none"
                            />

                            <span className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                                {description.length}/500
                            </span>

                        </div>

                    </div>


                    {/* Submit */}

                    <div className="mt-5 flex items-center justify-between gap-4">

                        <p className="hidden sm:block text-xs text-gray-400 dark:text-gray-500">
                            Be honest and helpful to other shoppers.
                        </p>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={rating === 0 || !description.trim()}
                            className="w-full sm:w-auto min-w-37.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                        >
                            Submit Review
                        </button>

                    </div>

                </div>
            )}


            {/* Existing Reviews */}

            <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-8">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Customer Reviews
                </h2>

                {reviews.length > 0 ? (
                    <div className="mt-6 space-y-5">

                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
                            >

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {review.user}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1">

                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    className={
                                                        star <= review.rating
                                                            ? "text-emerald-500"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            ))}

                                        </div>

                                    </div>

                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>

                                </div>

                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {review.description}
                                </p>

                            </div>
                        ))}

                    </div>
                ) : (
                    <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
                        No reviews yet.
                    </p>
                )}

            </div>

        </div>
    )
}