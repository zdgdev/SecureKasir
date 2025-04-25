import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatter';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal, { useModal } from '../UI/Modal';
import Receipt from './Receipt';

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, discount, setDiscount, addTransaction, calculateTotal } = useCart();
  const { isOpen, openModal, closeModal } = useModal();
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  
  const { subtotal, total } = calculateTotal();
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity >= 1) {
      updateQuantity(productId, quantity);
    }
  };
  
  const handlePayment = () => {
    if (cart.length === 0) return;
    
    if (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) {
      alert('Jumlah uang yang diberikan tidak mencukupi');
      return;
    }
    
    const cashAmount = paymentMethod === 'cash' ? parseFloat(cashReceived) : total;
    
    const transaction = {
      items: [...cart],
      subtotal,
      discount,
      total,
      date: new Date().toISOString(),
      paymentMethod,
      cashReceived: cashAmount,
      change: paymentMethod === 'cash' ? cashAmount - total : 0
    };
    
    addTransaction(transaction);
    closeModal();
  };
  
  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
        <svg
          className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <p className="mb-2">Keranjang belanja Anda kosong</p>
        <p className="text-sm text-center">Silakan tambahkan produk dengan mengklik produk di sebelah kiri</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3 p-1">
          {cart.map((item) => (
            <div 
              key={item.productId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between mb-2">
                <div className="font-medium">{item.name}</div>
                <div>{formatCurrency(item.price)}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span className="w-8 text-center">{item.quantity}</span>
                  
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div>{formatCurrency(item.subtotal)}</div>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Cart Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 mt-4">
        <div className="mb-2">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex items-center mb-1">
            <span className="text-gray-600 dark:text-gray-400 text-sm mr-2">Diskon:</span>
            <Input
              id="discount"
              name="discount"
              type="number"
              value={discount.toString()}
              onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
              className="mb-0 flex-1"
            />
          </div>
        </div>
        
        <div className="border-t pt-2 flex justify-between items-center font-medium text-lg">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={clearCart}
          >
            Batal
          </Button>
          
          <Button
            variant="primary"
            className="w-full"
            onClick={openModal}
          >
            Bayar
          </Button>
        </div>
      </div>
      
      {/* Checkout Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Pembayaran"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeModal}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              onClick={handlePayment}
            >
              Selesaikan Transaksi
            </Button>
          </>
        }
      >
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`py-2 px-4 border rounded-md ${
                  paymentMethod === 'cash'
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setPaymentMethod('cash')}
              >
                Tunai
              </button>
              <button
                className={`py-2 px-4 border rounded-md ${
                  paymentMethod === 'qris'
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
                onClick={() => setPaymentMethod('qris')}
              >
                QRIS
              </button>
            </div>
          </div>
          
          {paymentMethod === 'cash' && (
            <div className="mb-4">
              <Input
                id="cashReceived"
                name="cashReceived"
                label="Jumlah Uang (Rp)"
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                required
              />
              
              {cashReceived && parseFloat(cashReceived) >= total && (
                <div className="mt-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-md text-sm">
                  Kembalian: {formatCurrency(parseFloat(cashReceived) - total)}
                </div>
              )}
            </div>
          )}
          
          <Input
            id="customerName"
            name="customerName"
            label="Nama Pelanggan (Opsional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          
          <Input
            id="note"
            name="note"
            label="Catatan (Opsional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          
          <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
            <h3 className="font-medium mb-2">Ringkasan Transaksi</h3>
            <div className="space-y-1 text-sm mb-2">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <Receipt
            items={cart}
            subtotal={subtotal}
            discount={discount}
            total={total}
            paymentMethod={paymentMethod}
            cashReceived={parseFloat(cashReceived) || 0}
            change={paymentMethod === 'cash' ? (parseFloat(cashReceived) || 0) - total : 0}
            customerName={customerName}
            note={note}
            preview
          />
        </>
      </Modal>
    </div>
  );
};

export default Cart;