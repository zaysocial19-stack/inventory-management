import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, type CreateProductInput } from './products';
import { inventoryApi, type ReceiveStockInput, type AdjustStockInput } from './inventory';
import { ordersApi, type CreateOrderInput } from './orders';
import type { OrderStatus } from '../types/api';

export const queryKeys = {
  products: ['products'] as const,
  categories: ['categories'] as const,
  suppliers: ['suppliers'] as const,
  inventory: ['inventory'] as const,
  lowStock: ['inventory', 'low-stock'] as const,
  movements: ['movements'] as const,
  orders: ['orders'] as const,
};

// --- Products Hooks ---
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: productsApi.getAll,
    staleTime: 1000 * 60, // 1 minute in-memory cache
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: productsApi.getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: productsApi.getSuppliers,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.lowStock });
    },
  });
}

// --- Inventory Hooks ---
export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory,
    queryFn: inventoryApi.getAll,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: queryKeys.lowStock,
    queryFn: inventoryApi.getLowStock,
    staleTime: 1000 * 30,
  });
}

export function useMovements(enabled = true) {
  return useQuery({
    queryKey: queryKeys.movements,
    queryFn: inventoryApi.getMovements,
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useReceiveStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReceiveStockInput) => inventoryApi.receiveStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.lowStock });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.movements });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdjustStockInput) => inventoryApi.adjustStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.lowStock });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.movements });
    },
  });
}

// --- Orders Hooks ---
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: ordersApi.getAll,
    staleTime: 1000 * 30,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.create(data),
    onSuccess: () => {
      // Invalidate orders, inventory, products, and movements simultaneously!
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory });
      queryClient.invalidateQueries({ queryKey: queryKeys.lowStock });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.movements });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
  });
}
