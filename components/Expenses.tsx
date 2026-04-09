import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Edit2, Trash2, X, ChevronDown } from 'lucide-react';
import { mockExpenses, categories, type Expense, type ReceiptItem } from '../lib/expenseData';

export function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingReceiptExpense, setEditingReceiptExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load scanned receipts from localStorage
  useEffect(() => {
    const scannedExpenses = JSON.parse(localStorage.getItem('scannedExpenses') || '[]');
    if (scannedExpenses.length > 0) {
      setExpenses([...scannedExpenses, ...mockExpenses]);
      localStorage.removeItem('scannedExpenses');
    }
  }, []);

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    if (editingExpense) {
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id 
          ? {
              ...exp,
              description: newExpense.description,
              amount: parseFloat(newExpense.amount),
              category: newExpense.category,
              date: newExpense.date,
            }
          : exp
      ));
      setEditingExpense(null);
    } else {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        tags: []
      };
      setExpenses([expense, ...expenses]);
    }

    setShowAddModal(false);
    setNewExpense({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditExpense = (expense: Expense) => {
    if (expense.receiptItems && expense.receiptItems.length > 0) {
      setEditingReceiptExpense({ ...expense });
    } else {
      setEditingExpense(expense);
      setNewExpense({
        description: expense.description,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date
      });
      setShowAddModal(true);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingExpense(null);
    setNewExpense({
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount'],
      ...filteredExpenses.map(exp => [
        exp.date,
        exp.description,
        exp.category,
        exp.amount.toString()
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-blue-50 text-blue-700 border-blue-200',
      'Transportation': 'bg-purple-50 text-purple-700 border-purple-200',
      'Entertainment': 'bg-orange-50 text-orange-700 border-orange-200',
      'Shopping': 'bg-pink-50 text-pink-700 border-pink-200',
      'Bills & Utilities': 'bg-green-50 text-green-700 border-green-200',
      'Healthcare': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'Travel': 'bg-red-50 text-red-700 border-red-200',
      'Education': 'bg-teal-50 text-teal-700 border-teal-200',
      'Other': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[category] || colors['Other'];
  };

  const getSubtext = (expense: Expense) => {
    if (expense.tags && expense.tags.length > 0) {
      return expense.tags.join(', ');
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px]"
          >
            <option value="All Categories">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Export */}
        <button 
          onClick={exportData}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600 font-medium">Export</span>
        </button>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Amount</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={expense.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === filteredExpenses.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{expense.description}</div>
                    {getSubtext(expense) && (
                      <div className="text-sm text-gray-500 mt-0.5">{getSubtext(expense)}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                    {expense.recurring && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Recurring
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-medium text-gray-900">${expense.amount.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditExpense(expense)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit expense"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No expenses found. {searchTerm || selectedCategory !== 'All Categories' ? 'Try adjusting your filters.' : 'Add your first expense!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Whole Foods Market"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.description || !newExpense.amount || !newExpense.category}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {editingExpense ? 'Update' : 'Add'} Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Receipt Modal */}
      {editingReceiptExpense && editingReceiptExpense.receiptItems && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Receipt Items</h3>
              <button
                onClick={() => setEditingReceiptExpense(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
                <input
                  type="text"
                  value={editingReceiptExpense.description}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={editingReceiptExpense.date}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, date: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editingReceiptExpense.category}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, category: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={editingReceiptExpense.transactionType || 'Credit'}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, transactionType: e.target.value as any })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit Card</option>
                  <option value="Debit">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Receipt Items</h4>
                <button
                  onClick={() => {
                    const newItem: ReceiptItem = {
                      id: Date.now().toString(),
                      description: '',
                      amount: 0,
                      category: editingReceiptExpense.category
                    };
                    setEditingReceiptExpense({
                      ...editingReceiptExpense,
                      receiptItems: [...(editingReceiptExpense.receiptItems || []), newItem]
                    });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {editingReceiptExpense.receiptItems!.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 min-w-0 px-2 py-1 bg-white rounded">{index + 1}</span>
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => {
                          const updatedItems = editingReceiptExpense.receiptItems!.map(i => 
                            i.id === item.id ? { ...i, description: e.target.value } : i
                          );
                          setEditingReceiptExpense({ ...editingReceiptExpense, receiptItems: updatedItems });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="relative min-w-0 w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.amount || ''}
                          onChange={(e) => {
                            const updatedItems = editingReceiptExpense.receiptItems!.map(i => 
                              i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i
                            );
                            setEditingReceiptExpense({ ...editingReceiptExpense, receiptItems: updatedItems });
                          }}
                          className="w-full pl-5 pr-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updatedItems = editingReceiptExpense.receiptItems!.filter(i => i.id !== item.id);
                          setEditingReceiptExpense({ ...editingReceiptExpense, receiptItems: updatedItems });
                        }}
                        disabled={editingReceiptExpense.receiptItems!.length === 1}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Amount:</span>
                  <span className="text-xl font-semibold text-blue-700">
                    ${editingReceiptExpense.receiptItems!.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setEditingReceiptExpense(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const totalAmount = editingReceiptExpense.receiptItems!.reduce((sum, item) => sum + (item.amount || 0), 0);
                  setExpenses(expenses.map(exp => 
                    exp.id === editingReceiptExpense.id
                      ? {
                          ...editingReceiptExpense,
                          amount: totalAmount
                        }
                      : exp
                  ));
                  setEditingReceiptExpense(null);
                }}
                disabled={!editingReceiptExpense.description || editingReceiptExpense.receiptItems!.length === 0}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}