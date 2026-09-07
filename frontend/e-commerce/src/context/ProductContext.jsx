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
        setLoading(true)

        axios
            .get(`${import.meta.env.VITE_API_URL}/api/categories/`)
            .then((response) => {
                setCategory(response.data)
            })
            .catch((err) =>
                console.error(
                    "Error fetching category:",
                    err
                )
            )
            .finally(() => {

                setLoading(false)
            })

    }, [])


    const handleSearch = useCallback(
        (searchterm, categoryName = "") => {

            setLoading(true)
            const safeSearchTerm =
                encodeURIComponent(searchterm)

            const safeCategory =
                encodeURIComponent(categoryName)


            let url = `${import.meta.env.VITE_API_URL}/api/products/?search=${safeSearchTerm}`


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
                .finally(() => {

                    setLoading(false)
                })

        },
        []
    )


    const handleCategory = useCallback(
        (categoryName) => {

            setLoading(true)

            const safeCategory =
                encodeURIComponent(categoryName)


            axios
                .get(
                    `${import.meta.env.VITE_API_URL}/api/products/?category=${safeCategory}`
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
                .finally(()=> {

                    setLoading(false)
                })

        },
        []
    )


    const handlePage = useCallback(
        async (url) => {
            if (!url) return
            setLoading(true)
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
            } finally {
                setLoading(false)
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
