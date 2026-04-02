import { useState } from 'react';
import {
  Calendar,
  Download,
  FileText,
  TrendingUp,
  DollarSign,
  Tag,
  Filter,
  Printer,
  Mail,
  Share2
} from 'lucide-react';
import { mockExpenses } from '../lib/expenseData';

export function Reports() {
  const [dateRange, setDateRange] = useState('all');
  const [reportType, setReportType] = useState('summary');
  const [showGeneratedReport, setShowGeneratedReport] = useState(false);

  const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Category totals
  const categoryTotals = mockExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Monthly breakdown
  const monthlyData = mockExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const generateReport = () => {
    setShowGeneratedReport(true);
  };

  const downloadReport = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Tags', 'Recurring'];
    const rows = mockExpenses.map(exp => [
      exp.date,
      exp.description,
      exp.category,
      exp.amount.toFixed(2),
      exp.tags?.join('; ') || '',
      exp.recurring ? 'Yes' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-500">Generate and export expense reports</p>
      </div>

      {/* Report Configuration */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Report</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="category">By Category</option>
              <option value="monthly">Monthly Breakdown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={generateReport}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Generate Report
        </button>
      </div>

      {/* Generated Report */}
      {showGeneratedReport && (
        <>
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4 text-gray-600" />
              Email
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 text-gray-600" />
              Share
            </button>
          </div>

          {/* Report Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">Total Spent</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">${totalSpent.toFixed(2)}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Total Expenses</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">{mockExpenses.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Avg. Expense</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">
                  ${(totalSpent / mockExpenses.length).toFixed(2)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600">Period</span>
                </div>
                <div className="text-xl font-semibold text-gray-900">March 2026</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Spending by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = (amount / totalSpent) * 100;
                  return (
                    <div key={category} className="pb-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{category}</span>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">${amount.toFixed(2)}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Detailed Expense List */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Expense List</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mockExpenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {expense.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {expense.category}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                          ${expense.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900">
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      ${totalSpent.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}