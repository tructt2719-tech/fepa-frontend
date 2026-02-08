import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: () => void; 
  currentUserId: number;
};

export default function CreateGoalModal({ onClose, onCreate, currentUserId }: Props) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm chặn nhập số âm và ký tự lạ
  const handleNumericChange = (val: string, setter: (v: string) => void) => {
    const cleanVal = val.replace(/[^0-9.]/g, "");
    setter(cleanVal);
  };

  const handleSubmit = async () => {
    const numericTarget = Number(target);
    const numericCurrent = Number(current || 0);

    if (!name || !target || !date) {
      alert("Please fill in: Goal Name, Target Amount, and Date.");
      return;
    }

    if (numericTarget <= 0) {
      alert("Target amount must be greater than 0!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          goal_name: name,
          target_amount: numericTarget,
          current_amount: numericCurrent,
          target_date: date
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        onCreate();
        onClose();
      } else {
        const errorMsg = Array.isArray(resData.detail) 
          ? resData.detail.map((err: any) => err.msg).join(", ") 
          : resData.detail || "Unknown error";
        alert("System Error: " + errorMsg);
      }
    } catch (err) {
      alert("Connection failed. Please check your Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={backdropStyle}>
      <style>{`
        .goal-modal {
          background: var(--bg-card, #ffffff);
          color: var(--text-main, #1e293b);
          padding: 1.5rem;
          borderRadius: 12px;
          width: 35%;
          maxWidth: 400px;
          boxShadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .input-group { margin-bottom: 1rem; }
        .input-group label { 
          display: block; font-size: 0.85rem; font-weight: 600; 
          color: var(--text-sub, #64748b); margin-bottom: 5px; 
        }
        .goal-input {
          width: 100%; padding: 10px; border-radius: 8px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-input, #f8fafc);
          color: var(--text-main); outline: none; box-sizing: border-box;
        }
        .goal-input:focus { border-color: #3b82f6; }
      `}</style>

      <div className="goal-modal" onClick={(e) => e.stopPropagation()} style={{ borderRadius: '12px' }}>
        <h2 style={{ margin: '0 0 1.2rem 0', fontSize: '1.25rem' }}>Create Savings Goal</h2>

        <div className="input-group">
          <label>Goal Name</label>
          <input
            className="goal-input"
            placeholder="e.g. New Laptop"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="input-group">
            <label>Target ($)</label>
            <input
              className="goal-input"
              inputMode="decimal"
              placeholder="0.00"
              value={target}
              onChange={(e) => handleNumericChange(e.target.value, setTarget)}
            />
          </div>

          <div className="input-group">
            <label>Current ($)</label>
            <input
              className="goal-input"
              inputMode="decimal"
              placeholder="0.00"
              value={current}
              onChange={(e) => handleNumericChange(e.target.value, setCurrent)}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Target Date</label>
          <input
            type="date"
            className="goal-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              flex: 2, padding: '12px', border: 'none', borderRadius: '8px',
              background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {loading ? "Processing..." : "Create Goal"}
          </button>
          <button onClick={onClose} style={{ 
            flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
            background: 'var(--bg-sub, #f1f5f9)', color: 'var(--text-main)', cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
  alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(2px)'
};