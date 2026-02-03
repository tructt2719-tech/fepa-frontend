interface Props {
  method: "manual" | "scan" | "voice";
  onChange: (m: "manual" | "scan" | "voice") => void;
}

export default function ExpenseMethodTabs({ method, onChange }: Props) {
  return (
    <div className="expense-tabs">
      <button
        className={method === "manual" ? "active" : ""}
        onClick={() => onChange("manual")}
      >
        ✍️ Manual Entry
      </button>

      <button
        className={method === "scan" ? "active" : ""}
        onClick={() => onChange("scan")}
      >
        📸 Scan Receipt
      </button>

      <button
        className={method === "voice" ? "active" : ""}
        onClick={() => onChange("voice")}
      >
        🎙 Voice Input
      </button>
    </div>
  );
}
