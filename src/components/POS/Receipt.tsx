import React, { useRef } from 'react';
import { Printer } from 'lucide-react';
import { CartItem } from '../../types';
import { formatCurrency, formatDate, formatReceiptNumber } from '../../utils/formatter';
import Button from '../UI/Button';
import { printReceipt } from '../../utils/print';

interface ReceiptProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  cashReceived: number;
  change: number;
  customerName?: string;
  note?: string;
  transactionId?: string;
  date?: string;
  preview?: boolean;
}

const Receipt: React.FC<ReceiptProps> = ({
  items,
  subtotal,
  discount,
  total,
  paymentMethod,
  cashReceived,
  change,
  customerName,
  note,
  transactionId,
  date,
  preview = false
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    if (receiptRef.current) {
      printReceipt(receiptRef.current);
    }
  };
  
  const receiptNumber = transactionId ? formatReceiptNumber(transactionId) : 'PREVIEW';
  const transactionDate = date ? formatDate(date) : formatDate(new Date());
  
  return (
    <div>
      {!preview && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="primary"
            onClick={handlePrint}
          >
            <Printer size={16} className="mr-1" />
            Cetak Struk
          </Button>
        </div>
      )}
      
      <div 
        ref={receiptRef}
        className={`bg-white p-4 rounded-md border ${preview ? 'text-xs mt-4' : ''}`}
      >
        <div className="receipt-header">
          <h2 className="font-bold text-center text-lg mb-1">SecureKasir</h2>
          <p className="text-center text-sm mb-1">Jl. Contoh No. 123, Jakarta</p>
          <p className="text-center text-sm mb-1">Telp: 021-1234567</p>
          <div className="border-t border-b border-dashed my-2 py-1">
            <p className="text-sm">No: {receiptNumber}</p>
            <p className="text-sm">Tanggal: {transactionDate}</p>
            {customerName && <p className="text-sm">Pelanggan: {customerName}</p>}
            {note && <p className="text-sm">Catatan: {note}</p>}
          </div>
        </div>
        
        <table className="receipt-items w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Item</th>
              <th className="text-right py-1">Qty</th>
              <th className="text-right py-1">Harga</th>
              <th className="text-right py-1">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.productId || index}>
                <td className="text-left py-1">{item.name}</td>
                <td className="text-right py-1">{item.quantity}</td>
                <td className="text-right py-1">{formatCurrency(item.price)}</td>
                <td className="text-right py-1">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="receipt-total mt-2 pt-1 border-t border-dashed">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Diskon:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold mt-1">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          
          <div className="mt-1">
            <div className="flex justify-between">
              <span>Pembayaran ({paymentMethod === 'cash' ? 'Tunai' : 'QRIS'}):</span>
              <span>{formatCurrency(cashReceived)}</span>
            </div>
            {paymentMethod === 'cash' && (
              <div className="flex justify-between">
                <span>Kembalian:</span>
                <span>{formatCurrency(change)}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="receipt-footer mt-4 text-center text-xs">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;