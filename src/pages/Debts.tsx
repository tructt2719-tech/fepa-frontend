import "../styles/layout.css";
import "../styles/debts.css";

import { useState } from "react";

import DebtSummaryCard from "../components/debts/DebtSummaryCard";
import DebtItemCard from "../components/debts/DebtItemCard";
import DebtStrategy from "../components/debts/DebtStrategy";
import AddDebtModal from "../components/debts/AddDebtModal";

import { debtSummary, debts as initialDebts } from "../data/mockDebts";

export default function Debts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [debtList, setDebtList] = useState(initialDebts);

  const handleAddDebt = (newDebt: any) => {
  setDebtList([
    ...debtList,
    {
      id: Date.now(),
      name: newDebt.name,
      type: newDebt.type,
      total: newDebt.total,
      paid: newDebt.paid,
      monthly: newDebt.monthly,    
      interest: newDebt.interest,    
      nextPayment: newDebt.nextPayment,
      payoff: "—",
      overdue: false,
    },
  ]);
};


  return (
    <div className="page">
      <h1>Debt Tracking</h1>
      <p className="page-desc">
        Manage and monitor your debts effectively
      </p>

      {/* SUMMARY */}
      <div className="grid-3">
        <DebtSummaryCard
          title="Total Outstanding Debt"
          value={`$${debtSummary.totalDebt.toLocaleString()}`}
          variant="danger"
        />
        <DebtSummaryCard
          title="Monthly Payment"
          value={`$${debtSummary.monthlyPayment}`}
        />
        <DebtSummaryCard
          title="Active Debts"
          value={debtSummary.activeDebts}
        />
      </div>

      {/* ADD BUTTON */}
      <div className="align-right mt-20">
        <button
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Debt
        </button>
      </div>

      {/* DEBT LIST */}
      <div className="debt-list">
        {debtList.map((d) => (
          <DebtItemCard key={d.id} data={d} />
        ))}
      </div>

      {/* STRATEGY */}
      <DebtStrategy />

      {/* ADD MODAL */}
      {showAddModal && (
        <AddDebtModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDebt}
        />
      )}
    </div>
  );
}
