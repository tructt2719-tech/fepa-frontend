import { useEffect, useState, useMemo } from "react";
import StatCard from "../components/StatCard";
import IncomeExpenseChart from "../components/LineChart";
import DonutChart from "../components/DonutChart";
import { stats as statsConfig } from "../data/mockDashboard";

export default function Dashboard() {
  const [apiStats, setApiStats] = useState<any>(null);
  const [dynamicLineData, setDynamicLineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy thông tin user từ localStorage an toàn
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const userId = user.id || 1;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Định nghĩa các endpoint
    const statsUrl = `http://127.0.0.1:8000/api/dashboard/stats/${userId}`;
    const chartUrl = `http://127.0.0.1:8000/api/dashboard/charts/line/${userId}`;

    // Gọi song song các API để tiết kiệm thời gian
    Promise.all([
      fetch(statsUrl).then((res) => {
        if (!res.ok) throw new Error("Không thể tải chỉ số thống kê");
        return res.json();
      }),
      fetch(chartUrl).then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu biểu đồ");
        return res.json();
      }),
    ])
      .then(([statsRes, lineRes]) => {
        if (isMounted) {
          setApiStats(statsRes);
          setDynamicLineData(lineRes);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (error) {
    return <div className="error-message">❌ Lỗi: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div style={{ color: "white" }}>
        <h1 style={{ fontSize: "2rem", marginTop: 0, marginBottom: "8px" }}>
          🎉 Welcome back, {user.username || "User"}
        </h1>
        <p style={{ opacity: 0.7 }}>
          This is an overview of your finances over the past 6 months.
        </p>
      </div>

      {/* GRID CÁC THẺ THỐNG KÊ */}
      <div className="stat-grid">
        {statsConfig.map((s, i) => {
          let val = "...";
          if (!loading && apiStats && s.key) {
            const rawVal = apiStats[s.key] || 0;
            const formatted = `$${Number(rawVal).toLocaleString()}`;
            val = s.prefix ? `${s.prefix}${formatted}` : formatted;
          }

          return (
            <StatCard
              key={`${s.key}-${i}`}
              {...s}
              value={val}
              // highlight sẽ tự động áp dụng nếu s.highlight là true trong mockDashboard
            />
          );
        })}
      </div>

      {/* ROW CÁC BIỂU ĐỒ */}
      <div className="chart-row">
        {/* Biểu đồ đường (Xu hướng 6 tháng) */}
        <div className="chart-box">
          <header className="chart-header" style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              Income vs Expenses (Dynamic 6 Months)
            </h3>
          </header>
          <div style={{ height: "360px", width: "100%" }}>
            {loading ? (
              <div className="chart-loading">Loading chart...</div>
            ) : (
              <IncomeExpenseChart data={dynamicLineData} />
            )}
          </div>
        </div>

        {/* Biểu đồ tròn (Phân bổ chi tiêu) */}
        <div className="chart-box">
          <header className="chart-header" style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>
              Spending by Category
            </h3>
          </header>
          <div style={{ height: "360px", width: "100%" }}>
            {/* DonutChart thường tự fetch API bên trong nó, hoặc bạn truyền prop nếu cần */}
            <DonutChart />
          </div>
        </div>
      </div>
    </div>
  );
}
