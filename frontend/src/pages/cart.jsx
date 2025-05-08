import { createContext, useState, useContext } from "react";

const Cart = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setCartOpen] = useState(false);

    const addToCart = (item) => {
        setCartItems((prev) => [...prev, item]);
    };

    const toggleCart = () => setCartOpen((prev) => !prev);
    const closeCart = () => setCartOpen(false);

    return (
        <Cart.Provider value={{ cartItems, addToCart, isCartOpen, toggleCart, closeCart }}>
        {children}
        </Cart.Provider>
    );
};

export const useCart = () => useContext(Cart);