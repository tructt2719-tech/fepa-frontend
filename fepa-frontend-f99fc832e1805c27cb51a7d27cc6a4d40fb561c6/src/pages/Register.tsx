import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import "../styles/auth.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (password !== confirm) {
    Swal.fire({ icon: 'error', title: 'Lỗi!', text: 'Mật khẩu xác nhận không khớp!' });
    return;
  }

  setLoading(true);

  try {
    // 1. Kiểm tra email (Đảm bảo URL đầy đủ nếu không dùng proxy)
    const checkRes = await fetch(`http://localhost:8000/api/check-email?email=${encodeURIComponent(email)}`);
    const checkData = await checkRes.json();

    if (!checkRes.ok) {
      Swal.fire({ icon: 'error', title: 'Lỗi đăng ký', text: checkData.detail || "Email đã tồn tại" });
      setLoading(false);
      return; 
    }

    // 2. Tạo dữ liệu tạm
    const randomId = Math.floor(100000 + Math.random() * 900000);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000;

    // 3. Lưu vào LocalStorage để trang Verify có thể truy cập nếu reload
    localStorage.setItem("otp_code", otp);
    localStorage.setItem("otp_expiry", expiry.toString());
    localStorage.setItem("pending_email", email); 
    localStorage.setItem("pending_user", JSON.stringify({ 
      id: randomId, 
      email, 
      password, 
      phone 
    }));

    // 4. Gửi OTP qua EmailJS
    await emailjs.send(
      "service_7y26eqp",
      "template_mcvqowq",
      {
        user_email: email,
        to_name: email,
        from_name: "FEPA",
        message: `Mã xác thực FEPA của bạn là: ${otp}. ID tài khoản: ${randomId}`,
      },
      "BUHtg1BuVtAPT9O2M"
    );

    Swal.fire({
      icon: 'success',
      title: 'Đã gửi mã OTP!',
      text: `Vui lòng kiểm tra email: ${email}`,
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      // QUAN TRỌNG: Truyền state email sang trang Verify để tránh lỗi undefined
      navigate("/verify", { state: { email: email, method: "otp" } });
    });

  } catch (error: any) {
    console.error("Register Error:", error);
    Swal.fire({ icon: 'error', title: 'Lỗi hệ thống', text: "Không thể kết nối đến server cổng 8000" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 style={{ color: 'white' }}>Create Account</h1>
        <form onSubmit={handleRegister}>
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          <input placeholder="Phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Sign Up →"}</button>
        </form>
        <div className="auth-links">Already have an account? <Link to="/">Sign in</Link></div>
      </div>
    </div>
  );
};

export default Register;