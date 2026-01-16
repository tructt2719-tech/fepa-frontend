interface Props {
  category: string;
  onCategoryChange: (value: string) => void;
}

const ExpenseFilter = ({ category, onCategoryChange }: Props) => {
  return (
    <select
      value={category}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="expense-filter"
    >
      <option value="">All Categories</option>
      <option value="Food & Dining">Food & Dining</option>
      <option value="Transportation">Transportation</option>
      <option value="Entertainment">Entertainment</option>
    </select>
  );
};

export default ExpenseFilter;
