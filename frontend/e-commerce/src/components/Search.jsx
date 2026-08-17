import { useEffect, useState } from "react";
import { useProduct } from "../context/productContext";

export default function SearchBar(){

  const {handleSearch} = useProduct()

    const [query, setQuery] = useState("")

    useEffect(() => {

        const timer = setTimeout(() => {

            handleSearch(query)
        }, 400)

        return () => clearTimeout(timer)
    }, [query, handleSearch])

    return (
    <input
      type="text"
      placeholder="Search products..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="sm:w-100 lg:w-120 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
