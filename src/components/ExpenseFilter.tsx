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
      <option value="Shopping">Shopping</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Bills & Utilities">Bills & Utilities</option>
      <option value="Healthcare">Healthcare</option>
      <option value="Education">Education</option>
      <option value="Others">Others</option>
    </select>
  );
};

export default ExpenseFilter;
