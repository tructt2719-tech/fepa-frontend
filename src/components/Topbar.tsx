import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User
} from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("fepa-theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fepa-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="logo">
          <div className="logo-circle">F</div>
          FEPA
        </div>
        <nav className="top-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/debts">Debts</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </nav>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>

        {/* Nút chuyển đổi theme */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="icon-btn notification">
          <Bell size={18} />
          <span className="dot" />
        </button>

        <div 
          className="avatar" 
          onClick={goToProfile}
          style={{ cursor: "pointer" }}
          title="Trang cá nhân"
        >
          <User size={18} />
        </div>
      </div>
    </header>
  );
}
