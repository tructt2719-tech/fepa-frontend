import { useNavigate } from "react-router-dom";

const CreateSubscription = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ color: "white" }}>Create New Plan</h1>
      <div style={{ maxWidth: "400px", marginTop: "20px" }}>
        <input placeholder="Plan Name" style={inputStyle} />
        <input
          placeholder="Price"
          type="number"
          min={0}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e") {
              e.preventDefault();
            }
          }}
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/admin/subscriptions")}
            style={btnStyle}
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/admin/subscriptions")}
            style={{ ...btnStyle, background: "#2563eb" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
};
const btnStyle = {
  flex: 1,
  padding: "10px",
  background: "#475569",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default CreateSubscription;
