  import { useNavigate, useLocation } from "react-router-dom";
  import { useState, useEffect, useRef } from "react";
  import * as faceapi from 'face-api.js';
  import Swal from "sweetalert2";
  import "../styles/auth.css";

  const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email: verifyEmail, method = "otp" } = location.state || {};

    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [trustDevice, setTrustDevice] = useState(false);

    // Biometric states
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [scanProgress, setScanProgress] = useState(2);
    const [faceDetected, setFaceDetected] = useState(false);
    const [isScanning, setIsScanning] = useState(method === "biometric");
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ── LOAD MODELS & OPEN CAMERA (chỉ cho biometric) ────────────────────────
    useEffect(() => {
      if (method === "otp") {
        setTimeLeft(300); // 5 phút cho OTP
      } else if (method === "biometric") {
        const loadModels = async () => {
          try {
            const MODEL_URL = '/models';
            await Promise.all([
              faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
              faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
              faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
            setModelsLoaded(true);
          } catch (err) {
            console.error("Lỗi tải model:", err);
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không tải được mô hình quét mặt.' });
          }
        };
        loadModels();

        const openCamera = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            setCameraStream(stream);
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (err) {
            Swal.fire({ icon: 'error', title: 'Lỗi camera', text: 'Không mở được camera. Vui lòng cấp quyền.' });
          }
        };
        openCamera();
      }

      // Cleanup khi unmount
      return () => {
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
        }
      };
    }, [method]);

    // ── OTP COUNTDOWN (nếu có expiry) ───────────────────────────────────────
    useEffect(() => {
      if (method === "otp") {
        const expiry = localStorage.getItem("otp_expiry");
        if (expiry) {
          const timer = setInterval(() => {
            const remaining = Math.floor((parseInt(expiry) - Date.now()) / 1000);
            setTimeLeft(remaining > 0 ? remaining : 0);
            if (remaining <= 0) {
              clearInterval(timer);
              Swal.fire({ icon: 'warning', title: 'Hết hạn!', text: 'Mã OTP đã hết hiệu lực.' }).then(() => navigate("/login"));
            }
          }, 1000);
          return () => clearInterval(timer);
        }
      }
    }, [method, navigate]);

    // ── FACE DETECTION REALTIME ─────────────────────────────────────────────
    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;

      if (isScanning && videoRef.current && canvasRef.current && modelsLoaded) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const handleVideoMetadata = () => {
          // Resize canvas theo kích thước video thực tế
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const displaySize = { width: video.videoWidth, height: video.videoHeight };
          faceapi.matchDimensions(canvas, displaySize);

          let faceDetectedCount = 0;
          let missingFaceCount = 0;

          interval = setInterval(async () => {
            if (!isScanning) return;

            try {
              const detections = await faceapi
                .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.35 }))
                .withFaceLandmarks();

              if (detections.length > 0) {
                faceDetectedCount++;
                missingFaceCount = 0;
                if (faceDetectedCount >= 4) {
                  setFaceDetected(true);
                }
              } else {
                missingFaceCount++;
                faceDetectedCount = 0;
                if (missingFaceCount >= 12) {
                  setFaceDetected(false);
                }
              }

              const resizedDetections = faceapi.resizeResults(detections, displaySize);
              const ctx = canvas.getContext("2d", { willReadFrequently: true });
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
              }
            } catch (err) {
              console.warn("Detection error:", err);
              setFaceDetected(false);
            }
          }, 100);
        };

        if (video.readyState >= 2) {
          handleVideoMetadata();
        } else {
          video.onloadedmetadata = handleVideoMetadata;
        }
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isScanning, modelsLoaded]);

    // ── COUNTDOWN & AUTO VERIFY ─────────────────────────────────────────────
    useEffect(() => {
      let timer: NodeJS.Timeout | null = null;

      if (isScanning && faceDetected && cameraStream && !isProcessing && modelsLoaded) {
        timer = setInterval(() => {
          setScanProgress((prev) => {
            if (prev <= 1) {
              clearInterval(timer!);
              setIsProcessing(true);
              verifyBiometricFace(cameraStream);
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

    // ── VERIFY BIOMETRIC ────────────────────────────────────────────────────
const verifyBiometricFace = async (stream: MediaStream) => {
  try {
    setIsProcessing(true);

    const detection = await faceapi
      .detectSingleFace(videoRef.current!, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.45 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      if (stream) stream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsScanning(false);
      
      await Swal.fire({
        icon: 'error',
        title: 'Xác minh sinh trắc học thất bại',
        timer: 2000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
        allowOutsideClick: false
      });
      window.location.reload();
      return;
    }

    const descriptorArray = Array.from(detection.descriptor);
    const res = await fetch("http://localhost:8000/api/verify-biometric", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: verifyEmail, key: JSON.stringify(descriptorArray) }),
    });

    const result = await res.json();
    if (stream) stream.getTracks().forEach(track => track.stop());
    setCameraStream(null);
    setIsScanning(false);

    if (res.ok && result.access_token) {
      // ✅ THÀNH CÔNG -> XỬ LÝ LƯU TRUST DEVICE TẠI ĐÂY
      if (trustDevice) {
        const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 giờ
        localStorage.setItem(`fepa_trust_${verifyEmail}`, expiry.toString());
      }

      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      await Swal.fire({
        icon: 'success',
        title: 'Xác thực thành công',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff'
      });
      navigate("/dashboard", { replace: true });
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Xác minh sinh trắc học thất bại',
        timer: 2000,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#fff',
        allowOutsideClick: false
      });
      window.location.reload(); 
    }
  } catch (err) {
    console.error("Biometric error:", err);
    await Swal.fire({
      icon: 'error',
      title: 'Xác minh sinh trắc học thất bại',
      timer: 2000,
      showConfirmButton: false,
      background: '#1a1a1a',
      color: '#fff'
    });
    window.location.reload();
  } finally {
    setIsProcessing(false);
  }
};
    // ── OTP VERIFY ──────────────────────────────────────────────────────────
const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const inputCode = code.trim();
    if (inputCode.length < 6) {
      Swal.fire({ icon: 'warning', title: 'Thiếu mã', text: 'Vui lòng nhập đủ 6 số.' });
      return;
    }

    try {
      // Lấy thông tin người dùng đang chờ đăng ký từ localStorage
      const pendingUserStr = localStorage.getItem("pending_user");
      const pendingUser = pendingUserStr ? JSON.parse(pendingUserStr) : null;

      const response = await fetch(`http://localhost:8000/api/verify-login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifyEmail,
          code: inputCode,
          password: pendingUser?.password, // Quan trọng: Gửi kèm để backend lưu DB
          phone: pendingUser?.phone,
          id: pendingUser?.id
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (trustDevice) {
          const expiry = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem(`fepa_trust_${verifyEmail}`, expiry.toString());
        }

        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Dọn dẹp bộ nhớ tạm sau khi đăng ký thành công
        localStorage.removeItem("otp_code");
        localStorage.removeItem("otp_expiry");
        localStorage.removeItem("pending_user");
        localStorage.removeItem("pending_email");

        Swal.fire({ 
          icon: 'success', 
          title: 'Xác thực thành công', 
          timer: 1500, 
          showConfirmButton: false 
        });

        navigate("/dashboard", { replace: true });
      } else {
        Swal.fire({ 
          icon: 'error', 
          title: 'Xác thực thất bại', 
          text: result.detail || "Mã OTP không chính xác hoặc đã hết hạn." 
        });
      }
    } catch (err) {
      console.error("OTP Error:", err);
      Swal.fire({ icon: 'error', title: 'Lỗi kết nối', text: 'Không thể kết nối tới máy chủ.' });
    }
  };

    const resetScan = () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
      setCameraStream(null);
      setIsScanning(false);
      setFaceDetected(false);
      setIsProcessing(false);
    };

    // ── RENDER ───────────────────────────────────────────────────────────────
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">💳</div>
          <h1 style={{ color: "white" }}>FEPA</h1>
          <p className="subtitle" style={{ color: '#aaa', marginBottom: '20px' }}>
            {method === "otp"
              ? `Xác thực 2FA cho: ${verifyEmail} | Còn lại: ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
              : `Xác thực Sinh trắc học cho: ${verifyEmail}`}
          </p>

          {method === "otp" ? (
            <form onSubmit={handleVerifyOtp}>
              <input
                placeholder="000000"
                maxLength={6}
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', color: '#ccc', fontSize: '0.9rem', justifyContent: 'center' }}>
                <input
                  type="checkbox"
                  id="trust"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                />
                <label htmlFor="trust" style={{ cursor: 'pointer' }}>Tin tưởng thiết bị này trong 24 giờ</label>
              </div>
              <button type="submit" style={{ marginTop: '20px' }}>Verify & Continue →</button>
            </form>
          ) : (
            isScanning && (
              <div style={{ textAlign: 'center' }}>
                {/* Container chính - vuông, crop video nếu cần */}
                <div
                  style={{
                    position: "relative",
                    width: "320px",
                    height: "320px",
                    margin: "0 auto",
                    overflow: "hidden",
                    borderRadius: "12px",
                    background: "#000",
                  }}
                >
                  {/* Video layer */}
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Canvas overlay landmarks */}
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Vòng tròn đếm ngược */}
                  {faceDetected && !isProcessing && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#4ade80',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '2px solid #4ade80',
                        zIndex: 10,
                      }}
                    >
                      {scanProgress}s
                    </div>
                  )}
                </div>

                <p style={{ margin: "16px 0", fontWeight: "bold", color: faceDetected ? "#4ade80" : "#ff4d4d" }}>
                  {isProcessing
                    ? "Đang xác thực khuôn mặt..."
                    : faceDetected
                    ? `Đã nhận diện! Giữ im trong ${scanProgress} giây...`
                    : "Không tìm thấy khuôn mặt! Đặt mặt vào camera"}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', color: '#ccc', fontSize: '0.9rem', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    id="trust"
                    checked={trustDevice}
                    onChange={(e) => setTrustDevice(e.target.checked)}
                  />
                  <label htmlFor="trust" style={{ cursor: 'pointer' }}>Tin tưởng thiết bị này trong 24 giờ</label>
                </div>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: '20px' }}>
                  <button
                    onClick={resetScan}
                    style={{
                      padding: "10px 20px",
                      background: "#ff4d4d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )
          )}

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Verify;