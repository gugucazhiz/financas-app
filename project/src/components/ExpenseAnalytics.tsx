import React, { useState } from 'react';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function ExpenseAnalytics() {
  const { getMonthlyData, getCategoryData, getTotalExpenses } = useExpenses();
  const [activeChart, setActiveChart] = useState<'bar' | 'pie'>('bar');

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const totalExpenses = getTotalExpenses();

  const averageMonthly = monthlyData.length > 0
    ? totalExpenses / monthlyData.length
    : 0;

  const highestMonth = monthlyData.reduce(
    (max, curr) => (curr.amount > max.amount ? curr : max),
    { month: 'N/A', amount: 0 }
  );

  const lowestMonth = monthlyData.reduce(
    (min, curr) => (curr.amount < min.amount ? curr : min),
    { month: 'N/A', amount: Infinity }
  );

  const topCategory = categoryData.reduce(
    (max, curr) => (curr.value > max.value ? curr : max),
    { name: 'N/A', value: 0 }
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Expense Analytics
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveChart('bar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeChart === 'bar'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChartIcon className="w-4 h-4" />
            Monthly Trend
          </button>
          <button
            onClick={() => setActiveChart('pie')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeChart === 'pie'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            Category Split
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-[400px]">
          {activeChart === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  name="Monthly Expenses"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Key Insights
          </h3>
          <ul className="space-y-3 text-gray-600">
            {monthlyData.length > 0 ? (
              <>
                <li>• Highest spending: {highestMonth.month} (${highestMonth.amount.toFixed(2)})</li>
                <li>• Lowest spending: {lowestMonth.month} (${lowestMonth.amount.toFixed(2)})</li>
                <li>• Average monthly: ${averageMonthly.toFixed(2)}</li>
                <li>• Top category: {topCategory.name} (${topCategory.value.toFixed(2)})</li>
              </>
            ) : (
              <li>Add some expenses to see insights!</li>
            )}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recommendations
          </h3>
          <ul className="space-y-3 text-gray-600">
            {categoryData.length > 0 ? (
              categoryData.map(category => {
                const percentage = (category.value / totalExpenses * 100).toFixed(0);
                return (
                  <li key={category.name}>
                    • {category.name}: {percentage}% of total
                    {parseInt(percentage) > 30 && " - Consider reducing"}
                    {parseInt(percentage) < 10 && " - Well controlled"}
                  </li>
                );
              })
            ) : (
              <li>Add some expenses to see recommendations!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExpenseAnalytics;