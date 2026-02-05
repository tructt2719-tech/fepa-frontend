import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
