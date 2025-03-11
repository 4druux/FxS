// MediaUploader.jsx (Corrected)
"use client";
import { useEffect, useState } from "react";
import { Trash2, UploadCloud, Plus, Pencil } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ModalCrop from "../modalCrop";
export default function MediaUploader({ mediaFiles, setMediaFiles }) {
  const [internalMediaFiles, setInternalMediaFiles] = useState(
    mediaFiles || []
  );
  const [previewURLs, setPreviewURLs] = useState([]);
  const [croppingIndex, setCroppingIndex] = useState(null);
  const [cropSource, setCropSource] = useState(null);
  const [mediaTypes, setMediaTypes] = useState([]); // Store media types for each file
  // Determine media type and create preview URLs
  useEffect(() => {
    const urls = [];
    const types = [];
    internalMediaFiles.forEach((fileObj) => {
      if (fileObj.cropped) {
        const url = URL.createObjectURL(fileObj.cropped);
        urls.push(url);
        const type = fileObj.cropped.type.startsWith("video")
          ? "video"
          : "image";
        types.push(type);
      } else {
        urls.push(""); // Placeholder for empty slots
        types.push("empty"); // Placeholder type
      }
    });
    setPreviewURLs(urls);
    setMediaTypes(types);
    // Cleanup: Revoke object URLs when component unmounts or URLs change
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [internalMediaFiles]);
  // Update the parent component's state whenever internalMediaFiles changes
  useEffect(() => {
    setMediaFiles(internalMediaFiles);
  }, [internalMediaFiles, setMediaFiles]);
  // Add slot kosong
  const handleAddImage = () => {
    if (internalMediaFiles.length < 5) {
      setInternalMediaFiles([
        ...internalMediaFiles,
        { original: null, cropped: null },
      ]);
    }
  };
  // Hapus file
  const handleRemoveImage = (index) => {
    const updatedFiles = [...internalMediaFiles];
    updatedFiles.splice(index, 1);
    setInternalMediaFiles(updatedFiles);
  };
  // Ketika upload file baru
  const handleImageChange = (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedFiles = [...internalMediaFiles];
      // Check if it's a GIF
      if (file.type === "image/gif") {
        // If it's a GIF, bypass cropping and store the original directly
        updatedFiles[index] = { original: file, cropped: file }; // Use original as cropped
        setInternalMediaFiles(updatedFiles);
      } else {
        // If it's not a GIF, proceed with cropping
        updatedFiles[index] = { original: file, cropped: null };
        setInternalMediaFiles(updatedFiles);
        setCropSource(reader.result); // Kirim ke modal crop pakai original
        setCroppingIndex(index);
      }
    };
    reader.readAsDataURL(file);
  };
  // Handle crop selesai
  const handleCropComplete = (croppedFile) => {
    const updatedFiles = [...internalMediaFiles];
    updatedFiles[croppingIndex] = {
      ...updatedFiles[croppingIndex],
      cropped: croppedFile, // Simpan hasil crop
    };
    setInternalMediaFiles(updatedFiles);
    setCroppingIndex(null);
    setCropSource(null);
  };
  // Edit ulang (reset ke original)
  const handleEditImage = (index) => {
    const fileObj = internalMediaFiles[index];
    if (!fileObj?.original) return;

    // If it's a GIF, don't open the crop modal.  Just allow re-upload.
    if (fileObj.original.type === "image/gif") {
      // Trigger the file input.  This is a bit of a workaround.
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*,video/*,image/gif";
      input.onchange = (e) => handleImageChange(index, e);
      input.click();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result); // Open modal pakai original
      setCroppingIndex(index);
    };
    reader.readAsDataURL(fileObj.original);
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
          {internalMediaFiles.map((file, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-[300px] rounded-xl bg-neutral-800 flex justify-center items-center">
                {file.cropped ? (
                  mediaTypes[index] === "video" ? (
                    <video
                      src={previewURLs[index]}
                      className="w-full h-full object-cover rounded-xl"
                      controls // Add controls for video playback
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={previewURLs[index]}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )
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
                {file.cropped && (
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
          {internalMediaFiles.length < 5 && (
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
        {internalMediaFiles.map((fileObj, index) => (
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
                {mediaTypes[index] === "video" ? (
                  <video
                    src={previewURLs[index]}
                    className="w-full h-full object-contain rounded-xl"
                    controls // Add controls for video playback
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={previewURLs[index]}
                    className="w-full h-full object-contain rounded-xl"
                  />
                )}
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
        {internalMediaFiles.length < 5 && (
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
