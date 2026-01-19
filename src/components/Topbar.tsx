import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User
} from "lucide-react";

export default function Topbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <header className="topbar">
      {/* LEFT */}
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
          <NavLink to="/analytics" className="nav-item">
          Analytics
</NavLink>

        </nav>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>

        {/* THEME TOGGLE */}
        <button
          className="icon-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
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
          title="Trang cá nhân"  // tooltip khi hover
        >
          <User size={18} />
        </div>
      </div>
    </header>
  );
}

