// contexts/ShopContext.js
"use client";
import { createContext, useContext, useCallback } from "react";

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const updateProduct = useCallback(async (id, productData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product.");
      }

      return await response.json(); // Return success data
    } catch (error) {
      console.error("Error updating product:", error); // Log the error
      throw error; // Re-throw for component handling
    }
  }, []);

  const contextValue = {
    updateProduct,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};
