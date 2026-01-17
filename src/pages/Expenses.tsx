import { useState } from "react";
import ExpenseSearch from "../components/ExpenseSearch";
import ExpenseFilter from "../components/ExpenseFilter";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import { mockExpenses } from "../data/mockExpenses";

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const filteredExpenses = mockExpenses.filter((e) => {
    const matchSearch = e.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category
      ? e.category === category
      : true;

    return matchSearch && matchCategory;
  });

  return (
    <div className="page expenses-page">
      {/* HEADER */}
      <div className="expenses-header">
        <div>
          <h1>Expense Tracking</h1>
          <p>Track and manage your expenses</p>
        </div>

        <button
          className="add-expense"
          onClick={() => setOpenModal(true)}
        >
          + Add Expense
        </button>
      </div>

      {/* TOOLS */}
      <div className="expenses-tools">
        <ExpenseSearch
          value={search}
          onChange={setSearch}
        />

        <ExpenseFilter
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* LIST */}
      <ExpenseList expenses={filteredExpenses} />

      {/* ADD EXPENSE MODAL */}
      <AddExpenseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
