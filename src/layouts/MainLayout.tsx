import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Topbar";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, BookOpen, Crown, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import "../styles/ChatBubble.css";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false); // State quản lý Modal thông báo
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("fepa_chat");
    return saved ? JSON.parse(saved) : [
      { role: "bot", text: "Chào bạn! Tôi là trợ lý FEPA. Bạn là sinh viên mới ra trường đang cần tìm lộ trình sự nghiệp hay kỹ năng thực tế?" }
    ];
  });

  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user.email;

  useEffect(() => {
    localStorage.setItem("fepa_chat", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- KIỂM TRA PREMIUM VÀ MỞ FORM ---
  const handleToggleChat = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (!email) {
      alert("Please login to use this feature.");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/check-premium-status?email=${email}`);
      const data = await res.json();

      if (data.isPremium) {
        setIsOpen(true);
      } else {
        // Mở Modal thay vì alert
        setShowPremiumModal(true);
      }
    } catch (err) {
      console.error("Premium check error:", err);
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const msgToSend = textOverride || input.trim();
    if (!msgToSend || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: msgToSend }]);
    if (!textOverride) setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        throw new Error();
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Rất tiếc, hệ thống AI đang bận. Vui lòng thử lại sau giây lát!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Lộ trình học React cho người mới",
    "Cách viết CV thiếu kinh nghiệm",
    "Kỹ năng mềm quan trọng nhất?"
  ];

  return (
    <div className="main-layout">
      <Navbar />
      <main className="content-area">
        <Outlet />
      </main>

      {/* --- PREMIUM UPGRADE MODAL --- */}
      {showPremiumModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal-card">
            <button className="close-modal-btn" onClick={() => setShowPremiumModal(false)}>
              <X size={20} />
            </button>
            <div className="premium-icon-circle">
              <Crown size={40} color="#f59e0b" fill="#f59e0b" />
            </div>
            <h2>Premium Required</h2>
            <p>
              Unlock the power of <strong>FEPA AI Career Assistant</strong>. 
              Get personalized roadmaps, CV reviews, and 24/7 support.
            </p>
            <div className="premium-modal-actions">
              <button className="upgrade-action-btn" onClick={() => {
                setShowPremiumModal(false);
                navigate("/profile"); 
              }}>
                Get Premium Now <ArrowRight size={18} />
              </button>
              <button className="later-btn" onClick={() => setShowPremiumModal(false)}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CHAT WRAPPER --- */}
      <div className={`chat-wrapper ${isOpen ? "open" : ""}`}>
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="header-info">
                <div className="status-dot"></div>
                <span>FEPA Career Assistant</span>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="chat-body">
              {messages.map((msg, i) => (
                <div key={i} className={`msg-bubble ${msg.role}`}>
                  <div className="msg-content">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="msg-bubble bot loading">
                  <Loader2 className="animate-spin" size={14} /> 
                  <span>FEPA đang phân tích...</span>
                </div>
              )}

              {!isLoading && messages.length < 3 && (
                <div className="suggestions-container">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSendMessage(s)} className="suggest-item">
                      <BookOpen size={12} /> {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-footer">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Hỏi về kỹ năng, CV, việc làm..." 
              />
              <button 
                className="send-btn" 
                onClick={() => handleSendMessage()} 
                disabled={isLoading || !input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        <button 
          className={`chat-bubble-btn ${isOpen ? "active" : ""}`} 
          onClick={handleToggleChat}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>
    </div>
  );
};

export default MainLayout;