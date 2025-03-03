"use client";
import MediaUploader from "@/components/1_admin/add-product/MediaUploader";
import MagneticButton from "@/components/button/MagneticButton";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function AddProductPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [mediaFiles, setMediaFiles] = useState([]);

  const convertPrice = () => {
    if (currency === "USD") {
      return (parseFloat(price) / 15500).toFixed(2); // contoh kurs
    }
    return price;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", convertPrice());
    formData.append("currency", currency);

    mediaFiles.forEach((file, index) => {
      if (file) formData.append(`media_${index}`, file);
    });

    console.log("Sending:", formData);
    // Call addProduct dari context / API call
  };

  return (
    <div className="p-6 text-neutral-200 space-y-8">
      <h1 className="text-2xl font-bold">Add New Product</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-neutral-900 border border-neutral-800 p-6 rounded-xl"
      >
        {/* Media Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Upload Image / GIF / Video
          </label>
          <MediaUploader
            mediaFiles={mediaFiles}
            setMediaFiles={setMediaFiles}
          />
        </div>

        {/* Nama Produk */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
            className="w-full p-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-double focus:outline-neutral-500"
          />
        </div>

        {/* Deskripsi Produk */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Description
          </label>
          <div className="rounded-lg border border-neutral-700 overflow-hidden">
            <ReactQuill
              value={description}
              onChange={setDescription}
              theme="snow"
              className="quill-dark"
            />
          </div>
        </div>

        {/* Harga */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-400">
            Price
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 p-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-double focus:outline-neutral-500"
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="p-3 bg-neutral-800 border border-neutral-700 text-white rounded-lg"
            >
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="w-full flex justify-end items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-12 py-4 text-sm font-medium text-neutral-400 border border-neutral-700 rounded-full hover:text-white hover:border-neutral-400 transition"
          >
            Back
          </button>
          <MagneticButton type="submit">Add New Product</MagneticButton>
        </div>
      </form>

      {/* Biar ada jarak ke bawah */}
      <div className="h-6"></div>

      {/* Custom Styling Buat Quill di Dark Mode */}
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
        .quill-dark .ql-fill {
          fill: #e5e5e5;
        }
      `}</style>
    </div>
  );
}
