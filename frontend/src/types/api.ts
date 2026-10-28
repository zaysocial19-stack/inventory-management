// Role enum matching backend Prisma schema
export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface RoleEntity {
  id: string;
  name: Role;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleEntity;
  roleId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string | null;
  phone?: string | null;
}

export interface Inventory {
  id: string;
  productId: string;
  stockQuantity: number;
  minStockThreshold: number;
  lastRestockedAt?: string | null;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string | null;
  price: number | string;
  categoryId: string;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
  inventory?: Inventory | null;
}

export interface InventoryItemWithProduct extends Inventory {
  product: Product;
  isLowStock: boolean;
}

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';

export interface StockMovement {
  id: string;
  inventoryId: string;
  type: MovementType;
  quantity: number;
  reason?: string | null;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number | string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number | string;
  status: OrderStatus;
  userId: string;
  createdAt: string;
  items: OrderItem[];
  createdBy?: {
    id: string;
    fullName: string;
    email: string;
  };
}
