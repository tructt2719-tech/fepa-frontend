import { useNavigate } from "react-router-dom";

const AdminSubscriptions = () => {
  const navigate = useNavigate();
  const plans = [
    { id: 1, name: "Free", price: 0, duration: "Forever" },
    { id: 2, name: "Pro", price: 10, duration: "Monthly" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "white" }}>Subscriptions</h1>
        <button
          style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/subscriptions/create")}
        >
          + Create Subscription
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", background: "#1e293b" }}>
            <th style={{ padding: "12px" }}>Name</th>
            <th>Price</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #334155" }}>
              <td style={{ padding: "12px" }}>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminSubscriptions;
