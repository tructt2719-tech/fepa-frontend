import type { IconKey } from "../components/StatCard";

interface Stat {
  title: string;
  value: string | number;
  icon: IconKey;
  highlight?: boolean;
  iconColor?: string;
  iconBg?: string;
  key?: string;
  prefix?: string; // Thêm để xử lý "Còn thiếu:"
}

export const stats: Stat[] = [
  {
    title: "Total Balance",
    value: "0",
    icon: "wallet",
    highlight: true,
    iconColor: "#ffffff",
    iconBg: "rgba(255,255,255,0.25)",
    key: "balance",
  },
  {
    title: "Total Expense",
    value: "0",
    icon: "trending-down",
    iconColor: "#ec4899",
    iconBg: "#fce7f3",
    key: "totalBudget",
  },
  {
    title: "Saving Goal",
    value: "0",
    icon: "target",
    iconColor: "#8b5cf6",
    iconBg: "#ede9fe",
    key: "totalSpent",
    prefix: "Lack: ", // Thêm prefix ở đây
  },
  {
    title: "Total Debt",
    value: "0",
    icon: "credit-card",
    iconColor: "#6366f1",
    iconBg: "#e0e7ff",
    key: "totalDebt", // Key khớp với API Backend vừa sửa
    prefix: "", // Thêm tiền tố cho chuyên nghiệp
  },
];
