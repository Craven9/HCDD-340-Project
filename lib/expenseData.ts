export interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
  category: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  aiConfidence?: number;
  aiSuggestion?: string;
  recurring?: boolean;
  tags?: string[];
  receipt?: string; // Image URL
  receiptItems?: ReceiptItem[]; // For scanned receipts with multiple items
  transactionType?: 'Cash' | 'Bank Transfer' | 'Credit' | 'Debit';
}

export interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
  color: string;
}

export const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Other'
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2026-03-23',
    description: 'Whole Foods Market',
    amount: 87.45,
    category: 'Food & Dining',
    aiConfidence: 0.95,
    tags: ['groceries'],
    receiptItems: [
      {
        id: '1-1',
        description: 'Organic Bananas',
        amount: 4.99,
        category: 'Food & Dining'
      },
      {
        id: '1-2', 
        description: 'Almond Milk',
        amount: 5.49,
        category: 'Food & Dining'
      },
      {
        id: '1-3',
        description: 'Organic Spinach',
        amount: 3.99,
        category: 'Food & Dining'
      },
      {
        id: '1-4',
        description: 'Chicken Breast',
        amount: 12.99,
        category: 'Food & Dining'
      },
      {
        id: '1-5',
        description: 'Greek Yogurt',
        amount: 6.49,
        category: 'Food & Dining'
      }
    ]
  },
  {
    id: '2',
    date: '2026-03-22',
    description: 'Uber Ride',
    amount: 24.50,
    category: 'Transportation',
    aiConfidence: 0.98,
    tags: ['ride-share']
  },
  {
    id: '3',
    date: '2026-03-22',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    aiConfidence: 0.92,
    recurring: true,
    tags: ['subscription']
  },
  {
    id: '4',
    date: '2026-03-21',
    description: 'Amazon Purchase',
    amount: 156.78,
    category: 'Shopping',
    aiConfidence: 0.88,
    tags: ['online', 'electronics'],
    receiptItems: [
      {
        id: '4-1',
        description: 'Wireless Mouse',
        amount: 29.99,
        category: 'Shopping'
      },
      {
        id: '4-2',
        description: 'USB-C Cable',
        amount: 15.99,
        category: 'Shopping'
      },
      {
        id: '4-3',
        description: 'Phone Case',
        amount: 24.99,
        category: 'Shopping'
      },
      {
        id: '4-4',
        description: 'Bluetooth Headphones',
        amount: 79.99,
        category: 'Shopping'
      }
    ]
  },
  {
    id: '5',
    date: '2026-03-20',
    description: 'Electric Bill',
    amount: 142.30,
    category: 'Bills & Utilities',
    aiConfidence: 0.99,
    recurring: true,
    tags: ['utilities']
  },
  {
    id: '6',
    date: '2026-03-20',
    description: 'Starbucks',
    amount: 6.75,
    category: 'Food & Dining',
    aiConfidence: 0.96,
    tags: ['coffee']
  },
  {
    id: '7',
    date: '2026-03-19',
    description: 'CVS Pharmacy',
    amount: 34.20,
    category: 'Healthcare',
    aiConfidence: 0.91,
    tags: ['pharmacy', 'medication']
  },
  {
    id: '8',
    date: '2026-03-18',
    description: 'Gas Station',
    amount: 52.00,
    category: 'Transportation',
    aiConfidence: 0.94,
    tags: ['fuel']
  },
  {
    id: '9',
    date: '2026-03-17',
    description: 'Restaurant - Dinner',
    amount: 98.40,
    category: 'Food & Dining',
    aiConfidence: 0.97,
    tags: ['dining-out']
  },
  {
    id: '10',
    date: '2026-03-16',
    description: 'Spotify Premium',
    amount: 10.99,
    category: 'Entertainment',
    aiConfidence: 0.93,
    recurring: true,
    tags: ['subscription', 'music']
  },
  {
    id: '11',
    date: '2026-03-15',
    description: 'Target',
    amount: 67.89,
    category: 'Shopping',
    aiConfidence: 0.85,
    tags: ['retail']
  },
  {
    id: '12',
    date: '2026-03-14',
    description: 'Gym Membership',
    amount: 49.99,
    category: 'Healthcare',
    aiConfidence: 0.90,
    recurring: true,
    tags: ['fitness', 'subscription']
  },
  {
    id: '13',
    date: '2026-03-13',
    description: 'Movie Tickets',
    amount: 32.00,
    category: 'Entertainment',
    aiConfidence: 0.96,
    tags: ['movies']
  },
  {
    id: '14',
    date: '2026-03-12',
    description: 'Internet Bill',
    amount: 79.99,
    category: 'Bills & Utilities',
    aiConfidence: 0.99,
    recurring: true,
    tags: ['utilities', 'internet']
  },
  {
    id: '15',
    date: '2026-03-11',
    description: 'Trader Joes',
    amount: 54.32,
    category: 'Food & Dining',
    aiConfidence: 0.94,
    tags: ['groceries']
  }
];

export const categoryBudgets: CategoryBudget[] = [
  { category: 'Food & Dining', budget: 800, spent: 247.75, color: '#3b82f6' },
  { category: 'Transportation', budget: 300, spent: 76.50, color: '#8b5cf6' },
  { category: 'Shopping', budget: 400, spent: 224.67, color: '#ec4899' },
  { category: 'Entertainment', budget: 200, spent: 58.98, color: '#f59e0b' },
  { category: 'Bills & Utilities', budget: 500, spent: 222.29, color: '#10b981' },
  { category: 'Healthcare', budget: 250, spent: 84.19, color: '#06b6d4' },
];

export const aiInsights = [
  {
    type: 'warning',
    title: 'Unusual Spending Detected',
    message: 'Your shopping expenses are 45% higher than usual this month.',
    confidence: 0.89
  },
  {
    type: 'success',
    title: 'Great Job!',
    message: 'You\'re spending less on Food & Dining compared to last month.',
    confidence: 0.92
  },
  {
    type: 'info',
    title: 'Recurring Payment Due',
    message: 'Your gym membership will be charged in 3 days.',
    confidence: 0.96
  },
  {
    type: 'suggestion',
    title: 'Savings Opportunity',
    message: 'You could save by switching to annual subscriptions instead of monthly.',
    confidence: 0.84
  }
];