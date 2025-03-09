"use client";

import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPaginate from "react-paginate";
import SweetAlert from "@/components/ui/SweetAlert";

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Search and Sort States
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [isDropdownSortOpen, setIsDropdownSortOpen] = useState(false);
  const [sortType, setSortType] = useState("date-desc");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 10;

  // Refs
  const dropdownSortRef = useRef(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:5000/api/product");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Animation Variants (Framer Motion) ---
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

  const dropdownVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    exit: { y: -10, opacity: 0, transition: { duration: 0.1 } },
  };

  // --- Event Handlers ---
  const handleClearSearch = () => {
    setSearch("");
  };

  const handleEdit = (productId) => {
    router.push(`/admin/dashboard/products/edit-product/${productId}`);
  };

  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setIsOverlay(true);
  };

  const closeDeleteModal = () => {
    setDeleteProductId(null);
    setIsOverlay(false);
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
        const response = await fetch(
          `http://localhost:5000/api/product/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        setProducts(products.filter((product) => product._id !== id));

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
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // --- Computed Values ---
  // 1. Apply Search Filtering
  const filteredProducts = products.filter((product) => {
    return product.name.toLowerCase().includes(search.toLowerCase());
  });

  // 2. Apply Sorting (using priceUSD and createdAt/date)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "price-asc") {
      return a.priceUSD - b.priceUSD;
    } else if (sortType === "price-desc") {
      return b.priceUSD - a.priceUSD;
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

  const formatPriceIDR = (price) => {
    return price.toLocaleString("id-ID");
  };

  const formatPriceUSD = (price) => {
    return price.toFixed(2);
  };

  // --- Close dropdown when clicking outside ---
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
  if (loading)
    return (
      <div className="p-4 bg-[#121212] min-h-screen flex justify-center items-center">
        Loading products...
      </div>
    );
  if (error)
    return (
      <div className="p-4 bg-[#121212] min-h-screen flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 bg-[#121212] min-h-screen text-neutral-200">
      {/* Header and Search */}
      <div className="sm:mb-12 mb-4 flex flex-col sm:flex-row justify-between sm:gap-0 gap-3 text-2xl">
        <h1 className="text-2xl font-bold mb-4">Product Management</h1>
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="w-full sm:w-auto border border-neutral-700 px-3 py-2 rounded-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center pt-2 w-full sm:w-[300px] h-5">
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
                    className="w-full outline-none bg-inherit text-sm text-neutral-200 placeholder:text-neutral-600"
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

      {/*  Sort */}
      <div className="flex justify-end items-center mb-6 space-x-4">
        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownSortRef}>
          <motion.div
            onClick={() => setIsDropdownSortOpen(!isDropdownSortOpen)}
            whileTap={{ scale: 0.95 }}
            className="border rounded-full bg-neutral-900 border-neutral-800 px-4 py-2 space-x-2 cursor-pointer flex items-center justify-between transition-all duration-300 ease-in-out"
          >
            <span
              className={`text-sm ${
                isDropdownSortOpen ? "text-neutral-200" : "text-neutral-500"
              }`}
            >
              {sortOptions.find((option) => option.value === sortType)?.label ||
                "Sort"}
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
                className="absolute z-50 right-0 mt-2 w-40 py-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg"
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
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 gap-y-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product._id}
              className="relative group bg-neutral-900 rounded-2xl shadow-md border border-neutral-800 overflow-hidden transform transition-all duration-300
              hover:shadow-xl hover:border hover:border-neutral-600"
            >
              {/* Image and Category */}
              <div className="relative overflow-hidden">
                {product.media && product.media.length > 0 && (
                  <img
                    src={`data:${product.media[0].contentType};base64,${product.media[0].data}`}
                    alt={product.name}
                    className="object-cover w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                )}
                {/* <div className="absolute top-3 right-3 bg-white/80 rounded-full px-3 py-1 text-xs font-medium shadow-md text-neutral-950">
                  {product.category}
                </div> */}
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
                      <div className="flex justify-between items-center">
                        <h3 className="text-neutral-200 text-xs sm:text-sm font-medium">
                          Price (USD):
                        </h3>
                        <span className="text-green-500 font-bold text-xs sm:text-sm">
                          ${formatPriceUSD(product.priceUSD || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="text-neutral-200 text-xs sm:text-sm font-medium">
                          Price (IDR):
                        </h3>
                        <span className="text-xs sm:text-sm text-neutral-400">
                          Rp{formatPriceIDR(product.priceIDR || 0)}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-neutral-400">
                        Stock: {product.stock || 0}
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
        <div className="flex justify-center my-8">
          <ReactPaginate
            previousLabel={
              <div className="flex items-center space-x-2">
                <ChevronsLeft className="w-6 h-6 text-neutral-200" />
              </div>
            }
            nextLabel={
              <div className="flex items-center space-x-2">
                <ChevronsRight className="w-6 h-6 text-neutral-200" />
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
            pageClassName={` relative w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium
            transition-all duration-300 hover:-translate-y-1 text-neutral-200`}
            previousClassName={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              currentPage === 0
                ? "text-neutral-400 cursor-not-allowed"
                : "hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-300"
            }`}
            nextClassName={` flex items-center space-x-2 px-3 py-2 rounded-full ${
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage) - 1
                ? "text-neutral-400 cursor-not-allowed"
                : "hover:bg-neutral-800 hover:-translate-y-1 transition-all duration-300"
            } `}
            breakClassName={"px-3 py-2 text-gray-500 select-none"}
            activeClassName={"bg-neutral-800 text-white shadow-md scale-105"}
            pageLinkClassName={` absolute inset-0 flex items-center justify-center`}
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
