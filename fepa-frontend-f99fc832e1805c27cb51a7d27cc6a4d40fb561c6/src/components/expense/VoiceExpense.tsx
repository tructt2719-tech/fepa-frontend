import { useState } from "react";
import type { Expense } from "../../types/expense";
import ManualExpenseForm from "./ManualExpenseForm"; // Import Form vào

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Props {
  onAdd: (expense: Expense) => void;
  onBack: () => void;
  currentUserId: number; // Cần ID để truyền xuống Form
}

export default function VoiceExpense({ onAdd, onBack, currentUserId }: Props) {
  const [listening, setListening] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null); // State lưu kết quả sau khi nói

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return <p>Speech recognition not supported</p>;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "vi-VN"; // Đổi sang tiếng Việt để nhận diện chuẩn hơn
  recognition.continuous = false;
  recognition.interimResults = false;

  const startRecording = () => {
    setListening(true);
    setScannedResult(null); // Reset kết quả cũ
    recognition.start();
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setListening(false);

    // Xử lý chuỗi văn bản thành dữ liệu sơ bộ
    const expenseData = parseExpense(transcript);
    // HIỂN THỊ FORM MANUAL VỚI DỮ LIỆU NÀY
    setScannedResult(expenseData);
  };

  recognition.onerror = () => {
    setListening(false);
    alert("Voice recognition error");
  };

  const parseExpense = (speech: string) => {
    const amountMatch = speech.match(/\d+/); // Tìm con số đầu tiên
    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

    return {
      name: "Chi tiêu giọng nói", 
      amount: amount,
      category: "Others",
      date: new Date().toISOString().slice(0, 10),
      note: speech, // Gán nội dung vừa nói vào Note
      icon: "🎤",
    };
  };

  // --- NẾU ĐÃ NÓI XONG: Hiển thị ManualExpenseForm để chỉnh sửa ---
  if (scannedResult) {
    return (
      <div className="voice-confirmation">
        <h3 style={{ textAlign: 'center' }}>Xác nhận chi tiêu</h3>
        <ManualExpenseForm 
          initialData={scannedResult} 
          onAdd={onAdd} 
          currentUserId={currentUserId} 
        />
        <button 
          onClick={() => setScannedResult(null)}
          style={{ width: '100%', marginTop: '10px', background: '#eee', border: 'none', padding: '10px', borderRadius: '8px' }}
        >
          ← Thử nói lại
        </button>
      </div>
    );
  }

  // --- GIAO DIỆN KHI ĐANG CHỜ NÓI ---
  return (
    <div className="voice-root" style={{ textAlign: 'center', padding: '20px' }}>
      <button onClick={onBack} style={{ marginBottom: '20px' }}>Back</button>
      
      <div 
        className={`mic-button ${listening ? 'pulse' : ''}`}
        onClick={!listening ? startRecording : undefined}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: listening ? '#ef4444' : '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3rem',
          margin: '0 auto 20px',
          cursor: 'pointer',
          color: 'white',
          transition: 'all 0.3s'
        }}
      >
        {listening ? "🛑" : "🎤"}
      </div>

      <h3>{listening ? "Đang lắng nghe..." : "Bấm vào mic để nói"}</h3>
      <p style={{ color: '#666' }}>Ví dụ: "Hãy nói câu gì đó thật peak"</p>
    </div>
  );
}