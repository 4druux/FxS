// AllProductsPage.jsx
"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Star,
  SquarePen,
  ClipboardList,
  Trash2,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPaginate from "react-paginate";
import SweetAlert from "@/components/ui/SweetAlert";
import { ShopContext } from "@/context/ShopContext"; // Import ShopContext

function AllProductsPage() {
  // --- Context ---
  const { products, productsError, fetchProducts, deleteProduct } =
    useContext(ShopContext); // Removed exchangeRate
  const router = useRouter();

  // --- State ---
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [isDropdownSortOpen, setIsDropdownSortOpen] = useState(false);
  const [sortType, setSortType] = useState("date-desc");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isOverlay, setIsOverlay] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  // --- Refs ---
  const dropdownSortRef = useRef(null);

  // --- Data Fetching (using context) ---
  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true); // No longer needed here, set in initial state
      try {
        await fetchProducts();
      } catch (error) {
        console.error("Error fetching products in component:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchProducts]);

  // --- Animation Variants (Framer Motion) --- (No changes here)
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const inputVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: { width: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  // --- Event Handlers --- (No changes here)
  const handleClearSearch = () => {
    setSearch("");
  };

  const handleEdit = (productId) => {
    router.push(`/admin/dashboard/products/edit-product/${productId}`);
  };

  const handleDelete = async (id) => {
    setIsOverlay(true);
    const confirmed = await SweetAlert({
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this product?",
      icon: "warning",
    });
    setIsOverlay(false);

    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteProduct(id); // Use deleteProduct from context
        setIsOverlay(true);
        await SweetAlert({
          title: "Success",
          message: "Product deleted successfully.",
          icon: "success",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        await SweetAlert({
          title: "Error",
          message: "An error occurred while deleting the product.",
          icon: "error",
        });
      } finally {
        setIsDeleting(false);
        setIsOverlay(false);
      }
    }
  };

  useEffect(() => {
    if (isDeleting || isOverlay) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDeleting, isOverlay]);

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setIsDropdownSortOpen(false);
    setCurrentPage(0); // Reset to the first page on sort change
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // --- Computed Values ---
  // 1. Apply Search Filtering
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  // 2. Apply Sorting (using priceIDR and createdAt/date)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "price-asc") {
      return a.priceIDR - b.priceIDR; // Sort by priceIDR
    } else if (sortType === "price-desc") {
      return b.priceIDR - a.priceIDR; // Sort by priceIDR
    } else if (sortType === "date-asc") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortType === "date-desc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // 3. Apply Pagination
  const offset = currentPage * productsPerPage;
  const currentProducts = sortedProducts.slice(
    offset,
    offset + productsPerPage
  );

  // --- Options ---
  const sortOptions = [
    {
      value: "date-desc",
      label: "Newest",
    },
    {
      value: "date-asc",
      label: "Oldest",
    },
    {
      value: "price-asc",
      label: "Low to High",
    },
    {
      value: "price-desc",
      label: "High to Low",
    },
  ];

  // Format IDR Price (Handles null/undefined)
  const formatPriceIDR = (price) => {
    if (price === null || price === undefined) {
      return "N/A"; // Or any other suitable placeholder
    }
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  // --- Close dropdown when clicking outside --- (No changes here)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownSortRef.current &&
        !dropdownSortRef.current.contains(event.target)
      ) {
        setIsDropdownSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- JSX Rendering ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="p-4 bg-[#121212] min-h-screen flex justify-center items-center text-red-500">
        Error: {productsError}
      </div>
    );
  }

  // If not loading and no error, render the content
  return (
    <div className="bg-[#121212] min-h-screen text-neutral-200">
      {/* Header and Search */}
      <h1 className="sm:mb-12 mb-4 text-2xl font-bold">Product Management</h1>

      {/*  Sort */}
      <div className="flex flex-col-reverse gap-4 md:gap-0 md:flex-row justify-end items-end md:items-center mb-6 space-x-4">
        <button
          onClick={() => router.push("/admin/dashboard/products/add-product")}
          className="flex items-center space-x-1 px-4 py-2 border rounded-full bg-neutral-900 border-neutral-700 hover:border-neutral-500 transition-colors group"
        >
          <Plus className="text-neutral-500 group-hover:text-neutral-300 w-4 md:w-5" />
          <span className="text-xs md:text-sm mt-1 text-neutral-500 group-hover:text-neutral-300">
            Add Product
          </span>
        </button>

        <div className="flex space-x-4">
          {/* Sort Dropdown */}
          <div className="relative" ref={dropdownSortRef}>
            <motion.div
              onClick={() => setIsDropdownSortOpen(!isDropdownSortOpen)}
              whileTap={{ scale: 0.95 }}
              className="border rounded-full bg-neutral-900 border-neutral-700 hover:border-neutral-500 px-4 py-2 space-x-2 cursor-pointer
              flex items-center justify-between transition-all duration-300 ease-in-out group"
            >
              <span
                className={`text-xs md:text-sm group-hover:text-neutral-300 line-clamp-1 ${
                  isDropdownSortOpen ? "text-neutral-200" : "text-neutral-500"
                }`}
              >
                {sortOptions.find((option) => option.value === sortType)
                  ?.label || "Sort"}
              </span>
              <motion.div
                animate={{ rotate: isDropdownSortOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {isDropdownSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 -left-4 mt-2 w-36 py-2 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-lg"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleSortChange(option.value);
                        setIsDropdownSortOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors duration-200"
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showSearch && (
              <motion.div
                className="w-full sm:w-auto border bg-neutral-900 border-neutral-700 hover:border-neutral-500 px-3 py-2 rounded-full group:"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <div className="flex items-center w-full sm:w-[300px] h-5">
                  <motion.div
                    className="flex items-center flex-grow h-full"
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full text-xs md:text-sm outline-none bg-inherit text-neutral-200 placeholder:text-neutral-600"
                      type="text"
                      placeholder="Search products..."
                    />
                    {search && (
                      <button
                        onClick={handleClearSearch}
                        className="p-2 mr-1 rounded-full hover:bg-neutral-800 transition-colors group"
                      >
                        <X
                          className="w-5 text-neutral-600 group-hover:text-neutral-400"
                          alt="Clear search"
                        />
                      </button>
                    )}
                  </motion.div>
                  <div className="border-l-2 border-neutral-700 pl-2">
                    <Search
                      className="w-5 text-neutral-600 cursor-pointer"
                      alt="Search"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 gap-y-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className="relative group bg-neutral-900 rounded-2xl shadow-md border border-neutral-700 overflow-hidden transform transition-all duration-300
              hover:shadow-xl hover:border hover:border-neutral-500"
            >
              {/* Image and Category */}
              <div className="relative overflow-hidden">
                {product.media && product.media.length > 0 ? (
                  (() => {
                    const firstMedia = product.media[0];
                    const mediaSrc = `data:${firstMedia.contentType};base64,${firstMedia.data}`;
                    if (firstMedia.contentType.startsWith("image")) {
                      return (
                        <img
                          src={mediaSrc}
                          alt={product.name}
                          className="object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                        />
                      );
                    } else if (firstMedia.contentType.startsWith("video")) {
                      return (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                        >
                          <source
                            src={mediaSrc}
                            type={firstMedia.contentType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      );
                    } else {
                      return (
                        <p>Unsupported media type: {firstMedia.contentType}</p>
                      );
                    }
                  })()
                ) : (
                  <div className="w-full h-48 bg-neutral-800 flex items-center justify-center">
                    <p className="text-neutral-500">No media available</p>
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="p-2 md:p-4">
                <div className="flex flex-col h-full">
                  <h3 className="text-base font-medium text-neutral-200 line-clamp-1">
                    {product.name}
                  </h3>
                  <p
                    className="text-neutral-400 text-sm line-clamp-1 mt-1 flex-grow"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></p>

                  {/*  Product Details */}
                  <div className="mt-2">
                    <div className="space-y-2 text-sm text-gray-600">
                      {/* Only display IDR price */}
                      <div className="flex justify-between items-center">
                        <h3 className="text-neutral-200 text-xs sm:text-sm font-medium">
                          Price (IDR):
                        </h3>
                        <span className="text-xs sm:text-sm text-neutral-300">
                          {formatPriceIDR(product.priceIDR)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center border-t border-neutral-700 pt-1 md:pt-3 mt-1 md:mt-3">
                  <div className="flex md:space-x-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="p-2 rounded-full hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-500"
                    >
                      <SquarePen className="w-5 h-5 text-neutral-400" />
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/admin/reviews/${product._id}`)
                      }
                      className="p-2 rounded-full hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-500"
                    >
                      <Star className="w-5 h-5 text-orange-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-full hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-500"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-600" />
            <p className="mt-4 text-gray-500">No products found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!search && currentProducts.length > 0 && (
        <div className="flex justify-center my-8 md:mt-14">
          <ReactPaginate
            previousLabel={
              <div
                className={`flex items-center space-x-2 ${
                  currentPage === 0 ? "cursor-not-allowed" : ""
                }`}
              >
                <ChevronsLeft
                  className={`w-6 h-6 ${
                    currentPage === 0 ? "text-neutral-400" : "text-neutral-200"
                  }`}
                />
              </div>
            }
            nextLabel={
              <div
                className={`flex items-center space-x-2 ${
                  currentPage ===
                  Math.ceil(filteredProducts.length / productsPerPage) - 1
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                <ChevronsRight
                  className={`w-6 h-6 ${
                    currentPage ===
                    Math.ceil(filteredProducts.length / productsPerPage) - 1
                      ? "text-neutral-400"
                      : "text-neutral-200"
                  }`}
                />
              </div>
            }
            breakLabel={"..."}
            pageCount={Math.ceil(filteredProducts.length / productsPerPage)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={
              "flex items-center space-x-1 md:space-x-4 border border-neutral-800 p-2 rounded-full shadow-md bg-neutral-900"
            }
            pageClassName={`relative w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium transition-all duration-300 hover:-translate-y-1 text-neutral-200`}
            previousClassName={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              currentPage === 0
                ? "text-neutral-400 cursor-not-allowed"
                : "hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-300"
            }`}
            nextClassName={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage) - 1
                ? "text-neutral-400 cursor-not-allowed"
                : "hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-300"
            }`}
            breakClassName={"px-3 py-2 text-gray-500 select-none"}
            activeClassName={"bg-neutral-800 text-white shadow-md scale-105"}
            pageLinkClassName={`absolute inset-0 flex items-center justify-center`}
            disabledClassName={"opacity-50 cursor-not-allowed"}
            renderOnZeroPageCount={null}
          />
        </div>
      )}

      {/* Deleting Indicator */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-white"></div>
        </div>
      )}
      {isOverlay && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"></div>
      )}
    </div>
  );
}

export default AllProductsPage;
