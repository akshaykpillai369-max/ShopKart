import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from "react"

import axios from "axios"


const ProductContext = createContext()

export const useProduct = () => useContext(ProductContext)


export function ProductProvider({ children }) {

    const [category, setCategory] = useState([])
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([])
    const [nextPage, setNextPage] = useState(null)
    const [previousPage, setPreviousPage] = useState(null)


    useEffect(() => {

        axios
            .get("http://localhost:8000/api/categories/")
            .then((response) => {
                setCategory(response.data)
            })
            .catch((err) =>
                console.error(
                    "Error fetching category:",
                    err
                )
            )

    }, [])


    const handleSearch = useCallback(
        (searchterm, categoryName = "") => {

            const safeSearchTerm =
                encodeURIComponent(searchterm)

            const safeCategory =
                encodeURIComponent(categoryName)


            let url =
                `http://localhost:8000/api/products/?search=${safeSearchTerm}`


            if (categoryName) {

                url += `&category=${safeCategory}`

            }


            axios
                .get(url)
                .then((response) => {

                    setProducts(
                        response.data.results
                    )

                    setNextPage(
                        response.data.next
                    )

                    setPreviousPage(
                        response.data.previous
                    )

                })
                .catch((err) => {

                    console.error(
                        "Error fetching products:",
                        err
                    )

                })

        },
        []
    )


    const handleCategory = useCallback(
        (categoryName) => {

            const safeCategory =
                encodeURIComponent(categoryName)


            axios
                .get(
                    `http://localhost:8000/api/products/?category=${safeCategory}`
                )
                .then((response) => {

                    setProducts(
                        response.data.results
                    )

                    setNextPage(
                        response.data.next
                    )

                    setPreviousPage(
                        response.data.previous
                    )

                })
                .catch((err) => {

                    console.error(
                        "Error fetching category products:",
                        err
                    )

                })

        },
        []
    )


    const handlePage = useCallback(
        async (url) => {

            if (!url) return

            try {

                const response =
                    await axios.get(url)

                setProducts(
                    response.data.results
                )

                setNextPage(
                    response.data.next
                )

                setPreviousPage(
                    response.data.previous
                )

            } catch (err) {

                console.error(
                    "Error fetching page:",
                    err
                )

            }

        },
        []
    )


    return (
        <ProductContext
            value={{
                products,category,loading,nextPage,previousPage,handleSearch,handleCategory,handlePage
            }}
        >
            {children}
        </ProductContext>
    )
}