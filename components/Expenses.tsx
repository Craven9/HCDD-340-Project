import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Sparkles, X, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockExpenses, categories, type Expense, type ReceiptItem } from '../lib/expenseData';

export function Expenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expandedExpenseId, setExpandedExpenseId] = useState<string | null>(null);
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
      // Clear localStorage after loading
      localStorage.removeItem('scannedExpenses');
    }
  }, []);

  // AI category suggestion simulation
  const getAISuggestion = (description: string): { category: string; confidence: number } => {
    const desc = description.toLowerCase();
    if (desc.includes('uber') || desc.includes('lyft') || desc.includes('gas')) {
      return { category: 'Transportation', confidence: 0.95 };
    }
    if (desc.includes('restaurant') || desc.includes('food') || desc.includes('starbucks')) {
      return { category: 'Food & Dining', confidence: 0.92 };
    }
    if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie')) {
      return { category: 'Entertainment', confidence: 0.90 };
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('internet')) {
      return { category: 'Bills & Utilities', confidence: 0.96 };
    }
    if (desc.includes('amazon') || desc.includes('target') || desc.includes('shopping')) {
      return { category: 'Shopping', confidence: 0.88 };
    }
    return { category: 'Other', confidence: 0.70 };
  };

  const aiSuggestion = newExpense.description.length > 3 
    ? getAISuggestion(newExpense.description) 
    : null;

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    if (editingExpense) {
      // Update existing expense
      setExpenses(expenses.map(exp => 
        exp.id === editingExpense.id 
          ? {
              ...exp,
              description: newExpense.description,
              amount: parseFloat(newExpense.amount),
              category: newExpense.category || aiSuggestion?.category || 'Other',
              date: newExpense.date,
            }
          : exp
      ));
      setEditingExpense(null);
    } else {
      // Add new expense
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category || aiSuggestion?.category || 'Other',
        date: newExpense.date,
        aiConfidence: aiSuggestion?.confidence,
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
    setEditingExpense(expense);
    setNewExpense({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setShowAddModal(true);
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

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Expenses</h2>
          <p className="text-sm text-gray-500">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Export */}
          <button 
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Export</span>
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Date</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Description</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Category</th>
              <th className="px-6 py-3 text-right text-xs text-gray-500">Amount</th>
              <th className="px-6 py-3 text-right text-xs text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <React.Fragment key={expense.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {expense.receiptItems && expense.receiptItems.length > 0 && (
                        <button
                          onClick={() => setExpandedExpenseId(expandedExpenseId === expense.id ? null : expense.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedExpenseId === expense.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <div>
                        <div className="text-sm text-gray-900">{expense.description}</div>
                        {expense.transactionType && (
                          <div className="text-xs text-gray-500 mt-0.5">{expense.transactionType}</div>
                        )}
                        {expense.tags && expense.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {expense.tags.map(tag => (
                              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {expense.category}
                    </span>
                    {expense.recurring && (
                      <span className="ml-2 text-xs text-gray-500">Recurring</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          if (expense.receiptItems && expense.receiptItems.length > 0) {
                            setEditingReceiptExpense(expense);
                          } else {
                            handleEditExpense(expense);
                          }
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Expandable Receipt Items */}
                {expandedExpenseId === expense.id && expense.receiptItems && expense.receiptItems.length > 0 && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="ml-10">
                        <div className="text-xs text-gray-500 mb-2">Receipt Items ({expense.receiptItems.length})</div>
                        <div className="space-y-1">
                          {expense.receiptItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-sm">
                              <div className="flex-1">
                                <span className="text-gray-900">{item.description}</span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-xs text-blue-600">{item.category}</span>
                              </div>
                              <span className="text-gray-900">${item.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Whole Foods Market"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* AI Suggestion */}
              {aiSuggestion && !newExpense.category && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">AI Suggestion</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Based on the description, this looks like a <strong>{aiSuggestion.category}</strong> expense 
                        ({(aiSuggestion.confidence * 100).toFixed(0)}% confidence)
                      </p>
                      <button
                        onClick={() => setNewExpense({ ...newExpense, category: aiSuggestion.category })}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        Apply suggestion
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.description || !newExpense.amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Receipt Modal */}
      {editingReceiptExpense && editingReceiptExpense.receiptItems && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900">Edit Receipt</h3>
              <button
                onClick={() => setEditingReceiptExpense(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Merchant / Description</label>
                <input
                  type="text"
                  value={editingReceiptExpense.description}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Date</label>
                <input
                  type="date"
                  value={editingReceiptExpense.date}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Transaction Type</label>
                <select
                  value={editingReceiptExpense.transactionType || 'Credit'}
                  onChange={(e) => setEditingReceiptExpense({ ...editingReceiptExpense, transactionType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Category</label>
                <select
                  value={editingReceiptExpense.category}
                  onChange={(e) => {
                    // Update expense category and all item categories
                    const updatedItems = editingReceiptExpense.receiptItems!.map(item => ({ 
                      ...item,
                      category: e.target.value
                    }));
                    setEditingReceiptExpense({
                      ...editingReceiptExpense,
                      category: e.target.value,
                      receiptItems: updatedItems
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-gray-700">Items</label>
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
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {editingReceiptExpense.receiptItems!.map((item, index) => (
                    <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs text-gray-500 mt-2 flex-shrink-0">#{index + 1}</span>
                        <div className="flex-1 space-y-2">
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
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={item.amount}
                              onChange={(e) => {
                                const updatedItems = editingReceiptExpense.receiptItems!.map(i => 
                                  i.id === item.id ? { ...i, amount: parseFloat(e.target.value) || 0 } : i
                                );
                                setEditingReceiptExpense({ ...editingReceiptExpense, receiptItems: updatedItems });
                              }}
                              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (editingReceiptExpense.receiptItems!.length > 1) {
                              const updatedItems = editingReceiptExpense.receiptItems!.filter(i => i.id !== item.id);
                              setEditingReceiptExpense({ ...editingReceiptExpense, receiptItems: updatedItems });
                            }
                          }}
                          disabled={editingReceiptExpense.receiptItems!.length === 1}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Total Amount</span>
                    <span className="text-lg font-semibold text-blue-700">
                      ${editingReceiptExpense.receiptItems!.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingReceiptExpense(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Update the expense with new values
                  const totalAmount = editingReceiptExpense.receiptItems!.reduce((sum, item) => sum + item.amount, 0);
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
                disabled={!editingReceiptExpense.description || !editingReceiptExpense.receiptItems!.some(item => item.amount > 0)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Update Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}