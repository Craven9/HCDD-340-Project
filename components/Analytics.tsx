import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockExpenses } from '../lib/expenseData';
import { TrendingUp, Calendar, PieChart as PieChartIcon, Sparkles } from 'lucide-react';

export function Analytics() {
  // Color mapping for categories
  const categoryColors: { [key: string]: string } = {
    'Food & Dining': '#3b82f6',
    'Transportation': '#8b5cf6',
    'Shopping': '#ec4899',
    'Entertainment': '#f59e0b',
    'Bills & Utilities': '#10b981',
    'Healthcare': '#06b6d4',
    'Travel': '#f97316',
    'Education': '#6366f1',
    'Receipt': '#64748b',
    'Other': '#94a3b8'
  };

  // Category spending data
  const categoryData = mockExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount,
        color: categoryColors[expense.category] || '#94a3b8',
        id: `category-${expense.category.replace(/\s+/g, '-').toLowerCase()}`
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string; id: string }[]);

  // Daily spending trend (last 2 weeks)
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    const dayExpenses = mockExpenses.filter(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: total
    };
  });

  // Weekly comparison
  const weeklyData = [
    { week: 'Week 1', amount: 342.50 },
    { week: 'Week 2', amount: 478.30 },
    { week: 'Week 3', amount: 521.80 },
    { week: 'Week 4', amount: 374.20 },
  ];

  // AI predictions
  const predictions = [
    {
      category: 'Food & Dining',
      predicted: 850,
      current: 247.75,
      trend: 'up'
    },
    {
      category: 'Transportation',
      predicted: 290,
      current: 76.50,
      trend: 'down'
    },
    {
      category: 'Shopping',
      predicted: 450,
      current: 224.67,
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500">Detailed insights into your spending patterns</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Avg. Transaction</span>
          </div>
          <div className="text-2xl text-gray-900">
            ${(mockExpenses.reduce((sum, e) => sum + e.amount, 0) / mockExpenses.length).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Across {mockExpenses.length} expenses</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Most Active Day</span>
          </div>
          <div className="text-2xl text-gray-900">Monday</div>
          <p className="text-sm text-gray-500 mt-1">$289.40 average</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Top Category</span>
          </div>
          <div className="text-2xl text-gray-900">Food & Dining</div>
          <p className="text-sm text-gray-500 mt-1">31% of total spend</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Daily Spending Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-4">Daily Spending (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent, index }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-4">Weekly Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Predictions */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">AI Spending Predictions</h3>
          </div>
          <div className="space-y-4">
            {predictions.map((pred) => {
              const progress = (pred.current / pred.predicted) * 100;
              return (
                <div key={pred.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-900">{pred.category}</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-900">
                        ${pred.current.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {' '}/ ${pred.predicted.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Projected end-of-month total
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}