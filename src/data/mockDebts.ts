export const debtSummary = {
  totalDebt: 4350,
  monthlyPayment: 850,
  activeDebts: 3,
};

export const debts = [
  {
    id: 1,
    name: "Credit Card - Chase",
    type: "Credit Card",
    paid: 1250,
    total: 2500,
    monthly: 200,
    interest: 18.99,
    nextPayment: "2026-01-15",
    payoff: "7 months",
    overdue: false,
  },
  {
    id: 2,
    name: "Personal Loan",
    type: "Personal Loan",
    paid: 7500,
    total: 10000,
    monthly: 500,
    interest: 7.5,
    nextPayment: "2026-01-20",
    payoff: "5 months",
    overdue: false,
  },
  {
    id: 3,
    name: "Medical Bills",
    type: "Medical",
    paid: 900,
    total: 1500,
    monthly: 150,
    interest: 0,
    nextPayment: "2026-01-10",
    payoff: "4 months",
    overdue: true,
  },
];
