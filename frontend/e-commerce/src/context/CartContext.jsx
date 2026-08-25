import { createContext, useContext, useState, useEffect } from "react";
import { useLogin } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {
    const { access } = useLogin();

    const [cart, setCart] = useState([]);

    // Get cart from backend
    useEffect(() => {
        if (!access) {
            setCart([]);
            return;
        }

        const fetchCart = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/cart/",
                    {
                        headers: {
                            Authorization: `Bearer ${access}`,
                        },
                        credentials: "include",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch cart");
                }

                const data = await response.json();

                const formattedCart = data.map((item) => ({
                    id: item.product.id,
                    cartItemId: item.id,
                    name: item.product.name,
                    discounted_price: item.product.discounted_price,
                    image: item.product.image,
                    slug: item.product.slug,
                    quantity: item.quantity,
                }));

                setCart(formattedCart);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };

        fetchCart();
    }, [access]);

    const addToCart = async (product) => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/add-to-cart/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        product_id: product.id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setCart((currentCart) => {
                const exists = currentCart.some(
                    (item) => item.id === product.id
                );

                if (exists) {
                    return currentCart.map((item) => {
                        if (item.id === product.id) {
                            return {
                                ...item,
                                cartItemId: data.cart_item_id,
                                quantity: data.quantity,
                            };
                        }

                        return item;
                    });
                }

                return [
                    ...currentCart,
                    {
                        ...product,
                        quantity: data.quantity,
                        cartItemId: data.cart_item_id,
                    },
                ];
            });
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    };

    const increaseQuantity = async (id) => {
        const item = cart.find((item) => item.id === id);

        if (!item) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/cart-item/${item.cartItemId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        quantity: item.quantity + 1,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setCart((currentCart) =>
                currentCart.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            quantity: data.quantity,
                        };
                    }

                    return item;
                })
            );
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (id) => {
        const item = cart.find((item) => item.id === id);

        if (!item) return;

        if (item.quantity === 1) {
            await removeFromCart(id);
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/cart-item/${item.cartItemId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${access}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        quantity: item.quantity - 1,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setCart((currentCart) =>
                currentCart.map((item) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            quantity: data.quantity,
                        };
                    }

                    return item;
                })
            );
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const removeFromCart = async (id) => {
        const item = cart.find((item) => item.id === id);

        if (!item) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/cart-item/${item.cartItemId}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${access}`,
                    },
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            setCart((currentCart) =>
                currentCart.filter((item) => item.id !== id)
            );
        } catch (error) {
            console.error("Error removing cart item:", error);
        }
    };

    const clearCart = () => {
    setCart([])
    }

    return (
        <CartContext
            value={{
                cart,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext>
    );
}