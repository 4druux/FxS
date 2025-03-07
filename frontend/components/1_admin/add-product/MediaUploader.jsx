"use client";
import { useEffect, useState } from "react";
import { Trash2, UploadCloud, Plus, Pencil } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ModalCrop from "../modalCrop";

export default function MediaUploader({ mediaFiles, setMediaFiles }) {
  if (!mediaFiles) setMediaFiles([]); // Default state saat pertama kali

  const [previewURLs, setPreviewURLs] = useState([]);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [cropSource, setCropSource] = useState(null);

  useEffect(() => {
    const urls = mediaFiles.map((file) =>
      file?.cropped ? URL.createObjectURL(file.cropped) : ""
    );
    setPreviewURLs(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [mediaFiles]);

  // Tambah slot kosong
  const handleAddImage = () => {
    if (mediaFiles.length < 5) {
      setMediaFiles([...mediaFiles, { original: null, cropped: null }]);
    }
  };

  // Hapus file
  const handleRemoveImage = (index) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    setMediaFiles(updatedFiles);
  };

  // Ketika upload file baru
  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedFiles = [...mediaFiles];
      updatedFiles[index] = { original: file, cropped: null };
      setMediaFiles(updatedFiles);

      setCropSource(reader.result); // Kirim ke modal crop pakai original
      setCroppingIndex(index);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop selesai
  const handleCropComplete = (croppedFile) => {
    const updatedFiles = [...mediaFiles];
    updatedFiles[croppingIndex] = {
      ...updatedFiles[croppingIndex],
      cropped: croppedFile, // Simpan hasil crop
    };
    setMediaFiles(updatedFiles);
    setCroppingIndex(null);
    setCropSource(null);
  };

  // Edit ulang (reset ke original)
  const handleEditImage = (index) => {
    const file = mediaFiles[index]?.original;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result); // Open modal pakai original
      setCroppingIndex(index);
    };
    reader.readAsDataURL(file);
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
              <div className="relative h-[300px] rounded-xl bg-neutral-800 flex justify-center items-center">
                {file ? (
                  <img
                    src={previewURLs[index]}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <label className="cursor-pointer flex flex-col justify-center items-center gap-2">
                    <UploadCloud className="w-12 h-12 text-neutral-400" />
                    <input
                      type="file"
                      accept="image/*,video/*,image/gif"
                      className="hidden"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    <span className="text-sm text-neutral-400">
                      Upload Media
                    </span>
                  </label>
                )}
                {file && (
                  <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="text-neutral-400 w-8 h-8" />
                    </button>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
          {mediaFiles.length < 5 && (
            <SwiperSlide>
              <div className="h-[300px] flex items-center justify-center rounded-xl border-2 border-dashed border-neutral-600">
                <button type="button" onClick={handleAddImage}>
                  <Plus className="w-12 h-12 text-neutral-400" />
                </button>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:flex flex-wrap gap-4">
        {mediaFiles.map((fileObj, index) => (
          <div
            key={index}
            className={`relative w-32 h-32 rounded-xl flex justify-center items-center group ${
              fileObj.cropped
                ? "border-0"
                : "border-2 border-dashed border-neutral-700 hover:border-neutral-500"
            }`}
          >
            {fileObj.cropped ? (
              <>
                <img
                  src={previewURLs[index]}
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute inset-0 flex justify-center items-center gap-2 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="w-8 h-8 text-white p-1 rounded-full hover:bg-neutral-600" />
                  </button>
                  <button type="button" onClick={() => handleEditImage(index)}>
                    <Pencil className="w-8 h-8 text-white p-1 rounded-full hover:bg-neutral-600" />
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

      {cropSource && (
        <ModalCrop
          mediaSrc={cropSource}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setCroppingIndex(null);
            setCropSource(null);
          }}
        />
      )}
    </div>
  );
}
