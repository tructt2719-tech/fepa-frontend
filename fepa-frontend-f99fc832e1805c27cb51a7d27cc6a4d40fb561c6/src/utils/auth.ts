export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  // Xóa toàn bộ trạng thái đăng nhập
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Nếu bạn dùng sessionStorage thì xóa thêm
  sessionStorage.clear();
};
