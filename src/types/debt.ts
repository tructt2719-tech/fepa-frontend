export interface Debt {
  id: number;
  name: string;
  type: string;
  total: number;
  paid: number;
  monthly: number;
  interest: number;
  nextPayment: string;
  payoff: string;
  overdue: boolean;
}
