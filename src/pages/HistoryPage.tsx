import React, { useState } from 'react';
import { Search, CalendarIcon, Eye, ArrowDownUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, formatDate } from '../utils/formatter';
import Modal, { useModal } from '../components/UI/Modal';
import Receipt from '../components/POS/Receipt';

const HistoryPage: React.FC = () => {
  const { transactions } = useCart();
  const { isOpen, openModal, closeModal } = useModal();
  
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState('');
  
  // Filtered and sorted transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && !transaction.id.toLowerCase().includes(searchLower)) {
      return false;
    }
    
    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const transactionDate = new Date(transaction.date);
      
      // Compare only the date part
      if (
        filterDate.getFullYear() !== transactionDate.getFullYear() ||
        filterDate.getMonth() !== transactionDate.getMonth() ||
        filterDate.getDate() !== transactionDate.getDate()
      ) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'total') {
      return sortDirection === 'asc'
        ? a.total - b.total
        : b.total - a.total;
    } else if (sortField === 'items') {
      return sortDirection === 'asc'
        ? a.items.length - b.items.length
        : b.items.length - a.items.length;
    }
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const viewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    openModal();
  };
  
  // Helper function for formatting receipt number
  const formatReceiptNumber = (id: string): string => {
    const date = new Date();
    const year = date.getFullYear().toString().substring(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `INV/${year}${month}${day}/${id.substring(0, 4).toUpperCase()}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <CalendarIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID Transaksi
                  </th>
                  <th 
                    scope="col" 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Tanggal
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('items')}
                  >
                    <div className="flex items-center">
                      Item
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      <ArrowDownUp size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatReceiptNumber(transaction.id)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.items.length}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {formatCurrency(transaction.total)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        onClick={() => viewTransaction(transaction)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">Tidak ada transaksi yang ditemukan</p>
        </div>
      )}
      
      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title="Detail Transaksi"
        >
          <Receipt
            items={selectedTransaction.items}
            subtotal={selectedTransaction.subtotal}
            discount={selectedTransaction.discount}
            total={selectedTransaction.total}
            paymentMethod={selectedTransaction.paymentMethod}
            cashReceived={selectedTransaction.cashReceived}
            change={selectedTransaction.change}
            transactionId={selectedTransaction.id}
            date={selectedTransaction.date}
          />
        </Modal>
      )}
    </div>
  );
};

export default HistoryPage;