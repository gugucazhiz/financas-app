import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DollarSign, BarChart } from 'lucide-react';
import ExpenseTracker from './components/ExpenseTracker';
import ExpenseAnalytics from './components/ExpenseAnalytics';
import { ExpenseProvider } from './context/ExpenseContext';

function App() {
  return (
    <ExpenseProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-md">
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Finance Tracker
                </h1>
                <div className="flex gap-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <DollarSign className="w-5 h-5" />
                    Expenses
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <BarChart className="w-5 h-5" />
                    Analytics
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <div className="max-w-4xl mx-auto p-6">
            <Routes>
              <Route path="/" element={<ExpenseTracker />} />
              <Route path="/analytics" element={<ExpenseAnalytics />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ExpenseProvider>
  );
}

export default App;