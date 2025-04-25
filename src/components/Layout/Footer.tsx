import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            &copy; {year} SecureKasir. Hak Cipta Dilindungi.
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Versi 1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;