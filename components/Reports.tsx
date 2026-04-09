import {
  Download,
  Printer,
  Mail,
  Share2,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { mockExpenses } from '../lib/expenseData';

export function Reports() {
  const totalSpent = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = mockExpenses.length;
  const avgExpense = totalSpent / totalExpenses;

  // Category totals with percentages
  const categoryTotals = mockExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const downloadCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = mockExpenses.map(exp => [
      exp.date,
      exp.description,
      exp.category,
      exp.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-march-2026.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const emailReport = () => {
    const subject = 'Expense Report - March 2026';
    const body = `Here's your expense report summary:\n\nTotal Spent: $${totalSpent.toFixed(2)}\nTotal Expenses: ${totalExpenses}\nAverage Expense: $${avgExpense.toFixed(2)}\nPeriod: March 2026`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Expense Report - March 2026',
        text: `Total spent: $${totalSpent.toFixed(2)} across ${totalExpenses} expenses`,
      });
    } else {
      // Fallback for browsers without Web Share API
      const text = `Expense Report - March 2026: $${totalSpent.toFixed(2)} total spent across ${totalExpenses} expenses`;
      navigator.clipboard.writeText(text);
      alert('Report summary copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
        <button
          onClick={printReport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          Print
        </button>
        <button
          onClick={emailReport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Mail className="w-4 h-4 text-gray-600" />
          Email
        </button>
        <button
          onClick={shareReport}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-4 h-4 text-gray-600" />
          Share
        </button>
      </div>

      {/* Report Summary */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Spent</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">${totalSpent.toFixed(2)}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Total Expenses</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">{totalExpenses}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Avg. Expense</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">${avgExpense.toFixed(2)}</div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">Period</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">March 2026</div>
          </div>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h2>
        <div className="space-y-4">
          {Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = (amount / totalSpent) * 100;
              return (
                <div key={category} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-900">{category}</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">({percentage.toFixed(1)}%)</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}