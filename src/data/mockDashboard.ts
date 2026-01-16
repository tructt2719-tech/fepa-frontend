import type { IconKey } from "../components/StatCard";

interface Stat {
  title: string;
  value: string | number;
  icon: IconKey;
  highlight?: boolean;
  iconColor?: string;
  iconBg?: string;
}

export const stats: Stat[] = [
  {
    title: "Total Balance",
    value: "24580",
    icon: "wallet",
    highlight: true,
    iconColor: "#ffffff",
    iconBg: "rgba(255,255,255,0.25)",
  },
  {
    title: "This Month Expenses",
    value: "4200",
    icon: "trending-down",
    iconColor: "#ec4899",
    iconBg: "#fce7f3",
  },
  {
    title: "Savings Goal",
    value: "68%",
    icon: "target",
    iconColor: "#8b5cf6",
    iconBg: "#ede9fe",
  },
  {
    title: "Total Debt",
    value: "1250",
    icon: "credit-card",
    iconColor: "#6366f1",
    iconBg: "#e0e7ff",
  },
];

export const lineChartData = [
  { month: "Jan", income: 4500, expense: 3200 },
  { month: "Feb", income: 4800, expense: 3400 },
  { month: "Mar", income: 4600, expense: 3600 },
  { month: "Apr", income: 5200, expense: 4000 },
  { month: "May", income: 5000, expense: 3800 },
  { month: "Jun", income: 5500, expense: 4300 },
];

