export interface Expense {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
  icon?: string;
  receiptImage?: string;
  voiceText?: string;
  voiceAudio?: string;
}
