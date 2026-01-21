// src/data/mockExpenses.ts
export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  time: string;
}

export const expenses: Expense[] = [
  {
    id: 1,
    title: "Starbucks Coffee",
    category: "Food & Dining",
    amount: -8.5,
    date: "2026-01-04",
    time: "09:30 AM",
  },
  {
    id: 2,
    title: "Uber Ride",
    category: "Transportation",
    amount: -15.2,
    date: "2026-01-04",
    time: "08:15 AM",
  },
  {
    id: 3,
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    date: "2026-01-03",
    time: "12:00 PM",
  },
];
