"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShopContext } from "@/context/ShopContext";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./ProductDetailPage.module.css";
import ShinyText from "@/components/text/ShinyText";
import { FaArrowRight, FaCircle } from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";


const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { fetchProductById, productsError } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // --- Price Handling (moved to the top) ---
  const formatPriceIDR = useCallback((price) => {
    const numericValue = parseInt(price, 10);
    return isNaN(numericValue)
      ? ""
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(numericValue);
  }, []);

  // Get and format the price (moved to the top, uses formatPriceIDR)
  const getPriceIDR = useCallback(() => {
    if (product && product.priceIDR !== undefined) {
      return formatPriceIDR(product.priceIDR);
    }
    return formatPriceIDR(0); // Default to Rp 0 if price is missing
  }, [product, formatPriceIDR]); // Add formatPriceIDR to dependency array

  const getPriceNumber = useCallback(() => {
    if (product && product.priceIDR !== undefined) {
      return product.priceIDR;
    }
    return 0;
  }, [product]);

  const handlePaymentMethodClick = useCallback(
    (method) => {
      setPaymentMethod((prevMethod) => (prevMethod === method ? "" : method));
    },
    [setPaymentMethod]
  );

  const handleCheckout = useCallback(() => {
    if (!email || !paymentMethod) {
      toast.error("Please enter your email and select a payment method.");
      return;
    }

    console.log("Checkout:", {
      email,
      paymentMethod,
      product,
      currency: "IDR",
      price: getPriceNumber(),
    });
    alert(
      `Checkout initiated! Email: ${email}, Payment Method: ${paymentMethod}, Price: ${getPriceIDR()}, Product: ${
        product.name
      }`
    );
  }, [email, paymentMethod, product, getPriceIDR, getPriceNumber]);

  useEffect(() => {
    const getProduct = async () => {
      if (!id) return;
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
      <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
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

  const activeMedia =
    product.media && product.media.length > 0
      ? product.media[activeMediaIndex]
      : null;

  return (
    <div className="min-h-screen bg-[#121212] text-neutral-200">
      <div className="container mx-auto py-12">
        {/* Header and Back Button */}
        <div className="mb-6 flex items-start space-x-2">
          <IoIosArrowBack
            className="w-7 h-7 cursor-pointer text-neutral-400 hover:text-neutral-200"
            onClick={() => window.history.back()}
          />
          <ShinyText
            text="Product Details"
            speed={3}
            className="tracking-widest text-white/60 font-bold text-3xl"
          />
        </div>

        <div className="mx-auto flex flex-col md:flex-row gap-8">
          {/* Product Details Column */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg md:flex-[2]">
            {/* Media */}
            <div className="mb-4">
              {activeMedia ? (
                renderMedia(activeMedia, activeMediaIndex)
              ) : (
                <div className="w-full h-64 bg-neutral-800 flex items-center justify-center rounded-2xl">
                  <p className="text-gray-500">No media available</p>
                </div>
              )}
            </div>
            {/* Media Thumbnails */}
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

            {/* Product Title and Description */}
            <h3 className="text-2xl font-bold mt-8">{product.name}</h3>
            <p className="border-b border-neutral-500 mb-3 mt-1"></p>
            <p
              className={`${styles.description} text-neutral-400 text-sm`}
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></p>
          </div>

          {/* Payment and Checkout Column */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-lg md:flex-[1] md:self-start">
            <h4 className="text-lg font-semibold mb-4">Checkout Details</h4>

            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 block w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded-md text-sm shadow-sm placeholder-neutral-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Total Price (IDR) */}
            <div className="mb-4">
              <p className="text-sm text-neutral-300">Total:</p>
              <p className="text-lg font-bold">{getPriceIDR()}</p>{" "}
              {/* Use getPriceIDR */}
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Payment Method
              </label>
              <div className="space-y-4">
                {[
                  {
                    method: "QRIS",
                    label: "QRIS",
                    logo: "/assets/qris-logo.png",
                  },
                  { method: "BCA", label: "BCA", logo: "/assets/bca.png" },
                  { method: "BNI", label: "BNI", logo: "/assets/bni.png" },
                  {
                    method: "Mandiri",
                    label: "Mandiri",
                    logo: "/assets/mandiri.png",
                  },
                  {
                    method: "DANA",
                    label: "DANA",
                    logo: "/assets/mandiri.png",
                  },
                  {
                    method: "Gopay",
                    label: "Gopay",
                    logo: "/assets/mandiri.png",
                  },
                ].map((item) => (
                  <div
                    key={item.method}
                    className={`flex items-center rounded-lg border  ${
                      paymentMethod === item.method
                        ? "border-teal-500 bg-neutral-800"
                        : "border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
                    }  transition-colors cursor-pointer`}
                    onClick={() => handlePaymentMethodClick(item.method)}
                  >
                    <div className="p-3 ">
                      {paymentMethod === item.method ? (
                        <FaCircle className="text-teal-500 w-2" />
                      ) : (
                        <FaCircle className="text-neutral-700 w-2" />
                      )}
                    </div>
                    <div className="flex-grow flex items-center justify-between p-2">
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={`${item.label} Logo`}
                          width={70}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 transition-colors"
            >
              Checkout
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
