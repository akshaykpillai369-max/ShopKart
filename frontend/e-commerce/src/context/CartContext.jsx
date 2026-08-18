// Line 1: Add useContext here!
import { createContext, useContext, useState, useEffect } from "react";
//creator of portal
const CartContext = createContext()

export const useCart = () => useContext(CartContext)

//transmitter of portal
export default function CartProvider({children}){

    const [cart, setCart] = useState(() => {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
        return JSON.parse(savedCart);
    }

    return [];

})
    

    useEffect(() => {
        const currentCart = JSON.stringify(cart)

        localStorage.setItem("cart", currentCart)

    }, [cart])
    

    const addToCart = (product) => {

        setCart((currentCart) => {

            const exists = currentCart.some(
                item => item.id === product.id
            )

            if (exists) {

                return currentCart.map((item) => {

                    if (item.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    }

                    return item
                })

            }

            else {

                return [
                    ...currentCart,
                    {
                        ...product,
                        quantity: 1
                    }
                ]

            }

        })

}

const increaseQuantity = (id) => {

    setCart((currentCart) => {

        return currentCart.map((item) => {

            if (item.id === id) {

                return {
                    ...item,
                    quantity: item.quantity + 1
                }

            }

            return item

        })

    })

}

const decreaseQuantity = (id) => {

    setCart((currentCart) => {

        const item = currentCart.find(item => item.id === id)

        if (item.quantity === 1) {

            return currentCart.filter(item => item.id !== id)

        }

        return currentCart.map((item) => {

            if (item.id === id) {

                return {
                    ...item,
                    quantity: item.quantity - 1
                }

            }

            return item

        })

    })

}

const removeFromCart = (id) => {

    setCart((currentCart) => {

            return currentCart.filter(item => item.id !== id)

        })

}


    return(
        <CartContext value={{cart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart}}>
            {children}
        </CartContext>
    )

   

}


