import { useState, useEffect, useCallback } from "react";
import ExpenseSearch from "../components/ExpenseSearch";
import ExpenseFilter from "../components/ExpenseFilter";
import ExpenseList from "../components/ExpenseList";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import type { Expense } from "../types/expense";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy user ID từ localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id ? Number(user.id) : null;

  // Hàm fetch dữ liệu từ server
  const fetchExpenses = useCallback(async () => {
    if (!userId) return;

    try {
      // Backend của bạn đã có ORDER BY date DESC, id DESC nên data trả về sẽ chuẩn
      const res = await fetch(`http://localhost:8000/api/expenses/${userId}?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setExpenses(data); 
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not update list.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  /**
   * SỬA TẠI ĐÂY:
   * Nhận object expense mới từ Modal và đẩy lên đầu mảng state
   */
  const handleAddExpense = (newExpense: Expense) => {
    // Thêm item mới vào vị trí đầu tiên của mảng (Index 0)
    setExpenses((prev) => [newExpense, ...prev]);
    setOpenModal(false);
    
    // Tùy chọn: Có thể gọi lại fetchExpenses() nếu muốn đảm bảo 100% đồng bộ, 
    // nhưng setExpenses ở trên đã đủ để UI thay đổi ngay lập tức.
  };

  // Logic lọc dữ liệu
  const filteredExpenses = expenses.filter((e) => {
    const nameLower = (e.name ?? "").toLowerCase();
    const noteLower = (e.note ?? "").toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch =
      nameLower.includes(searchLower) || noteLower.includes(searchLower);

    const matchesCategory = !category || e.category === category;

    return matchesSearch && matchesCategory;
  });

  if (!userId) {
    return <div className="expenses-page">Please log in to view expenses.</div>;
  }

  if (loading) {
    return <div className="expenses-page">Loading expenses...</div>;
  }

  if (error) {
    return <div className="expenses-page error">{error}</div>;
  }

  return (
    <div className="page expenses-page">
      <div className="expenses-header">
        <div>
          <h1>Expense Tracking</h1>
          <p>Track and manage your spending</p>
        </div>
        <button className="add-expense" onClick={() => setOpenModal(true)}>
          + Add Expense
        </button>
      </div>

      <div className="expenses-tools">
        <ExpenseSearch value={search} onChange={setSearch} />
        <ExpenseFilter category={category} onCategoryChange={setCategory} />
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found.</p>
          <p>Try adding a new expense or adjusting your filters.</p>
        </div>
      ) : (
        <ExpenseList 
          expenses={filteredExpenses} 
          onRefresh={fetchExpenses} 
        />
      )}

      <AddExpenseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddExpense} // Truyền hàm đã được nâng cấp
        currentUserId={userId}
      />
    </div>
  );
}