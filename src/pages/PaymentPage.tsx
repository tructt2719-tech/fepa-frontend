import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  User,
  Crown,
} from "lucide-react";
import "../styles/payment.css";

interface PaymentPageProps {
  onBack: () => void;
  onSuccess: () => void;
  // Giả sử bạn lấy email từ context hoặc props của User đang đăng nhập
  userEmail?: string; 
}

export default function PaymentPage({ onBack, onSuccess, userEmail = "test@example.com" }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo" | "zalopay">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

// PaymentPage.tsx

const handlePayment = async () => {
  setIsProcessing(true);
  try {
    // Lấy thông tin user đang login từ localStorage (khớp với logic auth.py)
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;
    const currentUser = JSON.parse(savedUser);

    const response = await fetch("http://localhost:8000/api/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email, // Gửi email để Backend biết user nào cần lên Premium
        subscription_id: 1        // Gửi mặc định là 1 để khớp với cấu hình gói
      }),
    });

    if (response.ok) {
      // Cập nhật lại role trong máy người dùng để hiển thị Crown ngay lập tức
      const updatedUser = { ...currentUser, role: 'Premium' };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setIsSuccess(true);
      setTimeout(onSuccess, 2000);
    } else {
      const err = await response.json();
      alert(err.detail);
    }
  } catch (error) {
    alert("Lỗi kết nối server");
  } finally {
    setIsProcessing(false);
  }
};

  /* ── GIAO DIỆN KHI THÀNH CÔNG ───────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="success-container"
      >
        <div className="success-icon">
          <CheckCircle2 size={42} />
        </div>

        <h2 className="success-title">Payment Successful!</h2>
        <p className="success-desc">
          Welcome to <b>FEPA Premium</b>. Your account is now upgraded 🎉
        </p>

        <div className="success-extra">
          <Crown size={18} />
          <div>
            <div className="success-extra-title">Premium Member</div>
            <div className="success-extra-sub">Active for 1 month</div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── GIAO DIỆN CHÍNH ─────────────────────────────────────────────── */
  return (
    <div className="payment-container">
      <div className="payment-frame">
        {/* HEADER */}
        <div className="payment-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} className="back-icon" />
          </button>
          <div className="Complete-payment">
            <h1 className="payment-title">Complete Payment</h1>
            <p className="payment-subtitle">Secure checkout</p>
          </div>
        </div>

        <div className="payment-grid">
          {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
          <div className="payment-box">
            <h3>Payment Method</h3>

            <div className="method-grid">
              <button
                className={`method-card ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="method-icon card">
                  <CreditCard size={20} />
                </div>
                <span>Card</span>
              </button>

              <button
                className={`method-card ${paymentMethod === "momo" ? "active" : ""}`}
                onClick={() => setPaymentMethod("momo")}
              >
                <div className="method-icon momo">M</div>
                <span>MoMo</span>
              </button>

              <button
                className={`method-card ${paymentMethod === "zalopay" ? "active" : ""}`}
                onClick={() => setPaymentMethod("zalopay")}
              >
                <div className="method-icon zalo">Z</div>
                <span>ZaloPay</span>
              </button>
            </div>

            {/* THÔNG TIN THẺ (CHỈ HIỂN THỊ KHI CHỌN CARD) */}
            {paymentMethod === "card" && (
              <div className="payment-box">
                <h3>Card Details</h3>

                <label className="form-label">Cardholder Name</label>
                <div className="input-icon">
                  <User size={16} />
                  <input className="form-input" placeholder="John Doe" />
                </div>

                <label className="form-label">Card Number</label>
                <div className="input-icon">
                  <CreditCard size={16} />
                  <input
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="row">
                  <div>
                    <label className="form-label">Expiry</label>
                    <div className="input-icon">
                      <Calendar size={16} />
                      <input className="form-input" placeholder="MM/YY" />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">CVV</label>
                    <div className="input-icon">
                      <Lock size={16} />
                      <input
                        className="form-input"
                        type="password"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <div style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>{error}</div>}

            <div className="payment-box security-box">
              <Lock size={16} />
              <p>Your payment information is encrypted and secure.</p>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="order-summary">
            <h3 className="order-title">Order Summary</h3>

            <div className="order-product">
              <div className="order-icon">
                <Crown size={20} />
              </div>
              <div>
                <div className="order-name">FEPA Premium</div>
                <div className="order-sub">1 Month Subscription</div>
              </div>
            </div>

            <div className="order-divider" />

            <div className="order-row">
              <span>Subtotal</span>
              <span>₫99,000</span>
            </div>

            <div className="order-row">
              <span>Tax (VAT 10%)</span>
              <span>₫9,900</span>
            </div>

            <div className="order-row discount">
              <span>First month discount</span>
              <span>-₫20,000</span>
            </div>

            <div className="order-divider" />

            <div className="order-total">
              <span>Total</span>
              <span>₫88,900</span>
            </div>
            
            <div className="order-note">
              After the first month, you'll be charged ₫108,900/month (including VAT)
            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay ₫88,900"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}