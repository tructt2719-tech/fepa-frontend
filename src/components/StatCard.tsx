import {
  Wallet,
  TrendingDown,
  Target,
  CreditCard,
} from "lucide-react";

/* ICON MAP */
export const icons = {
  wallet: Wallet,
  "trending-down": TrendingDown,
  target: Target,
  "credit-card": CreditCard,
};

/* 👉 EXPORT TYPE ĐỂ FILE KHÁC DÙNG */
export type IconKey = keyof typeof icons;

/* PROPS */
interface Props {
  title: string;
  value: string | number;
  change?: string;
  note?: string;
  icon: IconKey;
  highlight?: boolean;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  change,
  note,
  icon,
  highlight,
  iconColor,
  iconBg,
}: Props) {
  const Icon = icons[icon];

  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>
      <div className="stat-header">
        <div
          className="icon"
          style={{
            background: iconBg || "#f1f3f9",
            color: iconColor || "#6b7280",
          }}
        >
          <Icon size={22} />
        </div>

        {change && <span className="change">{change}</span>}
        {note && <span className="note">{note}</span>}
      </div>

      <p className={`title ${highlight ? "text-light" : ""}`}>
        {title}
      </p>

      <h2 className={`value ${highlight ? "text-light" : ""}`}>
        {value}
      </h2>
    </div>
  );
}
