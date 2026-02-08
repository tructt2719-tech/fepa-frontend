import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const navStyle = (
    isActive: boolean,
    isHovered: boolean,
  ): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    marginBottom: "6px",
    color: isActive ? "#ffffff" : "#b3b3b3",
    background: isActive ? "#282828" : isHovered ? "#2a1f4d" : "transparent",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",

    transform: isHovered ? "translateX(6px)" : "none",
    boxShadow: isHovered ? "0 6px 18px rgba(155,92,255,0.35)" : "none",

    transition: "all 0.25s ease",
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#000000" }}>
      <aside
        style={{
          width: "240px",
          background: "#000000",
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "32px 24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              color: "#ffffff",
              fontSize: "22px",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🛡 Admin
          </h2>
        </div>

        <nav style={{ flex: 1, padding: "0 12px" }}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) =>
              navStyle(isActive, hoveredNav === "dashboard")
            }
            onMouseEnter={() => setHoveredNav("dashboard")}
            onMouseLeave={() => setHoveredNav(null)}
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="users"
            style={({ isActive }) => navStyle(isActive, hoveredNav === "users")}
            onMouseEnter={() => setHoveredNav("users")}
            onMouseLeave={() => setHoveredNav(null)}
          >
            👥 Users
          </NavLink>

          <NavLink
            to="subscriptions"
            style={({ isActive }) =>
              navStyle(isActive, hoveredNav === "subscriptions")
            }
            onMouseEnter={() => setHoveredNav("subscriptions")}
            onMouseLeave={() => setHoveredNav(null)}
          >
            💎 Subscriptions
          </NavLink>
        </nav>

        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={mainContent}>
        <div style={topGradient} />
        <div style={{ position: "relative", zIndex: 1, color: "#ffffff" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

/* ================= STYLES ================= */

const mainContent: React.CSSProperties = {
  flex: 1,
  padding: "40px",
  background: "linear-gradient(135deg, #190b3b, #981959)",
  position: "relative",
  overflowY: "auto",
};

const topGradient: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "300px",
  background: "linear-gradient(to bottom, rgba(178,176,176,0.15), transparent)",
  pointerEvents: "none",
};

const logoutBtn: React.CSSProperties = {
  margin: "16px",
  padding: "12px",
  background: "transparent",
  border: "1px solid #333",
  color: "#f87171",
  borderRadius: "24px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AdminLayout;
