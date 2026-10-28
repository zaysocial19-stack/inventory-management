import { apiClient } from './client';
import type { Order, OrderStatus } from '../types/api';

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export const ordersApi = {
  // Fetch all orders history
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  // Fetch single order details
  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Execute atomic checkout transaction
  create: async (data: CreateOrderInput): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  // Update order status (Admin / Manager)
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
