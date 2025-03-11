"use client";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./ProductDetailPage.module.css";

// Utility function untuk formatting harga
const formatPrice = (price, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(price);
};

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { fetchProductById, productsError } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    const getProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        setError(err.message || "Failed to fetch product.");
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [id, fetchProductById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || productsError) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212]">
        <p className="text-red-500">Error: {error || productsError}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#121212]">
        <p className="text-neutral-400">Product not found.</p>
      </div>
    );
  }

  const activeMedia =
    product.media && product.media.length > 0
      ? product.media[activeMediaIndex]
      : null;

  const renderMedia = (media, index) => {
    if (!media) return null;
    const mediaSrc = `data:${media.contentType};base64,${media.data}`;
    return media.contentType.startsWith("image") ? (
      <img
        key={index}
        src={mediaSrc}
        alt={product.name}
        className="w-full rounded-md"
      />
    ) : (
      <video
        key={index}
        autoPlay
        muted
        loop
        playsInline
        className="w-full rounded-md"
      >
        <source src={mediaSrc} type={media.contentType} />
      </video>
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-200 p-4 md:p-8">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-teal-500 hover:text-teal-400 transition-colors"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Grid dengan Proporsi 65% - 35% */}
      <div className="container mx-auto grid md:grid-cols-[65%_35%] gap-8">
        {/* Kolom Kiri (65%) */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
          {/* Media Utama */}
          <div className="mb-4">
            {activeMedia ? (
              renderMedia(activeMedia, activeMediaIndex)
            ) : (
              <div className="w-full h-64 bg-neutral-800 flex items-center justify-center rounded-2xl">
                <p className="text-gray-500">No media available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Media */}
          {product.media && product.media.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.media.map((media, index) => (
                <div
                  key={index}
                  className={`w-24 aspect-video md:w-32 rounded-md cursor-pointer ${
                    index === activeMediaIndex
                      ? "border-b-2 border-teal-500 rounded-none"
                      : ""
                  }`}
                  onClick={() => setActiveMediaIndex(index)}
                >
                  {renderMedia(media, index)}
                </div>
              ))}
            </div>
          )}

          {/* Detail Produk */}
          <h3 className="text-2xl font-bold mt-8">{product.name}</h3>
          <p className="border-b border-neutral-500 mb-3"></p>
          <p
            className={`${styles.description} text-neutral-400 text-sm`}
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></p>

          <p className="border-b border-neutral-500 my-3"></p>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-300">Price (USD):</span>
              <span className="text-neutral-100 font-bold">
                {formatPrice(product.priceUSD || 0, "en-US", "USD")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-300">Price (IDR):</span>
              <span className="text-neutral-100 font-bold">
                {formatPrice((product.priceUSD || 0) * 15000, "id-ID", "IDR")}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (35%) */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
          <div className="space-y-2">
            <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-400 transition-colors">
              Pay with Credit Card
            </button>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-400 transition-colors">
              Pay with PayPal
            </button>
            <button className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-400 transition-colors">
              Pay with Bank Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
