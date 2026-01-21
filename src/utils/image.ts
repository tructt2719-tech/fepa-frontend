// resize base64 → base64 (dùng cho ảnh ĐÃ LƯU)
export function resizeBase64Image(
  base64: string,
  maxWidth = 1260,
  maxHeight = 540,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      let { width, height } = img;

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);

      width *= scale;
      height *= scale;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };

    img.onerror = reject;
  });
}
// resize File → Blob (dùng khi upload)
export function resizeImage(
  file: File,
  maxWidth = 1260,
  maxHeight = 540,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);

      width *= scale;
      height *= scale;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Blob error");
          resolve(blob);
        },
        "image/jpeg",
        0.9,
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}
