// context/ShopContext.js
"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom"; // Hapus ini
import { useRouter } from "next/navigation"; // Import useRouter
// import io from "socket.io-client";

export const ShopContext = createContext(null); // Inisialisasi dengan null

// const socket = io("http://localhost:5173");

const ShopContextProvider = ({ children }) => {
  // Gunakan object destructuring untuk children
  const currency = "Rp";
  const delivery_fee = 2500;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [orders, setOrders] = useState([]);
  // const navigate = useNavigate(); // Hapus ini
  const router = useRouter(); // Gunakan useRouter

  const fetchCartData = useCallback(async (token) => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend-ebon-six.vercel.app/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCartItems(response.data.items);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
        toast.error("Session expired. Please log in again.");
        // navigate("/login"); // Ganti dengan:
        window.location.href = "/login"; // Atau router.push("/login");
      } else {
        toast.error("Failed to load cart data.");
      }
    }
  }, []); // Hapus navigate dari dependency array

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      toast.error("No token found. Please log in again.");
      // navigate(userRole === "admin" ? "/login" : "/login"); // Ganti dengan:
      window.location.href = userRole === "admin" ? "/login" : "/login";
      return;
    }

    try {
      const responseUser = await axios.get(
        "https://ecommerce-backend-ebon-six.vercel.app/api/user/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const role = responseUser.data.role;
      const endpoint =
        role === "admin"
          ? "https://ecommerce-backend-ebon-six.vercel.app/api/orders"
          : "https://ecommerce-backend-ebon-six.vercel.app/api/orders/user-orders";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
        // navigate(userRole === "admin" ? "/login" : "/login"); // Ganti dengan:
        window.location.href = userRole === "admin" ? "/login" : "/login";
      } else {
        toast.error("Failed to load orders.");
      }
    }
  }, []); // Hapus navigate dari dependency array

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    const checkSessionExpiration = () => {
      const currentTime = new Date().getTime();
      if (tokenExpiration && currentTime > tokenExpiration) {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("tokenExpiration");
        toast.error("Session expired. Please log in again.");
        // navigate(userRole === "admin" ? "/login" : "/login"); // Ganti dengan:
        window.location.href = userRole === "admin" ? "/login" : "/login";
      }
    };

    if (token) {
      setIsLoggedIn(true);
      fetchCartData(token);
      fetchOrders();
      fetchProducts();
      // Pengecekan token setiap 60 detik
      const intervalId = setInterval(checkSessionExpiration, 60000);
      return () => clearInterval(intervalId);
    } else {
      setIsLoggedIn(false);
      setCartItems([]);
    }
    fetchProducts();
  }, [fetchCartData, fetchOrders]); // Hapus navigate

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://ecommerce-backend-ebon-six.vercel.app/api/products/all"
      );
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        console.error("Unexpected response status:", response.status);
        toast.error("Failed to load products. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.");
    }
  };

  // CheckOut.jsx || EditItem.jsx || Product.jsx || ProductItem.jsx
  const fetchProductsById = async (productId) => {
    const existingProduct = products.find(
      (product) => product._id === productId
    );
    if (!existingProduct) {
      return null;
    }
    try {
      const response = await axios.get(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product details", error);
      return null;
    }
  };

  // Product.jsx
  const addToCart = async (itemId, size, price, name, quantity = 1) => {
    if (!isLoggedIn) {
      // navigate("/login"); // Ganti dengan:
      window.location.href = "/login";
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      const cartResponse = await axios.get(
        "https://ecommerce-backend-ebon-six.vercel.app/api/cart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const cartItems = cartResponse.data.items;
      const existingItem = cartItems.find(
        (item) => item.productId === itemId && item.size === size
      );

      let response;
      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;
        response = await axios.post(
          "https://ecommerce-backend-ebon-six.vercel.app/api/cart/update",
          {
            productId: itemId,
            size,
            quantity: updatedQuantity,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data.items);
      } else {
        const productResponse = await axios.get(
          `https://ecommerce-backend-ebon-six.vercel.app/api/products/${itemId}`
        );
        const product = productResponse.data;
        const imageUrl =
          product.image && product.image.length > 0
            ? product.image[0]
            : "/placeholder-image.png";
        const dataToSend = {
          productId: itemId,
          size,
          price,
          quantity,
          name,
          imageUrl,
        };
        // Tambahkan ke keranjang
        response = await axios.post(
          "https://ecommerce-backend-ebon-six.vercel.app/api/cart/add",
          dataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data.items);
      }
      return true;
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      if (error.response) {
        console.error("Server error:", error.response.data);
      } else if (error.request) {
        console.error("Network error");
      } else {
        console.error("Unexpected error");
      }
      return false;
    }
  };

  // Cart.jsx
  const updateQuantity = async (itemId, size, quantity) => {
    if (!isLoggedIn) {
      // navigate("/login"); // Ganti dengan:
      window.location.href = "/login";
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://ecommerce-backend-ebon-six.vercel.app/api/cart/update",
        { productId: itemId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      toast.error("Failed to update cart quantity.");
    }
  };

  // Cart.jsx
  const removeFromCart = async (itemId, size) => {
    if (!isLoggedIn) {
      // navigate("/login"); // Ganti dengan:
      window.location.href = "/login";
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://ecommerce-backend-ebon-six.vercel.app/api/cart/remove",
        { productId: itemId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data.items);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  // Payment.jsx
  const handlePayment = async (paymentData, onSuccess, onError) => {
    try {
      const token = localStorage.getItem("authToken");
      // Proses checkout
      const response = await axios.post(
        "https://ecommerce-backend-ebon-six.vercel.app/api/cart/checkout",
        paymentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        // Update soldCount untuk setiap produk yang dibeli
        for (const item of paymentData.selectedItems) {
          try {
            // Kirim permintaan untuk memperbarui soldCount produk
            const updateSoldCountResponse = await axios.post(
              `https://ecommerce-backend-ebon-six.vercel.app/api/products/${item._id}/sell`, // Pastikan API endpoint sesuai
              { quantity: item.quantity },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (updateSoldCountResponse.status !== 200) {
              console.error(
                `Failed to update soldCount for product: ${item._id}`
              );
            }
          } catch (error) {
            console.error(
              `Error updating soldCount for product ${item._id}:`,
              error
            );
          }
        }

        // Hapus item dari keranjang setelah pembayaran berhasil
        for (const item of paymentData.selectedItems) {
          await axios.post(
            "https://ecommerce-backend-ebon-six.vercel.app/api/cart/remove",
            {
              productId: item._id,
              size: item.size,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
        if (onSuccess) {
          onSuccess(); // Panggil callback onSuccess
        }
      } else {
        console.error("Payment failed with status:", response.status);
        if (onError) {
          onError(); // Panggil callback onError
        }
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      if (onError) {
        onError(); // Panggil callback onError
      }
    }
  };

  // UserOrders.jsx
  const submitReview = async (formData, currentOrderForReview) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/${currentOrderForReview.items[0].productId}/review`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        await updateOrderStatus(currentOrderForReview._id, "Completed");
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("An error occurred while submitting the review.");
    }
  };

  const submitReturn = async (currentOrderForReturn, formData) => {
    const token = localStorage.getItem("authToken");
    try {
      // Dapatkan productId dan size dari item yang akan di-return
      const productToReturn = currentOrderForReturn.items[0]; // Misalkan hanya satu item

      // Kirim request return ke backend
      const response = await axios.post(
        `https://ecommerce-backend-ebon-six.vercel.app/api/orders/${currentOrderForReturn._id}/return`,
        {
          reason: formData.reason,
          description: formData.description || "", // Optional description
          returnImages: formData.returnImages || [], // Array gambar return (jika ada)
          productId: productToReturn.productId,
          size: productToReturn.size,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        toast.error("Failed to submit return request.");
        throw new Error("Return submission failed");
      }
    } catch (error) {
      console.error("Failed to submit return:", error);
      // Gunakan pesan error dari backend jika tersedia
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while submitting the return request.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateReturnStatus = async (orderId, returnData) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.put(
        `https://ecommerce-backend-ebon-six.vercel.app/api/orders/return-status`,
        {
          orderId,
          ...returnData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update return status:", error);
      throw error;
    }
  };

  // Orders.jsx || UserOrders.jsx
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "https://ecommerce-backend-ebon-six.vercel.app/api/orders/status",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Emit event to notify about the status update
      // socket.emit("orderUpdated", { orderId, status: newStatus });

      // Fetch ulang pesanan setelah status diperbarui
      fetchOrders();
      // toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };

  // UserOrders.jsx
  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "https://ecommerce-backend-ebon-six.vercel.app/api/orders/status",
        { orderId, status: "Canceled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Emit event to notify about the cancelation
      // socket.emit("orderUpdated", { orderId, status: "Canceled" });
      fetchOrders();
    } catch (error) {
      toast.error("Failed to cancel order."), error;
    }
  };

  // Orders.jsx
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://ecommerce-backend-ebon-six.vercel.app/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Emit event to notify about the deletion
      // socket.emit("orderDeleted", { orderId });
      fetchOrders();
      toast.success("Order berhasil dihapus!");
    } catch (error) {
      console.error("Error menghapus order:", error);
      toast.error("Gagal menghapus order.");
    }
  };

  // ListItem.jsx
  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  // EditItem.jsx
  

  // ReviewItem.jsx
  const fetchProductAndReviews = async (productId) => {
    const token = localStorage.getItem("authToken");
    try {
      const productResponse = await axios.get(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const reviewResponse = await axios.get(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/admin/${productId}/reviews`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return {
        product: productResponse.data,
        reviews: reviewResponse.data.reviews || [],
      };
    } catch (error) {
      console.error("Gagal mendapatkan data produk atau ulasan", error);
      toast.error("Gagal mendapatkan data produk atau ulasan");
      return { product: null, reviews: [] };
    }
  };

  // ReviewItem.jsx
  const submitReplyToReview = async (productId, reviewId, replyText) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.put(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/admin/${productId}/reviews/${reviewId}/reply`,
        { adminReply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Gagal mengirim balasan", error);
      toast.error("Gagal mengirim balasan");
    }
  };

  // ReviewItem.jsx
  const deleteReview = async (productId, reviewId) => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `https://ecommerce-backend-ebon-six.vercel.app/api/products/admin/${productId}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Gagal menghapus ulasan", error);
      toast.error("Gagal menghapus ulasan");
    }
  };

  const saveOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getCartAmount = () => {
    return cartItems.reduce((acc, item) => {
      const product = products.find(
        (product) => product._id === item.productId
      );
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const loginUser = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    fetchCartData(token);
    fetchOrders();
    // toast.success("Login successful!");
  };

  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setCartItems([]);
    setOrders([]);
    // toast.success("Logout successful!");
    // navigate("/login"); // Ganti dengan:
    window.location.href = "/login"; // Atau router.push("/login");
  };

  const value = {
    products,
    fetchProductsById,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartCount,
    getCartAmount,
    isLoggedIn,
    loginUser,
    logoutUser,
    // navigate, // Hapus navigate
    router, // Tambahkan router
    orders,
    setOrders,
    saveOrder,
    updateOrderStatus,
    fetchOrders,
    cancelOrder,
    deleteOrder,
    fetchCartData,
    handlePayment,
    deleteProduct,
    updateProduct,
    fetchProductAndReviews,
    submitReplyToReview,
    deleteReview,
    submitReview,
    submitReturn,
    updateReturnStatus,
    isModalLogin,
    setIsModalLogin,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};



export default ShopContextProvider;
