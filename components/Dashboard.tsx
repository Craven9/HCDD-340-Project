import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Sparkles,
  Receipt,
  HelpCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { mockExpenses, aiInsights } from '../lib/expenseData';

export function Dashboard() {
  const [currentMonth] = useState('March 2026');

  // Calculate metrics
  const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgDaily = totalSpent / 24; // March 24th
  const recurringExpenses = mockExpenses.filter(e => e.recurring).reduce((sum, e) => sum + e.amount, 0);

  // Recent expenses pie chart data
  const recentExpenses = mockExpenses.slice(0, 5);
  const categoryColors: Record<string, string> = {
    'Food & Dining': '#3b82f6',
    'Transportation': '#8b5cf6',
    'Shopping': '#ec4899',
    'Entertainment': '#f59e0b',
    'Bills & Utilities': '#10b981',
    'Healthcare': '#06b6d4',
    'Travel': '#ef4444',
    'Education': '#14b8a6',
    'Other': '#6b7280'
  };

  const pieData = recentExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount,
        color: categoryColors[expense.category] || '#6b7280',
        id: `pie-${expense.category.replace(/\s+/g, '-').toLowerCase()}`
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string; id: string }[]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5 text-purple-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'suggestion': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Overview</h2>
        <p className="text-gray-500">{currentMonth}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Total Spent</span>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            Total spending this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Transactions</span>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {mockExpenses.length}
          </div>
          <div className="text-sm text-purple-600 font-medium">
            {mockExpenses.length} this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Avg. Daily</span>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            ${avgDaily.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            per day
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Recurring</span>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            ${recurringExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {mockExpenses.filter(e => e.recurring).length} subscriptions
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">Smart predictions and recommendations based on your spending patterns</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${getInsightBg(insight.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-500 text-center mt-2">
              Category breakdown of last 5 expenses
            </p>
          </div>

          {/* Expenses List */}
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${categoryColors[expense.category]}20` }}
                  >
                    <Receipt 
                      className="w-5 h-5" 
                      style={{ color: categoryColors[expense.category] }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{expense.description}</div>
                    <div className="text-sm text-gray-500 mt-1">{expense.category}</div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">${expense.amount.toFixed(2)}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}