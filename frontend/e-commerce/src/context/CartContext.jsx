// Line 1: Add useContext here!
import { createContext, useContext, useState } from "react";
//creator of portal
const CartContext = createContext()

export const useCart = () => useContext(CartContext)

//transmitter of portal
export default function CartProvider({children}){

    const [cart, setCart] = useState([])

    const addToCart = (product) => {

        setCart((c) => [product, ...c])

    }

    return(
        <CartContext value={{cart, addToCart}}>
            {children}
        </CartContext>
    )

   

}


