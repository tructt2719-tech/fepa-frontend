import React, { useState } from "react";

interface BudgetData {
  id: number;
  name: string;
  limit: number;
  spent: number;
  startDate: string;
  endDate: string;
}

export default function BudgetCard({ data, onUpdate }: { data: BudgetData, onUpdate: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tính toán phần trăm còn lại (Remaining)
  // spent càng tăng thì remainingPercentage càng giảm
  const spentPercentage = data.limit > 0 ? (data.spent / data.limit) * 100 : 0;
  const remainingPercentage = Math.max(0, 100 - spentPercentage);

  // 2. Xác định màu sắc dựa trên mức độ "cạn kiệt" của ngân sách
  const getStatusColor = () => {
    if (remainingPercentage <= 0) return "#ef4444";  // Hết tiền (0%) -> Đỏ
    if (remainingPercentage <= 20) return "#f59e0b"; // Sắp hết (dưới 20%) -> Vàng
    return "#10b981";                               // Còn nhiều -> Xanh lá
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/budgets/${data.id}`, {
        method: 'DELETE'
      });

      if (res.ok || res.status === 200) {
        setIsDeleting(false);
        onUpdate();
      } else {
        onUpdate();
      }
    } catch (e) {
      console.error("Lỗi kết nối:", e);
      onUpdate();
    }
  };

  return (
      <div className="budget-card" style={{
        backgroundColor: 'var(--bg-card, #1e293b)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border-color, #334155)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        color: '#f8fafc'
      }}>

        {/* OVERLAY XÁC NHẬN XÓA */}
        {isDeleting && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center', zIndex: 10, backdropFilter: 'blur(4px)'
            }}>
              <p style={{ color: '#fff', marginBottom: '15px', fontWeight: 500 }}>Xóa ngân sách này?</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleDelete} style={{
                  padding: '8px 20px', backgroundColor: '#ef4444', color: '#fff',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}>Xác nhận</button>
                <button onClick={() => setIsDeleting(false)} style={{
                  padding: '8px 20px', backgroundColor: '#334155', color: '#fff',
                  border: 'none', borderRadius: '8px', cursor: 'pointer'
                }}>Hủy</button>
              </div>
            </div>
        )}

        {/* NỘI DUNG CARD */}
        <div style={{ filter: isDeleting ? 'blur(2px)' : 'none', transition: 'filter 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{data.name}</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{data.startDate} ➔ {data.endDate}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: getStatusColor() }}>
              {remainingPercentage.toFixed(0)}%
            </span>
              <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase' }}>Remaining</p>
            </div>
          </div>

          <div style={{ marginBottom: '12px', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
            <span>Spent: <b style={{ color: 'red' }}>-${data.spent.toLocaleString()}</b></span>
            <span>Balance: ${data.limit.toLocaleString()}</span>
          </div>

          {/* THANH PROGRESS GIẢM DẦN */}
          <div style={{
            width: '100%',
            height: '12px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            marginBottom: '20px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              width: `${remainingPercentage}%`,
              height: '100%',
              backgroundColor: getStatusColor(),
              borderRadius: '10px',
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: remainingPercentage <= 20 ? `0 0 12px ${getStatusColor()}` : 'none'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
                onClick={() => setIsDeleting(true)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
  );
}