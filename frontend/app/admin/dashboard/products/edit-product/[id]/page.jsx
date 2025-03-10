// EditProductPage.jsx
"use client";
import MediaUploader from "@/components/1_admin/add-product/MediaUploader";
import { ArrowLeftRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [priceIDR, setPriceIDR] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [initialProductData, setInitialProductData] = useState(null);
  const [error, setError] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const { id } = useParams();
  const router = useRouter();

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

  // Fetch product data
  const fetchProductData = useCallback(async () => {
    setLoadingProduct(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/product/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }
      const productData = await response.json();

      setInitialProductData(productData);
      setProductName(productData.name);
      setDescription(productData.description);
      setPriceUSD(productData.priceUSD);
      setPriceIDR(
        `Rp ${parseInt(productData.priceIDR).toLocaleString("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      );

      const initialMediaFiles = await Promise.all(
        productData.media.map(async (mediaItem) => {
          const blob = await fetch(
            `data:${mediaItem.contentType};base64,${mediaItem.data}`
          ).then((res) => res.blob());
          const file = new File(
            [blob],
            `image.${mediaItem.contentType.split("/")[1]}`,
            { type: mediaItem.contentType }
          );
          return { original: file, cropped: file };
        })
      );
      setMediaFiles(initialMediaFiles);
    } catch (err) {
      setError(err.message || "Failed to fetch product.");
      console.error("Product fetch error:", err);
    } finally {
      setLoadingProduct(false);
    }
  }, [id]);

  // Fungsi untuk memeriksa apakah ada perubahan pada form
  const hasChanges = () => {
    if (!initialProductData) return false;
    return (
      productName.trim() !== initialProductData.name ||
      description.trim() !== initialProductData.description ||
      parseFloat(priceUSD) !== parseFloat(initialProductData.priceUSD) ||
      String(priceIDR).replace(/[^0-9]/g, "") !==
        String(initialProductData.priceIDR).replace(/[^0-9]/g, "") ||
      mediaFiles.length !== initialProductData.media.length
    );
  };

  useEffect(() => {
    fetchExchangeRate();
    fetchProductData();
  }, [fetchExchangeRate, fetchProductData]);

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
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mediaBase64 = await Promise.all(
        mediaFiles.map(async (file) => {
          const fileToConvert = file.cropped || file.original;
          const base64Data = await convertFileToBase64(fileToConvert);
          return {
            data: base64Data.split(",")[1],
            contentType: fileToConvert.type,
          };
        })
      );

      const productData = {
        name: productName,
        description,
        priceUSD,
        priceIDR: priceIDR.replace(/[^0-9]/g, ""),
        media: mediaBase64,
      };

      const response = await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product.");
      }

      alert("Product updated successfully!");
      router.push("/admin/dashboard/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Failed to update product: ${error.message}`);
    }
  };

  const isFormComplete =
    productName.trim() !== "" &&
    description.trim() !== "" &&
    isPriceValid() &&
    mediaFiles.length > 0 &&
    exchangeRate !== null &&
    hasChanges();

  if (loadingRate || loadingProduct) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="text-neutral-200">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
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
              Update Product
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
