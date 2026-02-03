import { Crown, Check, X } from "lucide-react";
import "../styles/subscription.css";

interface Props {
  onClose: () => void;
  onUpgrade: () => void;
}

export default function SubscriptionModal({ onClose, onUpgrade }: Props) {
  return (
    <div className="sub-overlay">
      <div className="sub-modal">
        <button className="sub-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* HEADER */}
        <div className="sub-header">
          <div className="sub-icon">
            <Crown />
          </div>
          <h1>Choose Your Plan</h1>
          <p>Select the perfect plan for your financial journey</p>
        </div>

        {/* PLANS */}
        <div className="sub-plans">
          {/* FREE */}
          <div className="plan-card">
            <div className="plan-head">
              <h3>Free</h3>
              <span className="badge">Current Plan</span>
            </div>

            <div className="price">
              ₫0 <span>/month</span>
            </div>
            <p className="desc">Perfect for getting started</p>

            <ul>
              <li>
                <Check /> Track up to 50 expenses per month
              </li>
              <li>
                <Check /> Basic expense categories
              </li>
              <li>
                <Check /> Monthly reports
              </li>
              <li>
                <Check /> Single currency support
              </li>
              <li>
                <Check /> Mobile app access
              </li>
            </ul>

            <button className="btn disabled">Current Plan</button>
          </div>

          {/* PREMIUM */}
          <div className="plan-card premium">
            <div className="plan-head">
              <h3>Premium ✨</h3>
              <span className="badge hot">Popular</span>
            </div>

            <div className="price">
              ₫99,000 <span>/month</span>
            </div>
            <p className="desc">Full access to all premium features</p>

            <ul>
              <li>
                <Check /> Unlimited expense tracking
              </li>
              <li>
                <Check /> Advanced AI categorization
              </li>
              <li>
                <Check /> OCR receipt scanning
              </li>
              <li>
                <Check /> Multi-currency support
              </li>
              <li>
                <Check /> Advanced analytics & forecasting
              </li>
              <li>
                <Check /> Custom budgets & goals
              </li>
              <li>
                <Check /> Debt tracking
              </li>
              <li>
                <Check /> Priority support
              </li>
              <li>
                <Check /> Export to CSV & Google Sheets
              </li>
              <li>
                <Check /> Dark/Light theme
              </li>
              <li>
                <Check /> Ad-free experience
              </li>
            </ul>

            <button className="btn primary" onClick={onUpgrade}>
              <Crown /> Upgrade to Premium
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div className="sub-features">
          <div className="feature">📷 OCR Scanning</div>
          <div className="feature">📈 AI Forecasting</div>
          <div className="feature">⚡ Real-time Sync</div>
          <div className="feature">🔒 Secure & Private</div>
        </div>
      </div>
    </div>
  );
}
