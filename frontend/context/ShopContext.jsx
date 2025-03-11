// contexts/ShopContext.js
"use client";
import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeRateLoading, setExchangeRateLoading] = useState(true);
  const [exchangeRateError, setExchangeRateError] = useState(null);

  // Fetch Exchange Rate (Real-time with Trend)
  const fetchExchangeRate = useCallback(async () => {
    setExchangeRateLoading(true);
    setExchangeRateError(null);
    try {
      const response = await axios.get(
        "https://v6.exchangerate-api.com/v6/208006103b23b6e248b13e36/latest/USD"
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = response.data;
      if (data?.conversion_rates?.IDR) {
        const newRate = data.conversion_rates.IDR;
        setExchangeRate(newRate);
        localStorage.setItem("exchangeRate", newRate.toString());
      } else {
        throw new Error("Invalid exchange rate data");
      }
    } catch (err) {
      setExchangeRateError(err.message || "Failed to fetch exchange rate.");
      console.error("Exchange rate fetch error:", err);
    } finally {
      setExchangeRateLoading(false);
    }
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setProductsError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/product");
      if (response.status !== 200) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsError(
        error.response?.data?.message || "Failed to fetch products."
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch products.",
        { position: "top-right", className: "custom-toast" }
      );
    } finally {
    }
  }, []);

  // Delete Product
  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/product/${id}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete product");
      }
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }, []);

  // Fetch Product by ID
  const fetchProductById = useCallback(async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/${id}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      toast.error(error.response?.data?.message || "Failed to fetch product.", {
        position: "top-right",
        className: "custom-toast",
      });
      throw error;
    }
  }, []);

  // Update Product
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/product/${id}`,
        productData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Product updated successfully.", {
        position: "top-right",
        autoClose: 3000,
        className: "custom-toast",
      });
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.message || "Failed to update product.",
        { position: "top-right", className: "custom-toast" }
      );
      throw error; // Re-throw the error
    }
  }, []);

  // Add Product
  const addProduct = useCallback(async (productData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/product/add-product",
        productData
      );
      toast.success("Product added successfully!", {
        position: "top-right",
        autoClose: 3000,
        className: "custom-toast",
      });
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product.", {
        position: "top-right",
        className: "custom-toast",
      });
      throw error;
    }
  }, []);

  // Initial fetch and setup interval for exchange rate
  useEffect(() => {
    fetchExchangeRate();
    fetchProducts();
    const exchangeRateIntervalId = setInterval(() => {
      fetchExchangeRate();
    }, 60 * 1000); // Every 60 seconds
    return () => {
      clearInterval(exchangeRateIntervalId);
    };
  }, [fetchExchangeRate, fetchProducts]);

  return (
    <ShopContext.Provider
      value={{
        products,
        productsError,
        exchangeRate,
        exchangeRateLoading,
        exchangeRateError,
        fetchExchangeRate,
        fetchProducts,
        fetchProductById,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
