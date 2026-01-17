import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import "../styles/layout.css";

export default function Layout() {
  return (
    <div className="app-layout">
      <Topbar />

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
