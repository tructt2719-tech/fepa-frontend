import { useEffect, useState, useCallback } from "react";
import type { Debt } from "../types/debt";

import "../styles/layout.css";
import "../styles/debts.css";

import DebtSummaryCard from "../components/debts/DebtSummaryCard";
import DebtItemCard from "../components/debts/DebtItemCard";
import DebtStrategy from "../components/debts/DebtStrategy";
import AddDebtModal from "../components/debts/AddDebtModal";

export default function Debts() {
  const [debtList, setDebtList] = useState<Debt[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = user.id || 1;
  const handleDeleteDebt = (id: number) => {
    setDebtList((prev) => prev.filter((d) => d.id !== id));
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/debts/${currentUserId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setDebtList(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải debts:", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalDebt = debtList.reduce((s, d) => s + d.total, 0);
  const totalPaid = debtList.reduce((s, d) => s + d.paid, 0);
  const remainingDebt = totalDebt - totalPaid;

  const monthlyPayment = debtList.reduce(
    (s, d) => s + (d.paid < d.total ? d.monthly : 0),
    0,
  );

  const activeDebts = debtList.filter((d) => d.paid < d.total);
  const overdueCount = debtList.filter((d) => d.overdue).length;

  return (
    <div className="page">
      <h1>Debt Tracking</h1>
      <p className="page-desc">Manage and monitor your debts effectively</p>

      {/* SUMMARY */}
      <div className="grid-3">
        <DebtSummaryCard
          title="Total Remaining Debt"
          value={remainingDebt}
          isCurrency
          variant={overdueCount > 0 ? "danger" : "default"}
        />

        <DebtSummaryCard
          title="Monthly Payment"
          value={monthlyPayment}
          isCurrency
        />

        <DebtSummaryCard title="Active Debts" value={activeDebts.length} />
      </div>

      {/* ADD BUTTON */}
      <div className="align-right mt-20">
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Debt
        </button>
      </div>

      {/* DEBT LIST */}
      {debtList.length === 0 ? (
        <div className="empty-state" style={{ color: "var(--text-muted)" }}>
          You haven't added any debts yet.
        </div>
      ) : (
        <div className="debt-list">
          {debtList.map((d) => (
            <DebtItemCard key={d.id} data={d} onDelete={handleDeleteDebt} />
          ))}
        </div>
      )}

      {/* STRATEGY */}
      <DebtStrategy debts={debtList} />

      {/* ADD MODAL */}
      {showAddModal && (
        <AddDebtModal
          currentUserId={currentUserId}
          onClose={() => setShowAddModal(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
