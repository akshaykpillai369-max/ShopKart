import { Link } from "react-router-dom"
import { useProduct } from "../context/ProductContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Categories() {
    const { category, loading } = useProduct()

    

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-50">
                <h2 className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading categories...
                </h2>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Categories
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {category.map((item) => (
                    <Link
                        key={item.id}
                        to={`/products?category=${encodeURIComponent(item.name)}`}
                        className="group"
                    >
                        <div className="
                            bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            rounded-2xl
                            overflow-hidden
                            transition-all duration-300
                            hover:-translate-y-1
                            hover:shadow-md
                            hover:border-gray-300 dark:hover:border-gray-700
                        ">
                            <div className="h-40 flex items-center justify-center p-6 bg-white">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="
                                        max-h-full max-w-full
                                        object-contain
                                        transition-transform duration-300
                                        group-hover:scale-105
                                    "
                                />
                            </div>

                            <div className="px-4 py-4">
                                <h2 className="
                                    text-sm font-semibold
                                    text-gray-900 dark:text-gray-100
                                    group-hover:text-blue-600
                                    dark:group-hover:text-blue-400
                                    transition-colors
                                ">
                                    {item.name}
                                </h2>

                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Explore products →
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}