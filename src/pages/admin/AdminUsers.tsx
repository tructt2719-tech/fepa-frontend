import { useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, email: "user1@gmail.com", role: "user", active: true },
    { id: 2, email: "user2@gmail.com", role: "user", active: false },
    { id: 3, email: "admin@gmail.com", role: "admin", active: true },
  ]);

  const toggleStatus = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
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
            <tr
              style={{
                background: "#000",
                color: "#b3b3b3",
                textAlign: "left",
              }}
            >
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
                    onClick={() => toggleStatus(u.id)}
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

const thTdStyle = { padding: "16px", color: "#ffffff", fontSize: "14px" };
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
