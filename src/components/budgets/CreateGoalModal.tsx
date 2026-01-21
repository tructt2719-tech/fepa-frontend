import { useState } from "react";

type Props = {
  onClose: () => void;
  onCreate: (goal: any) => void;
};

export default function CreateGoalModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!name || !target) return;

    onCreate({
      id: Date.now(),
      name,
      icon: "🎯",
      current: Number(current || 0),
      target: Number(target),
      daysLeft: 90,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Create Savings Goal</h2>

        <label>Goal Name</label>
        <input
          placeholder="e.g. Emergency Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Target Amount</label>
        <input
          type="number"
          min={0}
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />

        <label>Current Amount</label>
        <input
          type="number"
          min={0}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />

        <label>Target Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          Create Goal
        </button>

        <button className="btn-text" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
