import { useState } from "react";

interface BudgetPayload {
  userID: number;
  category: string;
  limitAmount: number;
  startDate: string;
  endDate: string;
}

type Props = {
  onClose: () => void;
  onCreate: (budget: BudgetPayload) => void;
  currentUserId: number;
};

export default function CreateBudgetModal({ onClose, onCreate, currentUserId }: Props) {
  const now = new Date();
  const defaultStart = new Date(now.getFullYear(), now.getMonth(), 2).toISOString().split('T')[0];
  const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  // Hàm chặn nhập ký tự lạ và số âm
  const handleLimitChange = (val: string) => {
    // Chỉ cho phép số và dấu chấm thập phân, loại bỏ dấu trừ "-"
    const cleanVal = val.replace(/[^0-9.]/g, "");
    setLimit(cleanVal);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    const numericLimit = Number(limit);

    if (!category || !limit || !startDate || !endDate) {
      alert("Please fill in all information!");
      return;
    }

    // Kiểm tra logic số tiền
    if (numericLimit <= 0) {
      alert("Limit must be greater than 0!");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date!");
      return;
    }

    onCreate({
      userID: currentUserId,
      category: category,
      limitAmount: numericLimit,
      startDate: startDate,
      endDate: endDate
    });

    onClose();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border-color, #d1d5db)',
    backgroundColor: 'var(--bg-input, #fff)',
    color: 'var(--text-main, #000)',
    fontSize: '0.95rem',
    boxSizing: 'border-box' as const,
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 'bold' as const,
    fontSize: '0.85rem',
    color: 'var(--text-muted, #4b5563)'
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #111827)',
        padding: '1.5rem',
        borderRadius: '12px',
        width: '95%',
        maxWidth: '420px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        border: '1px solid var(--border-color, #e5e7eb)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Set New Budget</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Select category</option>
            <option value="Food & Dining">Food & Dining 🍔</option>
            <option value="Transportation">Transportation 🚗</option>
            <option value="Shopping">Shopping 🛍️</option>
            <option value="Entertainment">Entertainment 🎬</option>
            <option value="Bills & Utilities">Bills & Utilities 💡</option>
            <option value="Others">Others 📦</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Monthly Limit ($)</label>
          <input 
            type="text" // Chuyển sang text để kiểm soát nội dung nhập tốt hơn
            inputMode="decimal" // Hiện bàn phím số trên điện thoại
            placeholder="0"
            value={limit} 
            onChange={(e) => handleLimitChange(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSubmit} style={{ 
            flex: 1, padding: '12px', cursor: 'pointer', backgroundColor: '#3b82f6', 
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' 
          }}>
            Create Budget
          </button>
          <button onClick={onClose} style={{ 
            flex: 1, padding: '12px', cursor: 'pointer', 
            backgroundColor: 'var(--bg-secondary, #f3f4f6)', 
            color: 'var(--text-main)', border: 'none', borderRadius: '8px' 
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}