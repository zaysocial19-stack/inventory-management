import { apiClient } from './client';
import type { InventoryItemWithProduct, StockMovement, MovementType } from '../types/api';

export interface ReceiveStockInput {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface AdjustStockInput {
  productId: string;
  quantity: number;
  type: MovementType;
  reason: string;
}

export const inventoryApi = {
  // Get all inventory with isLowStock computed flag
  getAll: async (): Promise<InventoryItemWithProduct[]> => {
    const response = await apiClient.get<InventoryItemWithProduct[]>('/inventory');
    return response.data;
  },

  // Get only low-stock urgent items
  getLowStock: async (): Promise<InventoryItemWithProduct[]> => {
    const response = await apiClient.get<InventoryItemWithProduct[]>('/inventory/low-stock');
    return response.data;
  },

  // Receive stock intake (+quantity, logs 'IN' movement)
  receiveStock: async (data: ReceiveStockInput) => {
    const response = await apiClient.post('/inventory/receive', data);
    return response.data;
  },

  // Manual stock adjustment (spoilage, breakage, return)
  adjustStock: async (data: AdjustStockInput) => {
    const response = await apiClient.post('/inventory/adjust', data);
    return response.data;
  },

  // Audit trail of movements (Admin / Manager only)
  getMovements: async (): Promise<StockMovement[]> => {
    const response = await apiClient.get<StockMovement[]>('/inventory/movements');
    return response.data;
  },
};
