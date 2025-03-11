// AddProductPage.jsx
"use client";

import MediaUploader from "@/components/1_admin/add-product/MediaUploader";
import { ArrowLeftRight } from "lucide-react";
import { useState, useEffect, useCallback, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ShopContext } from "@/context/ShopContext";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  // --- State ---
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [priceIDR, setPriceIDR] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Context & Hooks ---
  const {
    exchangeRate,
    exchangeRateLoading,
    exchangeRateError,
    addProduct, // Get addProduct from context
  } = useContext(ShopContext);
  const router = useRouter();

  // --- Helper Functions ---

  // Format USD price
  const formatPriceUSD = useCallback(() => {
    if (!priceUSD) return "$ 0.00";
    const numericValue = parseFloat(priceUSD);
    return isNaN(numericValue)
      ? "$ 0.00"
      : numericValue.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
  }, [priceUSD]);

  // Format IDR Price
  const formatPriceIDR = (price) => {
    return `Rp ${parseInt(price).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  // Convert USD to IDR
  const convertUsdToIdr = useCallback(() => {
    if (exchangeRate === null) return;
    const numericUSD = parseFloat(priceUSD) || 0;
    if (isNaN(numericUSD)) {
      setPriceIDR("");
      return;
    }
    const convertedIDR = numericUSD * exchangeRate;
    setPriceIDR(formatPriceIDR(convertedIDR));
  }, [priceUSD, exchangeRate]);

  useEffect(() => {
    convertUsdToIdr();
  }, [convertUsdToIdr]);

  // Sanitize and validate USD price input
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

  // Check if the USD price is valid
  const isPriceValid = () => {
    const numericUSD = parseFloat(priceUSD) || 0;
    return numericUSD >= 0.01;
  };

  // Convert a File object to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      if (!(file instanceof Blob)) {
        reject(new Error("Invalid file type"));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // --- Form Completion Check ---
  const isFormComplete =
    productName.trim() !== "" &&
    description.trim() !== "" &&
    isPriceValid() &&
    mediaFiles.length > 0 &&
    mediaFiles.every((file) => file.cropped !== null) &&
    exchangeRate !== null;

  // --- Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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

      const filteredMediaBase64 = mediaBase64.filter((item) => item !== null);

      const productData = {
        name: productName,
        description,
        priceUSD,
        priceIDR: priceIDR.replace(/[^0-9]/g, ""),
        media: filteredMediaBase64,
      };

      // Use the addProduct function from the context
      await addProduct(productData);
      router.push("/admin/dashboard/products"); // Redirect using next/navigation
    } catch (error) {
      console.error("Error adding product:", error);
      //Error handling has been moved to context
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="text-neutral-200">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 p-4 sm:p-6 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Media Uploader */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Upload Image / GIF / Video
            </label>
            <MediaUploader
              mediaFiles={mediaFiles}
              setMediaFiles={setMediaFiles}
            />
          </div>

          {/* Product Name */}
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

          {/* Description */}
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

          {/* Price Input Fields */}
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

          {/* Form Buttons */}
          <div className="col-span-2 flex justify-end space-x-2 sm:space-x-4 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 hover:scale-[1.01] transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!isFormComplete}
              className={`px-8 py-2 text-sm sm:text-md sm:py-3 rounded-full border border-neutral-700 transition ${
                isFormComplete
                  ? "bg-neutral-800 text-white hover:bg-neutral-700 hover:scale-[1.01]"
                  : "bg-neutral-700 text-neutral-500 cursor-not-allowed"
              }`}
            >
              Add Product
            </button>
          </div>
        </div>
      </form>

      <div className="h-6"></div>

      {exchangeRateLoading ||
        (isLoading && (
          <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
          </div>
        ))}

      {exchangeRateError && (
        <div className="text-red-500">Error: {exchangeRateError}</div>
      )}

      {/* Custom Styling for Quill in Dark Mode */}
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
