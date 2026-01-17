import { NavLink } from "react-router-dom";

const menus = [
  { label: "Dashboard", path: "/" },
  { label: "Expenses", path: "/expenses" },
  { label: "Budgets", path: "/budgets" },
  { label: "Debts", path: "/debts" },
  { label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">FEPA</h2>

      {menus.map((m) => (
        <NavLink
          key={m.path}
          to={m.path}
          className={({ isActive }) =>
            isActive ? "menu active" : "menu"
          }
        >
          {m.label}
        </NavLink>
      ))}
    </aside>
  );
}
