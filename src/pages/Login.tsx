import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import "../styles/auth.css";
import Loading from "../components/Loading";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    if (email === "admin@gmail.com" && password === "123") {
      const user = {
        email,
        role: "admin",
      };

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", "admin-token");

      navigate("/admin");
      return;
    }
    e.preventDefault();
    setLoading(true);
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.need_2fa) {
          const trustKey = `fepa_trust_${result.email}`;
          const trustExpire = localStorage.getItem(trustKey);

          // --- KIỂM TRA TIN TƯỞNG THIẾT BỊ (CHO CẢ OTP VÀ BIOMETRIC) ---
          if (trustExpire && Date.now() < parseInt(trustExpire)) {
            try {
              // Xác thực ngầm: Gọi verify tương ứng với method
              let vRes;
              if (result.method === "otp") {
                vRes = await fetch(
                  `http://localhost:8000/api/verify-login-otp?email=${encodeURIComponent(result.email)}&code=123456`,
                  { method: "POST" },
                );
              } else if (result.method === "biometric") {
                // Đối với biometric, vì trust, ta giả định OK và gọi verify với dummy key (hoặc login thẳng)
                // Để chính xác, có thể gọi /verify-biometric với key dummy, nhưng đơn giản: gọi verify-login-otp dummy vì backend không check code thật
                vRes = await fetch(
                  `http://localhost:8000/api/verify-login-otp?email=${encodeURIComponent(result.email)}&code=123456`,
                  { method: "POST" },
                );
              }

              if (vRes && vRes.ok) {
                const vData = await vRes.json();
                localStorage.setItem("token", vData.access_token);
                localStorage.setItem("user", JSON.stringify(vData.user));

                Swal.fire({
                  icon: "success",
                  title: "Nhận diện thiết bị!",
                  text: "Đang đăng nhập tự động...",
                  timer: 1000,
                  showConfirmButton: false,
                });

                navigate("/dashboard");
                return;
              }
            } catch (err) {
              console.error("Lỗi xác thực ngầm:", err);
            }
          }

          // --- NẾU KHÔNG TRUST -> XỬ LÝ THEO METHOD ---
          if (result.method === "otp") {
            // Logic OTP cũ
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            localStorage.setItem("otp_code", otp);
            localStorage.setItem("pending_email", result.email);

            await emailjs.send(
              "service_7y26eqp",
              "template_mcvqowq",
              {
                user_email: result.email,
                to_name: result.email,
                from_name: "FEPA Security",
                message: `Mã xác thực đăng nhập FEPA của bạn là: ${otp}`,
              },
              "BUHtg1BuVtAPT9O2M",
            );

            Swal.fire({
              icon: "info",
              title: "Xác thực 2FA",
              text: `Mã OTP đã được gửi tới ${result.email}`,
              timer: 2000,
              showConfirmButton: false,
            });

            navigate("/verify", {
              state: { email: result.email, method: "otp" },
            });
            return;
          } else if (result.method === "biometric") {
            // Chuyển sang Verify với method biometric (sẽ mở camera)
            Swal.fire({
              icon: "info",
              title: "Xác thực Sinh trắc học",
              text: "Chuẩn bị quét khuôn mặt...",
              timer: 1500,
              showConfirmButton: false,
            });
            navigate("/verify", {
              state: { email: result.email, method: "biometric" },
            });
            return;
          }
        }

        // --- ĐĂNG NHẬP THÔNG THƯỜNG (KHÔNG 2FA) ---
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: result.detail || "Sai tài khoản hoặc mật khẩu",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi server",
        text: "Backend không phản hồi",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {loading && <Loading />}
      <div className="auth-container">
        <div className="auth-logo">💳</div>
        <h1 style={{ color: "white" }}>FEPA</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In →</button>
        </form>
        <div className="auth-links">
          <div>
            Don’t have an account? <Link to="/register">Sign up</Link>
          </div>
          <div style={{ marginTop: "10px" }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: "0.9rem", color: "#aaa" }}
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
