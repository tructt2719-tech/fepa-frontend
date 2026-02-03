import { useState } from "react";
import type { Expense } from "../../types/expense";
import ManualExpenseForm from "./ManualExpenseForm"; // Import Form vào đây

interface Props {
  onAdd: (expense: Expense) => void;
  onBack: () => void;
  currentUserId: number; // Thêm prop này để truyền xuống ManualExpenseForm
}

export default function ScanReceipt({ onAdd, onBack, currentUserId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null); // Lưu kết quả quét

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleProcess = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Lưu ý: Đổi endpoint thành /api/scan-barcode nếu bạn dùng mã tôi đưa trước đó
      const res = await fetch("http://localhost:8000/api/scan-barcode", {
        method: "POST",
        body: formData,
      });

if (!res.ok) {
  const errorData = await res.json();
  // Hiển thị nội dung chi tiết từ Backend (ví dụ: "Không tìm thấy mã vạch")
  alert(`Lỗi: ${errorData.detail || "Không thể xử lý ảnh"}`);
  return;
}
      const data = await res.json();
      
      // THAY ĐỔI Ở ĐÂY: Thay vì onAdd luôn, ta lưu vào state để hiện Form
      setScannedResult(data); 
      
    } catch (err) {
      console.error("SCAN ERROR:", err);
      alert("Scan failed. Check backend & console.");
    } finally {
      setLoading(false);
    }
  };

  // --- NẾU ĐÃ QUÉT XONG: Hiển thị ManualExpenseForm ---
  if (scannedResult) {
    return (
      <div className="scan-confirmation">
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>Xác nhận thông tin quét</h3>
          <p style={{ fontSize: "0.85rem", color: "#666" }}>Vui lòng kiểm tra lại trước khi lưu</p>
        </div>

        {/* Gọi Form và truyền dữ liệu quét được vào initialData */}
        <ManualExpenseForm 
          initialData={scannedResult} 
          onAdd={onAdd} 
          currentUserId={currentUserId} 
        />

        <button
          onClick={() => setScannedResult(null)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "10px",
            background: "none",
            border: "1px solid #ddd",
            borderRadius: "6px",
            cursor: "pointer",
            color: "#666"
          }}
        >
          ← Quay lại quét ảnh khác
        </button>
      </div>
    );
  }

  // --- NẾU CHƯA QUÉT: Hiển thị giao diện Upload ---
  return (
    <div className="scan-root">
      <div 
        className="upload-box" 
        style={{ 
          border: "2px dashed #3b82f6", 
          borderRadius: "12px", 
          padding: "40px", 
          textAlign: "center",
          marginBottom: "20px",
          cursor: "pointer"
        }}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          id="fileInput"
          type="file" 
          accept="image/*" 
          onChange={handleChange} 
          hidden 
        />
        <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📷</div>
        <p>{file ? file.name : "Nhấn để tải lên ảnh mã vạch/hóa đơn"}</p>
      </div>

      <div className="scan-actions" style={{ display: "flex", gap: "10px" }}>
        <button className="btn-back" onClick={onBack} style={{ flex: 1, padding: "12px", borderRadius: "8px" }}>
          Back
        </button>
        <button
          className="btn-process"
          disabled={!file || loading}
          onClick={handleProcess}
          style={{ 
            flex: 2, 
            padding: "12px", 
            borderRadius: "8px", 
            backgroundColor: "#3b82f6", 
            color: "white", 
            border: "none",
            fontWeight: "bold"
          }}
        >
          {loading ? "Processing..." : "Process Photo"}
        </button>
      </div>
    </div>
  );
}