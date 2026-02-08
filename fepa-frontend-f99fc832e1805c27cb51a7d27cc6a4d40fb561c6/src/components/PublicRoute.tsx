// 🛡️ CHỈ CHO PHÉP TRUY CẬP KHI CHƯA LOGIN
const PublicRoute = () => {
  const user = localStorage.getItem("user");
  // Nếu đã login, chặn không cho vào Login/Register, đẩy về Dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};