'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [cartLoading, setCartLoading] = useState(false)

    // Check authentication and user role on mount
    useEffect(() => {
        checkAuthStatus();
        fetchProductData();
    }, [])

    // Fetch cart when user logs in or out
    useEffect(() => {
        if (userData) {
            fetchCart();
        } else {
            setCartItems({});
        }
    }, [userData])

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            const userObj = JSON.parse(user);
            setUserData(userObj);
            setIsSeller(userObj.role === "admin" || userObj.role === "stuff");
        }
    }

    const fetchProductData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/v1/product/productlist?limit=1000');
            const data = await response.json();
            if (response.ok) {
                setProducts(data.products || []);
            } else {
                // Fallback to dummy data if API fails
                setProducts(productsDummyData);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts(productsDummyData);
        }
    }

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/v1/cart/cartlist', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Convert cart items to frontend format
                const items = {};
                if (data.cart && data.cart.items) {
                    data.cart.items.forEach(item => {
                        items[item.product._id] = item.quantity;
                    });
                }
                setCartItems(items);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    const addToCart = async (itemId, quantity = 1) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth');
                return false;
            }

            setCartLoading(true);
            const response = await fetch('http://localhost:5000/api/v1/cart/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productID: itemId, quantity })
            });

            if (response.ok) {
                await fetchCart(); // Refresh cart after adding item
                return true;
            } else {
                const errorData = await response.json();
                console.error('Error adding to cart:', errorData);
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            return false;
        } finally {
            setCartLoading(false);
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth');
                return false;
            }

            if (quantity === 0) {
                // Remove item from cart
                const response = await fetch('http://localhost:5000/api/v1/cart/delete', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productID: itemId })
                });

                if (response.ok) {
                    await fetchCart();
                    return true;
                }
            } else {
                // Update quantity
                const response = await fetch('http://localhost:5000/api/v1/cart/update', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productID: itemId, quantity })
                });

                if (response.ok) {
                    await fetchCart();
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error updating cart:', error);
            return false;
        }
    }

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const product = products.find(p => p._id === itemId);
            if (product && cartItems[itemId] > 0) {
                totalAmount += product.price * cartItems[itemId];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserData(false);
        setIsSeller(false);
        setCartItems({});
        router.push('/');
    }

    const value = {
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        setUserData,
        products,
        cartItems,
        cartLoading,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
        logout,
        checkAuthStatus,
        fetchCart
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}