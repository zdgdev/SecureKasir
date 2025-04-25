import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800 dark:text-gray-200">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate('/')}
        >
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;