/**
 * Print receipt
 */
export const printReceipt = (receiptContent: HTMLElement): void => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Mohon izinkan popup untuk mencetak struk');
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Struk</title>
        <style>
          body {
            font-family: monospace;
            width: 300px;
            margin: 0 auto;
            padding: 10px;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-items {
            width: 100%;
          }
          .receipt-items tr td {
            padding: 2px 0;
          }
          .receipt-total {
            border-top: 1px dashed #000;
            margin-top: 10px;
            padding-top: 10px;
          }
          .receipt-footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
          }
          @media print {
            body {
              width: 80mm;
            }
          }
        </style>
      </head>
      <body>
        ${receiptContent.outerHTML}
        <script>
          setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 500);
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};