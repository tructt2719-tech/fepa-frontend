import { useEffect, useState } from "react";

interface Subscription {
  email: string;
  plan: string;
  startDate: string;
  endDate: string;
  status: string;
}

const AdminSubscriptions = () => {
  console.log("AdminSubscriptions MOUNTED");

  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/subscriptions")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setSubs(data);
      })
      .catch((err) => {
        console.error("Fetch subscriptions error:", err);
        setSubs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div>
      <h1 style={{ color: "white", marginBottom: 20 }}>Subscriptions</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#1e293b" }}>
          <tr>
            <th>Email</th>
            <th>Plan</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {subs.map((s, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #334155" }}>
              <td>{s.email}</td>
              <td>{s.plan}</td>
              <td>
                {s.startDate ? new Date(s.startDate).toLocaleDateString() : "-"}
              </td>
              <td>{new Date(s.endDate).toLocaleDateString()}</td>
              <td
                style={{
                  color: s.status === "ACTIVE" ? "lime" : "red",
                }}
              >
                {s.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubscriptions;
