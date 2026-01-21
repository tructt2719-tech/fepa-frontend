import { useEffect, useState } from "react";
import { loadData, saveData } from "../database/storage";
import type { Budget } from "../types/budget";
import "../styles/layout.css";
import "../styles/budget.css";

import type { SavingsGoal } from "../types/savingsGoal";

import BudgetCard from "../components/budgets/BudgetCard";
import SavingsGoalCard from "../components/budgets/SavingsGoalCard";
import BudgetPrediction from "../components/budgets/BudgetPrediction";

import CreateBudgetModal from "../components/budgets/CreateBudgetModal";
import CreateGoalModal from "../components/budgets/CreateGoalModal";

import { budgets, goals } from "../data/mockBudgets";

export default function Budgets() {
  // ===== STATE =====
  const [budgetList, setBudgetList] = useState<Budget[]>(() =>
    loadData("budgets", budgets),
  );
  const [goalList, setGoalList] = useState<SavingsGoal[]>(() =>
    loadData("goals", goals),
  );

  useEffect(() => {
    saveData("budgets", budgetList);
  }, [budgetList]);

  useEffect(() => {
    saveData("goals", goalList);
  }, [goalList]);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  return (
    <div className="page">
      <h1>Budgets & Savings Goals</h1>
      <p className="page-desc">
        Track your spending limits and achieve your financial goals
      </p>

      {/* ================= MONTHLY BUDGETS ================= */}
      <section>
        <div className="section-header">
          <h2>Monthly Budgets</h2>
          <button
            className="btn-primary"
            onClick={() => setShowBudgetModal(true)}
          >
            + Add Budget
          </button>
        </div>

        <div className="grid-2">
          {budgetList.map((b) => (
            <BudgetCard key={b.id} data={b} />
          ))}
        </div>
      </section>

      {/* ================= SAVINGS GOALS ================= */}
      <section>
        <div className="section-header">
          <h2>Savings Goals</h2>
          <button
            className="btn-primary"
            onClick={() => setShowGoalModal(true)}
          >
            + Add Goal
          </button>
        </div>

        <div className="grid-3">
          {goalList.map((g) => (
            <SavingsGoalCard key={g.id} data={g} />
          ))}
        </div>
      </section>

      {/* ================= AI PREDICTION ================= */}
      <BudgetPrediction />

      {/* ================= MODALS ================= */}
      {showBudgetModal && (
        <CreateBudgetModal
          onClose={() => setShowBudgetModal(false)}
          onCreate={(newBudget) => setBudgetList([...budgetList, newBudget])}
        />
      )}

      {showGoalModal && (
        <CreateGoalModal
          onClose={() => setShowGoalModal(false)}
          onCreate={(newGoal) => setGoalList([...goalList, newGoal])}
        />
      )}
    </div>
  );
}
