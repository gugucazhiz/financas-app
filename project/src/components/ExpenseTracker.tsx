import React, { useState } from 'react';
import { PlusCircle, PieChart, Trash2, Calendar } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';

function ExpenseTracker() {
  const { expenses, addExpense, deleteExpense, getTotalExpenses } = useExpenses();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ['Health', 'general', 'food', 'transport', 'entertainment', 'utilities'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    addExpense({
      amount: parseFloat(amount),
      description,
      category,
      date,
    });

    setAmount('');
    setDescription('');
    setCategory('general');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h2>
          <p className="text-3xl font-bold text-green-600">${getTotalExpenses().toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Categories Overview</h2>
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([cat, total]) => (
              <div key={cat} className="flex justify-between items-center">
                <span className="capitalize">{cat}</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date
              </span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-md"
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Expense
        </button>
      </form>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5" />
            Recent Expenses
          </h2>
          <div className="space-y-4">
            {expenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-800">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    <span className="capitalize">{expense.category}</span> • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-green-600">${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <p className="text-center text-gray-500 py-4">No expenses yet. Add your first expense above!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseTracker;