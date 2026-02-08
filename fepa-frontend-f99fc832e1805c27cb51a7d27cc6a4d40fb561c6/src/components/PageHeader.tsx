import { ArrowLeft } from "lucide-react";
import "../styles/payment.css";
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  return (
    <div className="page-header">
      {onBack && (
        <button onClick={onBack} className="back-btn" aria-label="Go back">
          <ArrowLeft size={20} />
        </button>
      )}

      <div>
        <h2 className="page-title">{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
