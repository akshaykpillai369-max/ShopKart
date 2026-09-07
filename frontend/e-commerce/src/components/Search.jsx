import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function SearchBar() {

    const [query, setQuery] = useState("")

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const category = searchParams.get("category")


    const handleSearch = (value) => {

        setQuery(value)

        const trimmed = value.trim()

        if (!trimmed) {
            return
        }

        const search = encodeURIComponent(trimmed)

        if (category) {
            navigate(
                `/products?category=${encodeURIComponent(category)}&search=${search}`
            )
        } else {
            navigate(
                `/products?search=${search}`
            )
        }
    }


    return (
        <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    )
}