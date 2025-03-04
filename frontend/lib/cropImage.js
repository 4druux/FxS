function createMedia(url) {
  return new Promise((resolve, reject) => {
    const mime = url.split(";")[0].split(":")[1];
    const ext = mime.split("/")[1].toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve({ type: "image", element: img });
      img.onerror = reject;
      img.src = url;
    } else if (["mp4", "webm", "ogg"].includes(ext)) {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = url;
      video.muted = true;
      video.currentTime = 0;

      video.onloadeddata = () => resolve({ type: "video", element: video });
      video.onerror = reject;
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
}

export async function getCroppedImg(mediaSrc, croppedAreaPixels) {
  const { type, element } = await createMedia(mediaSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  if (type === "image") {
    ctx.drawImage(
      element,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  } else if (type === "video") {
    await new Promise((resolve) => {
      element.currentTime = 0;
      element.onseeked = resolve;
    });

    ctx.drawImage(
      element,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `cropped-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      resolve(file);
    }, "image/jpeg");
  });
}
