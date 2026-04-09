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
    <div className="space-y-10">
      {/* Header - Enhanced */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">Overview</h2>
        <p className="text-lg text-gray-600 font-medium">{currentMonth}</p>
      </div>

      {/* Metrics Grid - Force 2x2 layout on desktop */}
      <div className="dashboard-grid min-grid-width">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Spent</span>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            Total spending this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Transactions</span>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {mockExpenses.length}
          </div>
          <div className="text-sm font-semibold" style={{ color: '#8b5cf6' }}>
            {mockExpenses.length} this month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg. Daily</span>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${avgDaily.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            per day
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Recurring</span>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${recurringExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {mockExpenses.filter(e => e.recurring).length} subscriptions
          </div>
        </div>
      </div>

      {/* AI Insights - Enhanced design */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">Smart predictions and recommendations based on your spending patterns</p>
          </div>
        </div>
        <div className="dashboard-insights-grid min-grid-width">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-102 ${getInsightBg(insight.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses - Enhanced layout */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            Recent Expenses
          </h3>
        </div>
        
        <div className="dashboard-expenses-grid min-grid-width">
          {/* Pie Chart - Enhanced */}
          <div className="flex flex-col bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#ffffff"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: '1px solid #e5e7eb',
                      backgroundColor: 'white',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm font-medium text-gray-600 text-center mt-4 bg-white px-4 py-2 rounded-lg">
              Category breakdown of last 5 expenses
            </p>
          </div>

          {/* Expenses List - Enhanced styling */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Recent Transactions
            </h4>
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white rounded-xl transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: `${categoryColors[expense.category]}15`, border: `1px solid ${categoryColors[expense.category]}30` }}
                  >
                    <Receipt 
                      className="w-5 h-5" 
                      style={{ color: categoryColors[expense.category] }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">{expense.description}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="px-2 py-1 bg-white rounded-md text-xs font-medium" style={{ color: categoryColors[expense.category], backgroundColor: `${categoryColors[expense.category]}10` }}>
                        {expense.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-sm font-bold text-gray-900">${expense.amount.toFixed(2)}</div>
                  <div className="text-xs text-gray-400 mt-1">
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