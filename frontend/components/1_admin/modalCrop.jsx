// ModalCrop.jsx (Corrected)
import { getCroppedImg } from "@/lib/cropImage";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";

export default function ModalCrop({ mediaSrc, onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mediaType, setMediaType] = useState("image"); // default image

  useEffect(() => {
    const ext = mediaSrc.split(";")[0].split(":")[1].split("/")[1]; // Get extension from base64 data URL
    if (["mp4", "webm", "ogg"].includes(ext)) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }
  }, [mediaSrc]);

  const handleCropComplete = (_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  };

  const handleSave = async () => {
    const croppedMedia = await getCroppedImg(mediaSrc, croppedAreaPixels);
    onCropComplete(croppedMedia);
  };

  useEffect(() => {
    // Lock scroll saat modal aktif
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      // Unlock scroll saat modal ditutup
      const scrollY = parseInt(document.body.style.top || "0", 10) * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 w-full max-w-lg rounded-xl overflow-hidden shadow-lg"
        onClick={(e) => e.stopPropagation()} // biar klik dalam modal nggak nutup
      >
        <div className="p-4 border-b border-neutral-700 flex justify-between">
          <span className="font-bold text-neutral-200">
            Crop {mediaType === "video" ? "Video Frame" : "Image"} (16:9)
          </span>
          <button
            type="button" // Add type="button" here
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors group"
          >
            <XIcon className="w-6 h-6 text-neutral-600 group-hover:text-neutral-400" />
          </button>
        </div>
        <div className="relative w-full h-[300px] bg-black/50">
          {mediaType === "image" && (
            <Cropper
              image={mediaSrc}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          )}
          {mediaType === "video" && (
            <div className="w-full h-full flex justify-center items-center text-red-500">
              Video cropping belum didukung!
            </div>
          )}
        </div>
        <div className="p-4 border-t border-neutral-700 flex justify-end gap-2">
          <button
            type="button" // Add type="button" here
            onClick={onClose}
            className="px-4 py-2 text-sm border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 rounded-full"
          >
            Cancel
          </button>
          <button
            type="button" // Add type="button" here
            onClick={handleSave}
            className="px-4 py-2 text-sm border bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 rounded-full"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
}
