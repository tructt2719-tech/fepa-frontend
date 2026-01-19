import { useNavigate } from "react-router-dom";
import { 
  Crown, User, Bell, Globe, Moon, Lock, 
  LogOut, Download, Database, ChevronDown 
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react"; 

export default function Profile() {
  const navigate = useNavigate();

  // --- QUẢN LÝ STATE ---
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Budget Alerts", desc: "Get notified when approaching budget limits", active: true },
    { id: 2, title: "Expense Reminders", desc: "Daily reminders to log expenses", active: true },
    { id: 3, title: "Goal Milestones", desc: "Celebrate when you reach savings milestones", active: true },
    { id: 4, title: "Payment Due Dates", desc: "Reminders for upcoming bill payments", active: true },
    { id: 5, title: "Financial Tips", desc: "Weekly personalized financial advice", active: false },
  ]);

  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // --- CÁC HÀM XỬ LÝ (HANDLERS) ---
  
  // Hàm xử lý chung cho các hành động giả lập
  const handleAction = (message) => {
    toast.success(message, {
      style: {
        borderRadius: '10px',
        background: '#1e253a',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
    });
  };

  const handleSaveChanges = () => {
    const savingPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(savingPromise, {
      loading: 'Saving changes...',
      success: <b>Settings saved successfully!</b>,
      error: <b>Could not save.</b>,
    }, {
      style: {
        borderRadius: '10px',
        background: '#1e253a',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
      success: {
        iconTheme: { primary: '#7c3aed', secondary: '#fff' },
      },
    });
  };

  const toggleNotification = (id) => {
    setNotifications(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
    toast('Notification settings updated', { icon: '🔔' });
  };

  // --- STYLES ---
  const styles = {
    container: { minHeight: "100vh", backgroundColor: "none", color: "#ffffff", fontFamily: "'Inter', sans-serif", paddingBottom: "50px" },
    header: { height: "70px", display: "flex", alignItems: "center", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 },
    main: { maxWidth: "95%", margin: "0 auto", padding: "20px 24px" },
    sectionCard: { backgroundColor: "#161b2c", borderRadius: "16px", padding: "24px", marginBottom: "20px", border: "1px solid rgba(255, 255, 255, 0.05)" },
    settingItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", backgroundColor: "#1e253a", borderRadius: "12px", marginBottom: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" },
    input: { width: "100%", backgroundColor: "#1e253a", border: "1px solid #2d354d", borderRadius: "8px", padding: "12px 16px", color: "white", marginTop: "8px", fontSize: "14px" },
    label: { fontSize: "13px", color: "#94a3b8", fontWeight: 500 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <header style={styles.header}></header>

      <main style={styles.main}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 4px 0", color: "#94a3b8" }}>Settings</h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>Manage your account and preferences</p>
        </div>

        {/* Premium Banner */}
        <div style={{
          background: "linear-gradient(90deg, #4c1d95, #831843)",
          borderRadius: "16px", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "12px" }}>
              <Crown size={24} color="#fcd34d" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "white" }}>Premium Member</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "white", opacity: 0.8 }}>Enjoying unlimited budgets and advanced analytics</p>
            </div>
          </div>
          <button 
            onClick={() => handleAction("Redirecting to subscription plan...")}
            style={{ backgroundColor: "white", color: "#4c1d95", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
          >
            Manage Plan
          </button>
        </div>

        {/* Account Settings */}
        <div style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <User size={18} color="#a78bfa" />
            <span style={{ fontWeight: 600, fontSize: "16px", color: "white" }}>Account Settings</span>
          </div>
          <div style={styles.row}>
            <div><label style={styles.label}>Full Name</label><input style={styles.input} defaultValue="John Doe" /></div>
            <div><label style={styles.label}>Email Address</label><input style={styles.input} defaultValue="john.doe@example.com" /></div>
          </div>
          <div style={styles.row}>
            <div><label style={styles.label}>Phone Number</label><input style={styles.input} defaultValue="+1 (555) 123-4567" /></div>
            <div><label style={styles.label}>Location</label><input style={styles.input} defaultValue="San Francisco, CA" /></div>
          </div>
          <button onClick={handleSaveChanges} style={{ background: "linear-gradient(90deg, #7c3aed, #db2777)", border: "none", color: "white", padding: "12px 24px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>
            Save Changes
          </button>
        </div>

        {/* Security Section */}
        <div style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Lock size={18} color="#a78bfa" />
            <span style={{ fontWeight: 600, color: "white" }}>Security</span>
          </div>
          <div style={styles.settingItem}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "16px" }}>Two-Factor Authentication</div>
              <div style={{ fontSize: "13px", color: "#94a3b8" }}>Add an extra layer of security</div>
            </div>
            <Switch checked={twoFactor} onChange={(val) => { setTwoFactor(val); handleAction(`2FA is now ${val ? 'ON' : 'OFF'}`); }} />
          </div>
          <div style={styles.settingItem}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "16px" }}>Biometric Login</div>
              <div style={{ fontSize: "13px", color: "#94a3b8" }}>Use fingerprint or face recognition</div>
            </div>
            <Switch checked={biometric} onChange={(val) => { setBiometric(val); handleAction(`Biometric is now ${val ? 'ON' : 'OFF'}`); }} />
          </div>
          <button 
            onClick={() => handleAction("Password reset email sent!")}
            style={{ width: "100%", background: "linear-gradient(90deg, #6d28d9, #7c3aed)", border: "none", color: "white", padding: "12px", borderRadius: "10px", fontWeight: "600", marginTop: "10px", cursor: "pointer" }}
          >
            Change Password
          </button>
        </div>

        {/* Notifications Section */}
        <div style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Bell size={18} color="#a78bfa" />
            <span style={{ fontWeight: 600, color: "white" }}>Notifications</span>
          </div>
          {notifications.map((item) => (
            <div key={item.id} style={styles.settingItem}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px" }}>{item.title}</div>
                <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "6px" }}>{item.desc}</div>
              </div>
              <Switch checked={item.active} onChange={() => toggleNotification(item.id)} />
            </div>
          ))}
        </div>

        {/* Preferences Section */}
        <div style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Globe size={18} color="#a78bfa" />
            <span style={{ fontWeight: 600, color: "white" }}>Preferences</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={styles.label}>Base Currency</label>
            <div style={{ position: "relative" }}>
              <select 
                onChange={() => handleAction("Currency updated!")}
                style={{ ...styles.input, appearance: "none" }}
              >
                <option>VND (đ) - Vietnamese Dong</option>
                <option>USD ($) - US Dollar</option>
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "12px", top: "22px", color: "#64748b" }} />
            </div>
          </div>
          <div style={styles.settingItem}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Moon size={18} color="#a78bfa" />
              <div>
                <div style={{ fontWeight: 600 }}>Dark Mode</div>
                <div style={{ fontSize: "12px", color: "#a78bfa" }}>Premium feature</div>
              </div>
            </div>
            <Switch checked={darkMode} onChange={(val) => { setDarkMode(val); handleAction(`Theme changed to ${val ? 'Dark' : 'Light'}`); }} />
          </div>
        </div>

        {/* Data & Privacy */}
        <div style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <Database size={18} color="#a78bfa" />
            <span style={{ fontWeight: 600, color: "white" }}>Data & Privacy</span>
          </div>
          <button 
            onClick={() => handleAction("Your data is being prepared for download...")}
            style={actionButtonStyle}
          >
            <Download size={16} /> Export Data (CSV)
          </button>
          <button 
            onClick={() => toast.error("Please contact support to delete account.")}
            style={{ ...actionButtonStyle, color: "#ef4444", border: "none", background: "rgba(239, 68, 68, 0.05)" }}
          >
            Delete Account
          </button>
        </div>

        {/* Sign Out */}
        <button 
          onClick={() => { handleAction("Signing out..."); setTimeout(() => navigate("/login"), 1000); }}
          style={signOutButtonStyle}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function Switch({ checked, onChange }) {
  return (
    <label style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: checked ? "#7c3aed" : "#334155", borderRadius: "20px", transition: "0.3s" }}>
        <span style={{ position: "absolute", height: "14px", width: "14px", left: checked ? "23px" : "3px", bottom: "3px", backgroundColor: "white", borderRadius: "50%", transition: "0.3s" }} />
      </span>
    </label>
  );
}

const actionButtonStyle = {
  width: "100%", display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#1e253a", border: "1px solid #2d354d", color: "white", padding: "14px 16px", borderRadius: "12px", cursor: "pointer", marginBottom: "12px", fontSize: "14px"
};

const signOutButtonStyle = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "14px", borderRadius: "12px", cursor: "pointer", marginTop: "30px", fontWeight: "600"
};
