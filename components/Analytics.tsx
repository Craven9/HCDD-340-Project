import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockExpenses } from '../lib/expenseData';
import { TrendingUp, Calendar, PieChart as PieChartIcon } from 'lucide-react';

export function Analytics() {
  // Calculate analytics data
  const totalExpenses = mockExpenses.length;
  const avgTransaction = mockExpenses.reduce((sum, e) => sum + e.amount, 0) / totalExpenses;
  
  // Calculate category percentages and top category
  const categoryData = mockExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({
        name: expense.category,
        value: expense.amount
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  const topCategory = categoryData.reduce((a, b) => a.value > b.value ? a : b);
  const topCategoryPct = ((topCategory.value / totalSpent) * 100).toFixed(0);

  // Color mapping for pie chart
  const categoryColors: { [key: string]: string } = {
    'Food & Dining': '#3B82F6',     // Blue
    'Shopping': '#EC4899',          // Pink
    'Bills & Utilities': '#10B981', // Green  
    'Healthcare': '#06B6D4',        // Cyan
    'Transportation': '#8B5CF6',    // Purple
    'Entertainment': '#F59E0B',     // Orange
    'Travel': '#EF4444',           // Red
    'Education': '#14B8A6',        // Teal
    'Other': '#6B7280'             // Gray
  };

  // Add colors and percentages to category data
  const pieData = categoryData.map(item => ({
    ...item,
    color: categoryColors[item.name] || '#6B7280',
    percentage: ((item.value / totalSpent) * 100).toFixed(0)
  }));

  // Generate daily spending data for last 14 days
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    
    // Simulate daily spending data
    const dayExpenses = mockExpenses.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.toDateString() === date.toDateString();
    });
    
    const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: dayTotal || (Math.random() * 150) // Add some randomized data for demo
    };
  });

  // Ensure we have some realistic spending patterns
  const enhancedDailyData = [
    { date: 'Mar 20', amount: 140 },
    { date: 'Mar 21', amount: 160 },
    { date: 'Mar 22', amount: 40 },
    { date: 'Mar 23', amount: 87 },
    { date: 'Mar 24', amount: 15 },
    { date: 'Mar 25', amount: 10 },
    { date: 'Mar 26', amount: 5 },
    { date: 'Mar 27', amount: 8 },
    { date: 'Mar 28', amount: 12 },
    { date: 'Mar 29', amount: 6 },
    { date: 'Mar 30', amount: 2 },
    { date: 'Mar 31', amount: 4 },
    { date: 'Apr 1', amount: 3 },
    { date: 'Apr 2', amount: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed insights into your spending patterns</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg. Transaction</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            ${avgTransaction.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">Across {totalExpenses} expenses</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Most Active Day</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            Monday
          </div>
          <p className="text-sm text-gray-500">$289.40 average</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChartIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Top Category</span>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {topCategory.name}
          </div>
          <p className="text-sm text-gray-500">{topCategoryPct}% of total spend</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Spending Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Daily Spending (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enhancedDailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                fontSize={12}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}