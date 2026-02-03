// Profile.tsx (updated)
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Crown,
  User,
  Bell,
  Globe,
  Moon,
  Lock,
  LogOut,
  Download,
  Database,
  ChevronDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import "../styles/Profile.css";
import { PageHeader } from "./PageHeader";
import PaymentPage from "../pages/PaymentPage";
import "../styles/payment.css";
import SubscriptionModal from "./SubscriptionModal";

export default function Profile() {
  const navigate = useNavigate();
  const handleExportData = async () => {
    const loadingToast = toast.loading("Compiling all data...");

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "FEPA System";

      // 1. SHEET THÔNG TIN CÁ NHÂN
      const profileSheet = workbook.addWorksheet("Personal information");
      profileSheet.columns = [
        { header: "Category", key: "field", width: 25 },
        { header: "Detail", key: "value", width: 40 },
      ];
      profileSheet.addRows([
        { field: "Full name", value: userData.fullName },
        { field: "Email", value: userData.email },
        { field: "Phone number", value: userData.phone },
        { field: "Address", value: userData.address },
        { field: "Data export date", value: new Date().toLocaleString() },
      ]);
      profileSheet.getRow(1).font = { bold: true };

      // 2. GỌI API (Sử dụng URL chính xác từ backend của bạn)
      const [expensesRes, debtsRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/expenses/${userData.id}`),
        fetch(`http://127.0.0.1:8000/api/debts/${userData.id}`),
      ]);

      // 3. XỬ LÝ SHEET CHI TIÊU
      if (expensesRes.ok) {
        const expenses = await expensesRes.json();
        console.log("Check Expense Data:", expenses); // Debug xem data có về không

        if (Array.isArray(expenses) && expenses.length > 0) {
          const exSheet = workbook.addWorksheet("Spending history");
          exSheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Category", key: "category", width: 20 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Note", key: "note", width: 35 },
          ];

          // Backend (Expense.py) trả về: amount, category, date, note
          const mappedExpenses = expenses.map((item: any) => ({
            date: item.date,
            category: item.category,
            amount: item.amount,
            note: item.note || "",
          }));

          exSheet.addRows(mappedExpenses);
          exSheet.getRow(1).font = { bold: true };
          exSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFDDEBF7" },
          };
        }
      }

      // 4. XỬ LÝ SHEET KHOẢN NỢ
      if (debtsRes.ok) {
        const debts = await debtsRes.json();
        console.log("Check Debt Data:", debts);

        if (Array.isArray(debts) && debts.length > 0) {
          const debtSheet = workbook.addWorksheet("List of debts");
          debtSheet.columns = [
            { header: "Tên Name of the debt nợ", key: "debtName", width: 25 },
            { header: "Total amount", key: "amount", width: 15 },
            { header: "Paid", key: "paidAmount", width: 15 },
            { header: "Interest Rate (%)", key: "interestRate", width: 15 },
            { header: "Payment deadline", key: "dueDate", width: 20 },
          ];

          // LƯU Ý: Bạn cần kiểm tra xem Backend Debt trả về key gì.
          // Dưới đây là mapping phổ biến cho bảng Debt:
          const mappedDebts = debts.map((d: any) => ({
            debtName: d.debtName || d.name || "N/A",
            amount: d.amount || d.total || 0,
            paidAmount: d.paidAmount || d.paid || 0,
            interestRate: d.interestRate || d.interest || 0,
            dueDate: d.dueDate || d.nextPayment || "N/A",
          }));

          debtSheet.addRows(mappedDebts);
          debtSheet.getRow(1).font = { bold: true };
        }
      }

      // 5. XUẤT FILE
      const buffer = await workbook.xlsx.writeBuffer();
      const excelBlob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(excelBlob, `FEPA_Report_${userData.fullName || "User"}.xlsx`);
      toast.success("All data has been successfully exported!", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("API connection error!", { id: loadingToast });
    }
  };
  // ── STATE ────────────────────────────────────────────────────────────────
  const [userData, setUserData] = useState({
    id: 0,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    two_factor_method: "none", // Thêm trường mới từ user data
  });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanProgress, setScanProgress] = useState(6);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // State chính để render giao diện

  const handleChangePassword = () => {
    alert("Change password clicked");
    setShowChangePassword(false);
  };
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Budget Alerts",
      desc: "Get notified when approaching budget limits",
      active: true,
    },
    {
      id: 2,
      title: "Expense Reminders",
      desc: "Daily reminders to log expenses",
      active: true,
    },
    {
      id: 3,
      title: "Goal Milestones",
      desc: "Celebrate when you reach savings milestones",
      active: true,
    },
    {
      id: 4,
      title: "Payment Due Dates",
      desc: "Reminders for upcoming bill payments",
      active: true,
    },
    {
      id: 5,
      title: "Financial Tips",
      desc: "Weekly personalized financial advice",
      active: false,
    },
  ]);

  // State cho modal Change Password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── LOAD USER & MODELS ──────────────────────────────────────────────────
  // ── LOAD USER & MODELS ──────────────────────────────────────────────────
  useEffect(() => {
    // 1. Chỉ khai báo biến một lần duy nhất
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserData(parsed);

        // Cập nhật trạng thái bảo mật
        setTwoFactor(parsed.two_factor_method === "otp");
        setBiometric(parsed.two_factor_method === "biometric");

        // 2. GỌI API CHECK PREMIUM NGAY KHI LOAD TRANG
        // Điều này đảm bảo render đúng "Premium" từ Database ngay lập tức
        if (parsed.email) {
          fetchPremiumStatus(parsed.email);
        }
      } catch (err) {
        console.error("Error parsing users from localStorage:", err);
      }
    }

    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        console.log("Loading face-api.js models...");
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("All face-api models loaded ✓");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model loading error:", err);
        toast.error("The facial recognition model could not be loaded.");
      }
    };

    loadModels();

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      event.preventDefault();
    };
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  // 3. ĐỊNH NGHĨA HÀM FETCH PREMIUM STATUS
  const fetchPremiumStatus = async (email: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/check-premium-status?email=${email}`,
      );
      const data = await res.json();

      // Cập nhật state isPremium để thay đổi giao diện
      setIsPremium(data.isPremium);

      // Cập nhật lại userData để đồng bộ isActive và subscriptionID mới nhất
      setUserData((prev) => ({
        ...prev,
        subscriptionID: data.subscriptionID,
        isActive: data.isActive,
      }));
    } catch (err) {
      console.error("Premium checkout error:", err);
    }
  };
  // ── FACE DETECTION REALTIME ─────────────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isScanning && videoRef.current && canvasRef.current && modelsLoaded) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const startDetection = () => {
        if (!video.videoWidth || !video.videoHeight) return;

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        let faceDetectedCount = 0;
        let missingFaceCount = 0;

        interval = setInterval(async () => {
          if (!isScanning) return;

          try {
            const detections = await faceapi
              .detectAllFaces(
                video,
                new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 }),
              )
              .withFaceLandmarks();

            if (detections.length > 0) {
              faceDetectedCount++;
              missingFaceCount = 0;
              if (faceDetectedCount >= 4) setFaceDetected(true);
            } else {
              missingFaceCount++;
              faceDetectedCount = 0;
              if (missingFaceCount >= 12) setFaceDetected(false);
            }

            const resized = faceapi.resizeResults(detections, displaySize);
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              faceapi.draw.drawFaceLandmarks(canvas, resized);
            }
          } catch (err) {
            console.warn("Detection error:", err);
            setFaceDetected(false);
          }
        }, 100);
      };

      if (video.readyState >= 2) {
        startDetection();
      } else {
        video.onloadedmetadata = startDetection;
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, modelsLoaded]);

  // ── AUTO COMPLETE SCAN ──────────────────────────────────────────────────
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      isScanning &&
      faceDetected &&
      cameraStream &&
      !isProcessing &&
      modelsLoaded
    ) {
      timer = setInterval(() => {
        setScanProgress((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setIsProcessing(true);
            finishBiometricRegistration(cameraStream);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setScanProgress(6);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isScanning, faceDetected, cameraStream, isProcessing, modelsLoaded]);

  // ── BIOMETRIC TOGGLE ────────────────────────────────────────────────────
  const handleToggleBiometric = async (enabled: boolean) => {
    if (!enabled) {
      try {
        const res = await fetch(
          `http://localhost:8000/api/toggle-biometric?email=${userData.email}&enable=false`,
          { method: "POST" },
        );
        if (res.ok) {
          const { new_method } = await res.json();
          updateLocalUserData(new_method);
          setBiometric(false);
          toast.success("Biometric login has been disabled.");
        }
      } catch (err) {
        toast.error("Error when disabling biometric mode.");
      }
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/toggle-biometric?email=${userData.email}&enable=true`,
        { method: "POST" },
      );
      const result = await res.json();
      if (result.status === "need_registration") {
        setIsScanning(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setCameraStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } else {
        updateLocalUserData(result.new_method);
        setBiometric(true);
        setTwoFactor(false);
        toast.success("Biometric login has been activated.");
      }
    } catch (err) {
      toast.error("Server connection error");
    }
  };

  const finishBiometricRegistration = async (stream: MediaStream) => {
    try {
      setIsProcessing(true);
      const detection = await faceapi
        .detectSingleFace(
          videoRef.current!,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        toast.error("The face was not captured clearly.");
        return;
      }

      stream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsScanning(false);

      const faceDescriptor = JSON.stringify(Array.from(detection.descriptor));

      const res = await fetch(
        "http://localhost:8000/api/register-biometric-key",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email, key: faceDescriptor }),
        },
      );

      if (res.ok) {
        updateLocalUserData("biometric");
        setBiometric(true);
        toast.success("Face saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.detail || "Face ID saving error");
      }
    } catch (err) {
      toast.error("Error saving FaceID");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setIsScanning(false);
    setFaceDetected(false);
    setIsProcessing(false);
  };

  const handleToggle2FA = async (enabled: boolean) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/toggle-2fa?email=${userData.email}&enable=${enabled}`,
        { method: "POST" },
      );
      if (res.ok) {
        const { new_method } = await res.json();
        const updated = { ...userData, two_factor_method: new_method };
        setUserData(updated);
        setTwoFactor(enabled);
        if (enabled) setBiometric(false);
        localStorage.setItem("user", JSON.stringify(updated));
        toast.success(
          enabled ? "2FA has been enabled." : "2FA has been turned off.",
        );
      } else {
        toast.error("Server error");
      }
    } catch {
      toast.error("Connection error");
    }
  };

  const updateLocalUserData = (newMethod: string) => {
    const updated = { ...userData, two_factor_method: newMethod };
    setUserData(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("The information has been updated!");
      } else {
        toast.error("Update error");
      }
    } catch {
      toast.error("Connection error");
    }
  };

  const handleSignOut = () => {
    // Chỉ xóa các thông tin đăng nhập
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");

    // Nếu bạn có lưu trạng thái đăng nhập riêng lẻ thì xóa thêm ở đây
    // localStorage.removeItem("isLoggedIn");

    // Điều hướng về trang login
    navigate("/", { replace: true });

    toast.success("Logged out successfully!");
  };

  const toggleNotification = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n)),
    );
    toast("Set up update notifications", { icon: "🔔" });
  };
  const handleDeleteAccount = async () => {
    const result1 = await Swal.fire({
      title: "Confirm account deletion?",
      text: "All personal data, transaction history, savings goals, etc., will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete the account.",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result1.isConfirmed) return;

    const result2 = await Swal.fire({
      title: "Final confirmation!",
      text: "Are you sure you want to delete it? It cannot be recovered.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete immediately",
      cancelButtonText: "I changed my mind.",
      reverseButtons: true,
    });

    if (!result2.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:8000/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });

      if (res.ok) {
        toast.success("The account has been deleted!");
        localStorage.clear();
        navigate("/");
      } else {
        toast.error("Account deletion error");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

  const handleDeleteFaceID = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/delete-biometric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userData.email }),
      });

      const text = await res.text();
      console.log("[DELETE-FACEID] Status:", res.status, "Body:", text);

      if (res.ok) {
        let data = JSON.parse(text);
        updateLocalUserData("none");
        setBiometric(false);
        toast.success("FaceID has been successfully deleted!");
      } else {
        let errMsg = "Server error";
        try {
          const err = JSON.parse(text);
          errMsg = err.detail || text;
        } catch {}
        toast.error(errMsg);
      }
    } catch (err) {
      toast.error("Unable to connect to the server.");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="profile-container">
      <Toaster position="top-center" reverseOrder={false} />
      <main className="profile-main">
        <div className="profile-title-section">
          <PageHeader
            title="Settings"
            subtitle={`ID: ${userData.id} 
            `}
          />
        </div>

        {/* ===== CURRENT PLAN CARD ===== */}
        <div className={`plan-card ${isPremium ? "premium-active" : ""}`}>
          <div className="plan-info">
            <div className="plan-icon">
              {isPremium ? <Crown size={24} color="#facc15" /> : "👑"}
            </div>
            <div>
              <h3>{isPremium ? "Premium Plan" : "Free Plan"}</h3>
              <p>
                {isPremium
                  ? " You have unlocked all premium features!"
                  : "Upgrade to unlock advanced features"}
              </p>
            </div>
          </div>

          {!isPremium ? (
            <button
              className="choose-plan-btn"
              onClick={() => setShowSubscription(true)}
            >
              Choose a Plan
            </button>
          ) : (
            <div className="premium-badge">Activated</div>
          )}
        </div>

        {showSubscription && (
          <SubscriptionModal
            onClose={() => setShowSubscription(false)}
            onUpgrade={() => {
              setShowSubscription(false);
              setShowPayment(true);
            }}
          />
        )}
        {/* ===== PAYMENT SECTION ===== */}
        {showPayment && (
          <div className="payment-overlay">
            <div className="payment-model">
              <PaymentPage
                onBack={() => {
                  setShowPayment(false);
                  setShowSubscription(true);
                }}
                onSuccess={() => {
                  setShowPayment(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="profile-section">
          <div className="section-header">
            <User size={18} color="var(--link)" /> <span>Account Settings</span>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                name="fullName"
                className="form-input"
                value={userData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                value={userData.email}
                readOnly
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                className="form-input"
                value={userData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                name="address"
                className="form-input"
                value={userData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-input"
                value={userData.gender}
                onChange={handleInputChange}
                // Bạn có thể giữ lại style inline nếu muốn ghi đè nhanh,
                // nhưng nên ưu tiên biến CSS
              >
                <option value="" className="option-item">
                  -- Select gender --
                </option>
                <option value="male" className="option-item">
                  Male
                </option>
                <option value="female" className="option-item">
                  Female
                </option>
                <option value="other" className="option-item">
                  Others
                </option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">BirthDay</label>
              <input
                type="date" /* Quan trọng: Chuyển sang kiểu date */
                name="dob"
                className="form-input"
                value={userData.dob}
                onChange={handleInputChange}
                /* Bạn có thể thêm các thuộc tính giới hạn nếu cần */
                max="2026-12-31"
                min="1900-01-01"
              />
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>

        {/* Security */}
        <div className="profile-section">
          <div className="section-header">
            <Lock size={18} color="var(--link)" /> <span>Security</span>
          </div>
          <div className="setting-item">
            <div>
              <div className="setting-title">Two-Factor Authentication</div>
              <div className="setting-desc">
                {twoFactor
                  ? "Security is being activated."
                  : "An OTP code will be required when logging in."}
              </div>
            </div>
            <Switch checked={twoFactor} onChange={handleToggle2FA} />
          </div>
          <div className="setting-item">
            <div>
              <div className="setting-title">Biometric Login</div>
              <div className="setting-desc">
                Fingerprint or facial recognition
              </div>
            </div>
            <Switch checked={biometric} onChange={handleToggleBiometric} />
          </div>

          {/* Nút Xóa FaceID - chỉ hiện khi đã bật biometric */}
          {biometric && (
            <button
              className="delete-btn"
              style={{
                marginTop: "12px",
                background: "#ff4d4d",
                color: "white",
              }}
              onClick={handleDeleteFaceID}
            >
              Delete registered Face ID
            </button>
          )}

          <button
            className="change-password-btn"
            onClick={() => setShowChangePassword(true)}
            style={{ marginTop: "12px" }}
          >
            Change Password
          </button>
        </div>

        {/* Notifications */}
        <div className="profile-section">
          <div className="section-header">
            <Bell size={18} color="var(--link)" /> <span>Notifications</span>
          </div>
          {notifications.map((item) => (
            <div key={item.id} className="setting-item">
              <div>
                <div className="setting-title">{item.title}</div>
                <div className="setting-desc">{item.desc}</div>
              </div>
              <Switch
                checked={item.active}
                onChange={() => toggleNotification(item.id)}
              />
            </div>
          ))}
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label className="form-label">Base Currency</label>
            <div className="select-wrapper">
              <select
                className="form-input"
                onChange={() => handleAction("Currency has been updated!")}
              >
                <option>VND (đ) - Vietnamese Dong</option>
                <option>USD ($) - US Dollar</option>
              </select>
              <ChevronDown size={16} className="select-icon" />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="profile-section">
          <div className="section-header">
            <Database size={18} color="var(--link)" />{" "}
            <span>Data & Privacy</span>
          </div>
          <button
            className="action-btn"
            onClick={handleExportData} // Truyền trực tiếp tên hàm, không cần arrow function nếu không có tham số
          >
            <Download size={16} /> Export Financial Data (Excel)
          </button>
          <button
            className="delete-btn"
            onClick={handleDeleteAccount} // Gắn đúng hàm xử lý xóa
          >
            Delete Account
          </button>
        </div>

        <button className="signout-btn" onClick={handleSignOut}>
          <LogOut size={18} /> Sign Out
        </button>
      </main>

      {/* ── CAMERA MODAL ──────────────────────────────────────────────────── */}
      {isScanning && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <h3>FEPA AI FACE RECOGNITION</h3>

            <div
              className="camera-view"
              style={{
                position: "relative",
                width: "480px",
                height: "480px",
                margin: "0 auto",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <canvas
                ref={canvasRef}
                width={480}
                height={480}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                }}
              />

              {faceDetected && !isProcessing && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#4ade80",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "3px solid #4ade80",
                  }}
                >
                  {scanProgress}s
                </div>
              )}
              <div className="scan-line" />
            </div>

            <p
              style={{
                margin: "16px 0",
                fontWeight: "bold",
                color: faceDetected ? "#4ade80" : "#ff4d4d",
              }}
            >
              {isProcessing
                ? "Saving facial data..."
                : faceDetected
                  ? `Identified! Please remain still for another ${scanProgress} seconds...`
                  : "No face found! Please place your face in front of the camera."}
            </p>

            <div
              style={{ display: "flex", gap: "16px", justifyContent: "center" }}
            >
              <button onClick={resetScan} className="cancel-btn">
                Hủy bỏ
              </button>
              {!faceDetected && (
                <button
                  onClick={resetScan}
                  style={{
                    background: "#444",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Thử lại
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ────────────────────────────────────────────── */}
      {showChangePassword && (
        <div className="camera-modal-overlay" style={{ zIndex: 1001 }}>
          <div
            className="camera-modal"
            style={{ maxWidth: "400px", padding: "24px" }}
          >
            <h3>Change Password</h3>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">Old password</label>
              <input
                type="password"
                className="form-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="form-label">New password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label className="form-label">Confirm new password</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password."
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowChangePassword(false)}
                style={{
                  padding: "10px 20px",
                  background: "#444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                style={{
                  padding: "10px 20px",
                  background: "#4ade80",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Change password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`slider ${checked ? "checked" : ""}`} />
    </label>
  );
}
