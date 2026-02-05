import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  role: string;
  active: boolean;
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  // BƯỚC 1: CHẶN USER KHÔNG PHẢI ADMIN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "ADMIN") {
      navigate("/login");
    }
  }, [navigate]);

  // BƯỚC 2: LOAD USER TỪ BACKEND
  useEffect(() => {
    fetch("http://localhost:8000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  // BƯỚC 3: ACTIVATE / DEACTIVATE USER
  const toggleStatus = async (userId: number, active: boolean) => {
    await fetch("http://localhost:8000/api/admin/users/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        isActive: active ? 0 : 1,
      }),
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)),
    );
  };

  return (
    <div>
      <h1 style={{ color: "#fff", marginBottom: "24px" }}>User Management</h1>

      <div
        style={{
          background: "#181818",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#000", color: "#b3b3b3" }}>
              <th style={thTdStyle}>Email</th>
              <th style={thTdStyle}>Role</th>
              <th style={thTdStyle}>Status</th>
              <th style={thTdStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #282828" }}>
                <td style={thTdStyle}>{u.email}</td>

                <td style={thTdStyle}>
                  <span style={roleBadge}>{u.role}</span>
                </td>

                <td
                  style={{
                    ...thTdStyle,
                    color: u.active ? "#1db954" : "#f87171",
                    fontWeight: "bold",
                  }}
                >
                  {u.active ? "● Active" : "○ Inactive"}
                </td>

                <td style={thTdStyle}>
                  <button
                    onClick={() => toggleStatus(u.id, u.active)}
                    style={{
                      ...actionBtn,
                      borderColor: u.active ? "#f87171" : "#1db954",
                    }}
                  >
                    {u.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const thTdStyle = {
  padding: "16px",
  color: "#ffffff",
  fontSize: "14px",
};

const roleBadge = {
  background: "#333",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  color: "#a855f7",
};

const actionBtn = {
  background: "transparent",
  border: "1px solid #535353",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "20px",
  cursor: "pointer",
};

export default AdminUsers;
