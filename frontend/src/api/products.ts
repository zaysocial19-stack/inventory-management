import { apiClient } from './client';
import type { Product, Category, Supplier } from '../types/api';

export interface CreateProductInput {
  sku: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  supplierId: string;
  initialStock?: number;
  minStockThreshold?: number;
}

export const productsApi = {
  // Get all products with joined category, supplier, and inventory
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  // Get single product by UUID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Create product + inventory (Admin / Manager)
  create: async (data: CreateProductInput): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  // Update existing product details (Admin / Manager)
  update: async (id: string, data: Partial<CreateProductInput>): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Delete product (Admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  // Fetch category & supplier lists for dropdown selects
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/products/meta/categories');
    return response.data;
  },

  getSuppliers: async (): Promise<Supplier[]> => {
    const response = await apiClient.get<Supplier[]>('/products/meta/suppliers');
    return response.data;
  },
};
