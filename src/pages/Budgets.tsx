import { useEffect, useState, useCallback } from "react";
import type { Budget } from "../types/budget";
import type { SavingsGoal } from "../types/savingsGoal";
import "../styles/layout.css";
import "../styles/budget.css";

import BudgetCard from "../components/budgets/BudgetCard";
import SavingsGoalCard from "../components/budgets/SavingsGoalCard";
import BudgetPrediction from "../components/budgets/BudgetPrediction";
import CreateBudgetModal from "../components/budgets/CreateBudgetModal";
import CreateGoalModal from "../components/budgets/CreateGoalModal";

export default function Budgets() {
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [goalList, setGoalList] = useState<SavingsGoal[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // LẤY USER_ID ĐỘNG
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || 1;

  // HÀM FETCH DỮ LIỆU CHUNG
  const fetchData = useCallback(async () => {
    try {
      const budgetRes = await fetch(`http://127.0.0.1:8000/api/budgets/${currentUserId}`);
      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setBudgetList(data);
      }

      // Giả sử có endpoint goals
      const goalRes = await fetch(`http://127.0.0.1:8000/api/goals/${currentUserId}`);
      if (goalRes.ok) {
        const data = await goalRes.json();
        setGoalList(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
    // Lắng nghe sự kiện nếu thêm Expense ở trang khác
    window.addEventListener("expenseAdded", fetchData);
    return () => window.removeEventListener("expenseAdded", fetchData);
  }, [fetchData]);

  // XỬ LÝ TẠO BUDGET
  const handleCreateBudget = async (payload: any) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchData(); // Đợi fetch xong mới đóng modal
        setShowBudgetModal(false);
      }
    } catch (err) {
      console.error("Lỗi kết nối server:", err);
    }
  };

  return (
    <div className="page">
      <h1>Budgets & Savings Goals</h1>
      <p className="page-desc">Track your spending limits and achieve your financial goals</p>

      {/* MONTHLY BUDGETS */}
      <section>
        <div className="section-header">
          <h2>Active Budgets</h2>
          <button className="btn-primary" onClick={() => setShowBudgetModal(true)}>+ Add Budget</button>
        </div>

        {budgetList.length === 0 ? (
          <div className="empty-state" style={{ color: 'var(--text-muted)' }}>Bạn chưa thiết lập ngân sách nào.</div>
        ) : (
          <div className="grid-2">
            {budgetList.map((b) => (
              <BudgetCard 
                key={b.id} 
                data={b} 
                onUpdate={fetchData} // ĐÃ ĐỔI TỪ onDelete THÀNH onUpdate
              />
            ))}
          </div>
        )}
      </section>

      {/* SAVINGS GOALS */}
      <section>
        <div className="section-header">
          <h2>Savings Goals</h2>
          <button className="btn-primary" onClick={() => setShowGoalModal(true)}>+ Add Goal</button>
        </div>

        {goalList.length === 0 ? (
           <div className="empty-state" style={{ color: 'var(--text-muted)' }}>Chưa có mục tiêu tiết kiệm.</div>
        ) : (
          <div className="grid-3">
            {goalList.map((g) => (
              <SavingsGoalCard key={g.id} data={g} onUpdate={fetchData}/>
            ))}
          </div>
        )}
      </section>

      <BudgetPrediction />

      {showBudgetModal && (
        <CreateBudgetModal
          onClose={() => setShowBudgetModal(false)}
          onCreate={handleCreateBudget}
          currentUserId={currentUserId}
        />
      )}

      {showGoalModal && (
        <CreateGoalModal
          onClose={() => setShowGoalModal(false)}
          onCreate={fetchData}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}