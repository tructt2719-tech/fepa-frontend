import { useState, useEffect } from "react";
import { loadData, saveData } from "../database/storage";
import ExpenseSearch from "../components/ExpenseSearch";
import ExpenseFilter from "../components/ExpenseFilter";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import { expenses as mockExpenses } from "../data/mockExpenses";
import type { Expense } from "../types/expense";
import { resizeBase64Image } from "../utils/image";

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [expenseList, setExpenseList] = useState<Expense[]>(() =>
    loadData("expenses", mockExpenses),
  );

  useEffect(() => {
    async function normalizeReceiptImages() {
      const stored = loadData<Expense[]>("expenses", []);

      let changed = false;

      const updated = await Promise.all(
        stored.map(async (e: Expense) => {
          if (!e.receiptImage) return e;

          // 🚫 tránh resize lại nhiều lần
          if (e.receiptImage.includes("resized=true")) return e;

          const resized = await resizeBase64Image(e.receiptImage);

          changed = true;

          return {
            ...e,
            receiptImage: resized + "#resized=true",
          };
        }),
      );

      if (changed) {
        setExpenseList(updated);
        saveData("expenses", updated);
      }
    }

    normalizeReceiptImages();
  }, []);
  [expenseList];

  const handleAddExpense = (expense: Expense) => {
    setExpenseList((prev) => {
      const updated = [...prev, expense];
      saveData("expenses", updated);
      return updated;
    });
  };
  const filteredExpenses = expenseList.filter((e) => {
    const name = e.name ?? "";
    const searchText = search ?? "";
    const matchSearch = name.toLowerCase().includes(searchText.toLowerCase());
    const matchCategory = category ? e.category === category : true;
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

        <button className="add-expense" onClick={() => setOpenModal(true)}>
          + Add Expense
        </button>
      </div>

      {/* TOOLS */}
      <div className="expenses-tools">
        <ExpenseSearch value={search} onChange={setSearch} />

        <ExpenseFilter category={category} onCategoryChange={setCategory} />
      </div>

      {/* LIST */}
      <ExpenseList expenses={filteredExpenses} />

      {/* ADD EXPENSE MODAL */}
      <AddExpenseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddExpense}
      />
    </div>
  );
}
// import { useEffect, useState } from "react";
// import type { Expense } from "../types/expense";
// import { loadData, saveData } from "../database/storage";
// import AddExpenseModal from "../components/expense/AddExpenseModal";
// import ExpenseList from "../components/ExpenseList";
// export default function Expenses() {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [open, setOpen] = useState(false);

//   // LOAD 1 LẦN DUY NHẤT
//   useEffect(() => {
//     const stored = loadData<Expense[]>("expenses", []) || [];
//     setExpenses(stored);
//   }, []);

//   // ⭐ CHỖ QUYẾT ĐỊNH
//   const handleAddExpense = (expense: Expense) => {
//     setExpenses((prev) => {
//       const updated = [expense, ...prev];
//       saveData("expenses", updated);
//       return updated;
//     });
//   };

//   return (
//     <>
//       <button onClick={() => setOpen(true)}>+ Add Expense</button>

//       <ExpenseList expenses={expenses} />

//       {open && (
//         <AddExpenseModal
//           open={open}
//           onClose={() => setOpen(false)}
//           onAdd={handleAddExpense}
//         />
//       )}
//     </>
//   );
// }
