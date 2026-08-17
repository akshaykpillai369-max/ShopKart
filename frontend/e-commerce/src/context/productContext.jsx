// Line 1: Add useContext here!
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios'

//creator of portal
const ProductContext = createContext()

export const useProduct = () => useContext(ProductContext)

//transmitter of portal
export function ProductProvider({ children }) {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    

    useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/products/")
      .then((response) => {

        setProducts(response.data)
        setLoading(false)
      })
      .catch((err) => console.error("Error fetching products:", err))  
    }, [])

     

  

  const handleSearch = useCallback((searchterm) => {  
      const safeSearchTerm = encodeURIComponent(searchterm);
      axios.get(`http://127.0.0.1:8000/api/products/?search=${safeSearchTerm}`)
        .then((response) => setProducts(response.data))
        .catch((err) => console.error("Error fetching products:", err));
        
    }, [])
    
    

    return (
        <ProductContext value={{products,loading, handleSearch}}>
            {children}
        </ProductContext>
    );
}



