"use client";
import { useEffect, useState } from "react";
import { Trash2, UploadCloud, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function MediaUploader({ mediaFiles, setMediaFiles }) {
  // Pastikan mediaFiles minimal array kosong
  if (!mediaFiles) setMediaFiles([]);

  const [previewURLs, setPreviewURLs] = useState([]);

  // Update preview URLs setiap kali mediaFiles berubah
  useEffect(() => {
    const urls = mediaFiles.map((f) =>
      f instanceof File ? URL.createObjectURL(f) : ""
    );
    setPreviewURLs(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaFiles]);

  // Tambah slot baru
  const handleAddImage = () => {
    if (mediaFiles.length < 5) {
      setMediaFiles([...mediaFiles, null]); // Slot kosong untuk diisi nanti
    }
  };

  // Hapus slot/isi file
  const handleRemoveImage = (index) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);
  };

  // Upload file ke slot tertentu
  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const updatedFiles = [...mediaFiles];
    updatedFiles[index] = file;
    setMediaFiles(updatedFiles);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Mobile Slider */}
      <div className="sm:hidden w-full">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full"
        >
          {mediaFiles.map((file, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[300px] rounded-xl bg-gray-50 flex justify-center items-center">
                {file ? (
                  <img
                    src={previewURLs[index]}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col justify-center items-center gap-2">
                    <UploadCloud className="w-12 h-12 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*,video/*,image/gif"
                      className="hidden"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    <span className="text-sm text-gray-500">Upload Media</span>
                  </label>
                )}
                {file && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="text-white w-8 h-8" />
                    </button>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
          {mediaFiles.length < 5 && (
            <SwiperSlide>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-neutral-700">
                <button type="button" onClick={handleAddImage}>
                  <Plus className="w-12 h-12 text-gray-400" />
                </button>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:flex flex-wrap gap-4">
        {mediaFiles.map((file, index) => (
          <div
            key={index}
            className={`relative w-32 h-32 rounded-xl flex justify-center items-center group ${
              file
                ? "border-0"
                : "border-2 border-dashed border-neutral-700 hover:border-neutral-500"
            }`}
          >
            {file ? (
              <>
                <img
                  src={previewURLs[index]}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex justify-center items-center rounded-xl bg-black/50 opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="text-white w-6 h-6" />
                  </button>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col justify-center items-center gap-2">
                <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-neutral-200" />
                <input
                  type="file"
                  accept="image/*,video/*,image/gif"
                  className="hidden"
                  onChange={(e) => handleImageChange(index, e)}
                />
                <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
                  Upload
                </span>
              </label>
            )}
          </div>
        ))}
        {mediaFiles.length < 5 && (
          <div className="w-32 h-32 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-xl flex justify-center items-center group">
            <button type="button" onClick={handleAddImage}>
              <Plus className="w-6 h-6 text-neutral-400 group-hover:text-neutral-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
