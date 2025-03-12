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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ShopContext.Provider
      value={{
        products,
        productsError,
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
