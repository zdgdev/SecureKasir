import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/formatter';

// Sample products
const sampleProducts: Product[] = [
  {
    id: 'p1',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Makanan',
    stock: 100
  },
  {
    id: 'p2',
    name: 'Es Teh Manis',
    price: 5000,
    image: 'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Minuman',
    stock: 100
  },
  {
    id: 'p3',
    name: 'Ayam Goreng',
    price: 15000,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Makanan',
    stock: 50
  },
  {
    id: 'p4',
    name: 'Es Jeruk',
    price: 7000,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Minuman',
    stock: 80
  },
  {
    id: 'p5',
    name: 'Soto Ayam',
    price: 20000,
    image: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Makanan',
    stock: 40
  },
  {
    id: 'p6',
    name: 'Kopi Hitam',
    price: 8000,
    image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Minuman',
    stock: 100
  },
  {
    id: 'p7',
    name: 'Mie Goreng Spesial',
    price: 18000,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Makanan',
    stock: 60
  },
  {
    id: 'p8',
    name: 'Air Mineral',
    price: 4000,
    image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Minuman',
    stock: 200
  }
];

interface ProductContextProps {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  categories: string[];
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage hook to persist products
  const [products, setProducts] = useLocalStorage<Product[]>('pos-products', []);
  const [categories, setCategories] = useState<string[]>([]);

  // Initialize with sample products if empty
  useEffect(() => {
    if (products.length === 0) {
      setProducts(sampleProducts);
    }
  }, [products.length, setProducts]);

  // Extract and maintain categories
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    setCategories(uniqueCategories);
  }, [products]);

  // Add a new product
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: generateId(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  // Update an existing product
  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  // Delete a product
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Get a product by ID
  const getProduct = (id: string) => {
    return products.find(p => p.id === id);
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    categories
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};