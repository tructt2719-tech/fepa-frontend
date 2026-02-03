import { useNavigate } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import "../styles/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Mật khẩu mới
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Bước 1: Kiểm tra email và gửi OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API check-email từ Backend (FastAPI)
      const checkRes = await fetch(`http://localhost:8000/api/check-email?email=${encodeURIComponent(email)}`);
      
      if (checkRes.ok) {
        // Nếu ok = true tức là email CHƯA có (Backend của bạn trả về available: true)
        // Nhưng ở đây ta cần email ĐÃ CÓ để reset. 
        // Lưu ý: Route /api/check-email của bạn trả về 400 nếu email tồn tại.
        setLoading(false);
        Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Email này không tồn tại trên hệ thống!' });
        return;
      }

      // Nếu checkRes.status === 400 (Email tồn tại - theo logic file auth.py của bạn)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("reset_otp", otp);
      localStorage.setItem("reset_email", email);

      await emailjs.send(
        "service_7y26eqp", 
        "template_mcvqowq", 
        {
          user_email: email,
          message: `Mã khôi phục mật khẩu của bạn là: ${otp}`,
        },
        "BUHtg1BuVtAPT9O2M"
      );

      Swal.fire({ icon: 'success', title: 'Đã gửi mã!', text: 'Vui lòng kiểm tra email.' });
      setStep(2);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể kết nối server.' });
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực mã OTP
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const savedOtp = localStorage.getItem("reset_otp");
    if (otpInput === savedOtp) {
      setStep(3);
    } else {
      Swal.fire({ icon: 'error', title: 'Sai mã', text: 'Mã xác thực không chính xác.' });
    }
  };

  // Bước 3: Cập nhật mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'error', text: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    try {
      // Giả sử bạn có route /api/update-password ở backend
      const response = await fetch("http://localhost:8000/api/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword })
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Thành công', text: 'Mật khẩu đã được đổi!' });
        localStorage.removeItem("reset_otp");
        localStorage.removeItem("reset_email");
        navigate("/");
      }
    } catch (err) {
      Swal.fire({ icon: 'error', text: 'Lỗi cập nhật mật khẩu.' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 style={{ color: 'white' }}>Reset Password</h1>
        
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <p className="subtitle">Nhập email của bạn để nhận mã khôi phục</p>
            <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={loading}>{loading ? "Checking..." : "Send OTP →"}</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="subtitle">Nhập mã 6 số đã gửi tới {email}</p>
            <input placeholder="000000" maxLength={6} style={{ textAlign: 'center', letterSpacing: '8px' }} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
            <button type="submit">Verify Code →</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p className="subtitle">Thiết lập mật khẩu mới</p>
            <input type="password" placeholder="New Password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm New Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="submit">Update Password →</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;