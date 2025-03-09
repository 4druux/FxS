// AddProductPage.jsx (Revised handleSubmit)
"use client";
import MediaUploader from "@/components/1_admin/add-product/MediaUploader";
import { ArrowLeftRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios"; // Import axios

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [priceIDR, setPriceIDR] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [error, setError] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const fetchExchangeRate = useCallback(async () => {
    setLoadingRate(true);
    setError(null);
    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/208006103b23b6e248b13e36/latest/USD"
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      const data = await response.json();
      if (data?.conversion_rates?.IDR) {
        setExchangeRate(data.conversion_rates.IDR);
      } else {
        throw new Error("Invalid exchange rate data");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch exchange rate.");
      console.error("Exchange rate fetch error:", err);
    } finally {
      setLoadingRate(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  const convertUsdToIdr = useCallback(() => {
    if (exchangeRate === null) return;
    const numericUSD = parseFloat(priceUSD) || 0;
    if (isNaN(numericUSD)) {
      setPriceIDR("");
      return;
    }
    const convertedIDR = numericUSD * exchangeRate;
    setPriceIDR(
      `Rp ${convertedIDR.toLocaleString("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`
    );
  }, [priceUSD, exchangeRate]);

  useEffect(() => {
    convertUsdToIdr();
  }, [convertUsdToIdr]);

  const handlePriceChange = useCallback((e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }
    if (parts[1]?.length > 2) {
      value = parts[0] + "." + parts[1].slice(0, 2);
    }
    setPriceUSD(value);
  }, []);

  const formatPriceUSD = useCallback(() => {
    if (!priceUSD) return "$ 0.00";
    const numericValue = parseFloat(priceUSD);
    if (isNaN(numericValue)) {
      return "$ 0.00";
    }
    return numericValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }, [priceUSD]);

  const isPriceValid = () => {
    const numericUSD = parseFloat(priceUSD) || 0;
    return numericUSD >= 0.01;
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        // Added null check here as well, for extra safety
        resolve(null); // Resolve with null for consistency
        return;
      }
      if (!(file instanceof Blob)) {
        reject(new Error("Invalid file type")); // Keep the Blob check
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Improved isFormComplete to check for cropped images
  const isFormComplete =
    productName.trim() !== "" &&
    description.trim() !== "" &&
    isPriceValid() &&
    mediaFiles.length > 0 &&
    mediaFiles.every((file) => file.cropped !== null) && // Ensure all files are cropped
    exchangeRate !== null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    try {
      const mediaBase64 = await Promise.all(
        mediaFiles
          .filter((file) => file.cropped !== null)
          .map(async (file) => {
            const base64Data = await convertFileToBase64(file.cropped);
            return {
              data: base64Data.split(",")[1],
              contentType: file.cropped.type,
            };
          })
      );

      // Filter out any potential null values (extra safety)
      const filteredMediaBase64 = mediaBase64.filter((item) => item !== null);

      const productData = {
        name: productName,
        description,
        priceUSD,
        priceIDR: priceIDR.replace(/[^0-9]/g, ""), // Remove non-numeric characters
        media: filteredMediaBase64,
      };

      // Use axios.post instead of fetch
      const response = await axios.post(
        "http://localhost:5000/api/product/add-product",
        productData
      );

      // Axios automatically throws an error for non-2xx responses
      // so we don't need to check response.ok manually

      alert("Product added successfully!");
      window.location.href = "/admin/dashboard/products";
    } catch (error) {
      console.error("Error adding product:", error);
      // Check if the error is an Axios error
      if (axios.isAxiosError(error)) {
        // Access the response data
        if (error.response) {
          console.error("Server responded with:", error.response.data);
          alert(
            `Failed to add product: ${
              error.response.data.message || "Unknown server error"
            }`
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
          alert("Failed to add product: No response from server");
        } else {
          // Something happened in setting up the request
          console.error("Error setting up request:", error.message);
          alert("Failed to add product: Error setting up request");
        }
      } else {
        // Handle non-Axios errors
        alert(`Failed to add product: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Set loading state to false in finally block
    }
  };

  if (loadingRate) {
    return <div className="text-white">Loading exchange rates...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div className="text-white">Adding product...</div>;
  }

  return (
    <div className="text-neutral-200">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 p-4 sm:p-6 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Upload Image / GIF / Video
            </label>
            <MediaUploader
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-400">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder-neutral-500 placeholder:text-xs"
              placeholder="Your product name"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-400 mb-1">
              Description
            </label>
            <div className="rounded-lg border border-neutral-700 overflow-hidden placeholder-neutral-500 placeholder:text-xs">
              <ReactQuill
                value={description}
                onChange={setDescription}
                theme="snow"
                className="quill-dark"
                placeholder="Your product description..."
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-neutral-400">
                Price (USD){" "}
                <span className="text-xs text-neutral-200">
                  {formatPriceUSD()}
                </span>
              </label>
              <input
                type="text"
                value={priceUSD}
                onChange={handlePriceChange}
                className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder-neutral-500 placeholder:text-xs"
                placeholder="Your product price in USD"
              />
            </div>
            <div className="mt-0 md:mt-4">
              <ArrowLeftRight size={16} className="text-neutral-500" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-neutral-400">
                Price (IDR)
              </label>
              <input
                type="text"
                value={priceIDR}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-500 placeholder-neutral-500 placeholder:text-xs"
              />
            </div>
          </div>
          <div className="col-span-2 flex justify-end space-x-2 sm:space-x-4 mt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 hover:scale-[1.01] transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isFormComplete || isLoading}
              className={`px-8 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 transition ${
                isFormComplete && !isLoading
                  ? "bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-[1.01]"
                  : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
      <div className="h-6"></div>
      {/* Custom Styling untuk Quill di Dark Mode */}
      <style jsx global>{`
        .quill-dark .ql-toolbar {
          background-color: #262626;
          border-color: #3f3f3f;
          color: #e5e5e5;
        }
        .quill-dark .ql-container {
          background-color: #1f1f1f;
          border-color: #3f3f3f;
          color: #e5e5e5;
          min-height: 150px;
        }
        .quill-dark .ql-editor {
          color: #e5e5e5;
        }
        .quill-dark .ql-stroke {
          stroke: #e5e5e5;
        }
        .quill-dark .ql-editor::before {
          color: #a3a3a3;
          opacity: 0.7;
          font-size: 0.75rem;
        }
        .quill-dark .ql-fill {
          fill: #e5e5e5;
        }
      `}</style>
    </div>
  );
}
