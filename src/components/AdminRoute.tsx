import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
  } catch {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
