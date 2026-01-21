// export default function ScanReceipt() {
//   return (
//     <div className="scan-box">
//       <input type="file" accept="image/*" />
//       <p>Upload receipt to auto-extract data</p>
//     </div>
//   );
// }
import { useState } from "react";
import type { Expense } from "../../types/expense";
interface Props {
  onAdd: (expense: Expense) => void;
  onBack: () => void;
}

function resizeImage(
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
      if (!ctx) return reject();

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject();
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

export default function ScanReceipt({ onAdd, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFile(e.target.files?.[0] ?? null);
  // };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    try {
      // ✅ RESIZE TRƯỚC KHI GỬI
      const resizedBlob = await resizeImage(file);

      const formData = new FormData();
      formData.append("file", resizedBlob, file.name.replace(/\.\w+$/, ".jpg"));

      const res = await fetch("http://localhost:8000/scan-receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Scan failed");

      const expense = await res.json();
      onAdd(expense);
    } catch (err) {
      console.error(err);
      alert("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-box">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div className="scan-actions">
        <button onClick={onBack}>Back</button>
        <button onClick={handleProcess} disabled={!file || loading}>
          {loading ? "Processing..." : "Process Receipt"}
        </button>
      </div>
    </div>
  );
}
