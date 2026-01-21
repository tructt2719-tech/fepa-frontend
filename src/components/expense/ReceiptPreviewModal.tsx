export default function ReceiptPreviewModal({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card">
        <img
          src={image}
          style={{
            maxWidth: "1260px",
            maxHeight: "540px",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
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
      if (!ctx) return reject();

      ctx.drawImage(img, 0, 0, width, height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      resolve(resizedBase64);
    };

    img.onerror = reject;
  });
}
