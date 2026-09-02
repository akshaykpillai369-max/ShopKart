import { Link } from "react-router-dom"
import { useProduct } from "../context/productContext"

export default function ProductList() {
    const { products, loading } = useProduct()

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-50">
                <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading products...
                </h2>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-6">
                {products.map((product) => {
                    const discount =
                        product.price > product.discounted_price
                            ? Math.round(
                                  ((product.price - product.discounted_price) /
                                      product.price) *
                                      100
                              )
                            : 0

                    return (
                        <div
                            key={product.id}
                            className="w-full max-w-45 flex flex-col font-sans cursor-pointer group mx-auto"
                        >
                            <Link to={`/product/${product.slug}`}>
                                {/* Product Image */}
                                <div
                                    className="
                                        relative
                                        w-full
                                        h-60
                                        bg-white
                                        rounded-2xl
                                        p-4
                                        flex items-center justify-center
                                        overflow-hidden
                                        border border-gray-200
                                        dark:border-gray-800
                                        shadow-sm
                                        dark:shadow-none
                                        transition-all
                                        duration-300
                                        group-hover:border-gray-300
                                        dark:group-hover:border-gray-700
                                        group-hover:shadow-md
                                        group-hover:-translate-y-1
                                    "
                                >
                                    {product.image && (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="
                                                max-h-32
                                                max-w-[85%]
                                                w-auto
                                                object-contain
                                                transition-transform
                                                duration-500
                                                ease-out
                                                group-hover:scale-110
                                            "
                                        />
                                    )}

                                    {/* Rating */}
                                    <div
                                        className="
                                            absolute
                                            bottom-2
                                            left-2
                                            inline-flex
                                            items-center
                                            gap-1
                                            bg-white/95
                                            dark:bg-gray-800/95
                                            backdrop-blur-sm
                                            px-2
                                            py-1
                                            rounded-md
                                            border
                                            border-gray-200
                                            dark:border-gray-700
                                            shadow-sm
                                        "
                                    >
                                        <span className="text-[11px] font-semibold text-gray-800 dark:text-gray-100">
                                            {product.display_rating}
                                        </span>

                                        <span className="text-[10px] text-emerald-500">
                                            ★
                                        </span>
                                    </div>

                                    {/* Discount */}
                                    {discount > 0 && (
                                        <div
                                            className="
                                                absolute
                                                top-2
                                                left-2
                                                px-2
                                                py-1
                                                rounded-md
                                                bg-blue-600
                                                text-white
                                                text-[10px]
                                                font-semibold
                                            "
                                        >
                                            {discount}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Product Information */}
                                <div className="px-0.5 mt-2">
                                    <h3
                                        className="
                                            text-xs
                                            font-medium
                                            text-gray-800
                                            dark:text-gray-200
                                            truncate
                                            group-hover:text-blue-600
                                            dark:group-hover:text-blue-400
                                            transition-colors
                                        "
                                        title={product.name}
                                    >
                                        {product.name}
                                    </h3>

                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <span className="text-sm font-bold text-gray-950 dark:text-white">
                                            ₹
                                            {Number(
                                                product.discounted_price
                                            ).toLocaleString("en-IN")}
                                        </span>

                                        {product.price >
                                            product.discounted_price && (
                                            <span className="text-[11px] text-gray-400 dark:text-gray-500 line-through">
                                                ₹
                                                {Number(
                                                    product.price
                                                ).toLocaleString("en-IN")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}