import React, { useEffect, useState } from 'react';
import { BarChart, PieChart, ArrowUp, ArrowDown, Wallet, ShoppingBag } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/formatter';

const Dashboard: React.FC = () => {
  const { products, categories } = useProducts();
  const { transactions } = useCart();
  const [totalSales, setTotalSales] = useState(0);
  const [todaySales, setTodaySales] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [todayTransactions, setTodayTransactions] = useState(0);
  const [productsByCategory, setProductsByCategory] = useState<{[key: string]: number}>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  
  // Process dashboard data
  useEffect(() => {
    // Calculate total sales and transactions
    let total = 0;
    transactions.forEach(t => total += t.total);
    setTotalSales(total);
    setTotalTransactions(transactions.length);
    
    // Calculate today's sales and transactions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayData = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= today;
    });
    
    let todayTotal = 0;
    todayData.forEach(t => todayTotal += t.total);
    setTodaySales(todayTotal);
    setTodayTransactions(todayData.length);
    
    // Calculate products by category
    const categoryCount: {[key: string]: number} = {};
    products.forEach(p => {
      if (categoryCount[p.category]) {
        categoryCount[p.category]++;
      } else {
        categoryCount[p.category] = 1;
      }
    });
    setProductsByCategory(categoryCount);
    
    // Recent transactions
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentTransactions(recent);
  }, [products, transactions]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Penjualan</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
              <BarChart size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Penjualan Hari Ini</p>
              <p className="text-2xl font-bold">{formatCurrency(todaySales)}</p>
              {todaySales > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUp size={12} className="mr-1" />
                  {((todaySales / (totalSales || 1)) * 100).toFixed(1)}% dari total
                </p>
              )}
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
              <Wallet size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transaksi Hari Ini</p>
              <p className="text-2xl font-bold">{todayTransactions}</p>
              {todayTransactions > 0 && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUp size={12} className="mr-1" />
                  {((todayTransactions / (totalTransactions || 1)) * 100).toFixed(1)}% dari total
                </p>
              )}
            </div>
            <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-300">
              <PieChart size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Category and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Produk berdasarkan Kategori</h2>
          
          {Object.keys(productsByCategory).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(productsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mr-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${(count / products.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm whitespace-nowrap">{category} ({count})</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">Tidak ada data kategori</p>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Transaksi Terbaru</h2>
          
          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                    <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b dark:border-gray-700">
                      <td className="py-2 px-3 text-sm">{formatReceiptNumber(transaction.id)}</td>
                      <td className="py-2 px-3 text-sm">{new Date(transaction.date).toLocaleDateString('id-ID')}</td>
                      <td className="py-2 px-3 text-sm">{transaction.items.length} item</td>
                      <td className="py-2 px-3 text-sm text-right">{formatCurrency(transaction.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">Belum ada transaksi</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Helper function for formatting receipt number
// This should be in formatter.ts, but added here for completeness
function formatReceiptNumber(id: string): string {
  const date = new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `INV/${year}${month}${day}/${id.substring(0, 4).toUpperCase()}`;
}