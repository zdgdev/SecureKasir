import React, { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Modal, { useModal } from '../components/UI/Modal';
import { formatCurrency } from '../utils/formatter';

const SettingsPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Reset form when modal closes
  React.useEffect(() => {
    if (!isModalOpen) {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        image: '',
        category: '',
        stock: '',
      });
      setErrors({});
    }
  }, [isModalOpen]);
  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      image: '',
      category: '',
      stock: '',
    });
    openModal();
  };
  
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
    });
    openModal();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk tidak boleh kosong';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Harga tidak boleh kosong';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus berupa angka positif';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'URL gambar tidak boleh kosong';
    } else if (!formData.image.match(/^https?:\/\/.+\..+/)) {
      newErrors.image = 'URL gambar tidak valid';
    }
    
    if (!formData.category.trim() && !newCategory.trim()) {
      newErrors.category = 'Kategori tidak boleh kosong';
    }
    
    if (!formData.stock.trim()) {
      newErrors.stock = 'Stok tidak boleh kosong';
    } else if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok harus berupa angka tidak negatif';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      category: newCategory.trim() ? newCategory.trim() : formData.category,
      stock: parseInt(formData.stock),
    };
    
    if (editingProduct) {
      updateProduct({
        ...productData,
        id: editingProduct.id,
      });
    } else {
      addProduct(productData);
    }
    
    closeModal();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pengaturan Produk</h1>
        <Button
          variant="primary"
          onClick={handleAddProduct}
        >
          <Plus size={16} className="mr-1" />
          Tambah Produk
        </Button>
      </div>
      
      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Gambar
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nama Produk
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Harga
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stok
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        onClick={() => {
                          if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                            deleteProduct(product.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    Belum ada produk. Klik "Tambah Produk" untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
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
              onClick={handleSubmit}
            >
              <Save size={16} className="mr-1" />
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Nama Produk"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
          
          <Input
            id="price"
            name="price"
            label="Harga"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            error={errors.price}
            required
          />
          
          <Input
            id="image"
            name="image"
            label="URL Gambar"
            value={formData.image}
            onChange={handleInputChange}
            error={errors.image}
            required
          />
          
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Kategori<span className="text-red-500 ml-1">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                disabled={!!newCategory}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <div className="flex space-x-2">
                <Input
                  id="newCategory"
                  name="newCategory"
                  placeholder="Atau buat kategori baru"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mb-0"
                  disabled={!!formData.category}
                />
              </div>
            </div>
            
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          
          <Input
            id="stock"
            name="stock"
            label="Stok"
            type="number"
            value={formData.stock}
            onChange={handleInputChange}
            error={errors.stock}
            required
          />
          
          {formData.image && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Preview Gambar
              </p>
              <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Gambar+Tidak+Ditemukan';
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;