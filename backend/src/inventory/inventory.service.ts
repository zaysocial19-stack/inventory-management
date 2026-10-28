import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AdjustStockDto } from './dto/adjust-stock.dto';
import type { ReceiveStockDto } from './dto/receive-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Get all inventory items with computed low-stock status
  async findAll() {
    const inventories = await this.prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    });

    return inventories.map((inv) => ({
      ...inv,
      isLowStock: inv.stockQuantity <= inv.minStockThreshold,
    }));
  }

  // 2. Get only low-stock items requiring urgent restocking
  async findLowStock() {
    const all = await this.findAll();
    return all.filter((item) => item.isLowStock);
  }

  // 3. Receive stock shipment (Transaction: +Quantity + Audit Movement 'IN')
  async receiveStock(userId: string, dto: ReceiveStockDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
      include: { product: true },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ID "${dto.productId}" was not found`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Increment physical stock
      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          stockQuantity: { increment: dto.quantity },
        },
        include: {
          product: true,
        },
      });

      // 2. Log immutable audit movement
      const movement = await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: MovementType.IN,
          quantity: dto.quantity,
          reason: dto.reason?.trim() || 'Supplier stock intake',
          userId,
        },
      });

      return {
        ...updatedInventory,
        isLowStock:
          updatedInventory.stockQuantity <= updatedInventory.minStockThreshold,
        movement,
      };
    });
  }

  // 4. Adjust stock for waste, breakage, or audits (Transaction: +/-Quantity + Audit Movement)
  async adjustStock(userId: string, dto: AdjustStockDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
      include: { product: true },
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventory for product ID "${dto.productId}" was not found`,
      );
    }

    // Protect against negative stock on deductions
    const isDeduction =
      dto.type === MovementType.OUT || dto.type === MovementType.ADJUSTMENT;
    if (isDeduction && inventory.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Cannot deduct ${dto.quantity} units from product "${inventory.product.name}". Current available stock is only ${inventory.stockQuantity}.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // If RETURN: stock increases. If OUT or ADJUSTMENT: stock decreases.
      const stockChange =
        dto.type === MovementType.RETURN
          ? { increment: dto.quantity }
          : { decrement: dto.quantity };

      const updatedInventory = await tx.inventory.update({
        where: { id: inventory.id },
        data: {
          stockQuantity: stockChange,
        },
        include: {
          product: true,
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: dto.type,
          quantity: dto.quantity,
          reason: dto.reason.trim(),
          userId,
        },
      });

      return {
        ...updatedInventory,
        isLowStock:
          updatedInventory.stockQuantity <= updatedInventory.minStockThreshold,
        movement,
      };
    });
  }

  // 5. Get complete stock movement audit history
  async getMovements(limit = 50) {
    return this.prisma.stockMovement.findMany({
      include: {
        inventory: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
}
