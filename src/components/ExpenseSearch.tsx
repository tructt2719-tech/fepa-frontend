interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ExpenseSearch = ({ value, onChange }: Props) => {
  return (
    <input
      type="text"
      placeholder="Search transactions..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="expense-search"
    />
  );
};

export default ExpenseSearch;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ExpenseSearch = ({ value, onChange }: Props) => {
  return (
    <input
      type="text"
      placeholder="Search transactions..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="expense-search"
    />
  );
};

export default ExpenseSearch;
