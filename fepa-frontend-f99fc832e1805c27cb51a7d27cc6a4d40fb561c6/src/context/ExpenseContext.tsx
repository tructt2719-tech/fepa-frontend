import { createContext, useContext, useReducer } from "react";
import type { Expense } from "../types/expense";

type State = {
  expenses: Expense[];
};

type Action =
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "SET_EXPENSES"; payload: Expense[] };

const ExpenseContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { expenses: [] });

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenses must be used inside ExpenseProvider");
  return ctx;
}
