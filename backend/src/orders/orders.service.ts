import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MovementType, OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateOrderDto } from './dto/create-order.dto';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. List orders with items and cashier/staff attribution
  async findAll(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        createdBy: {
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
    });
  }

  // 2. Get single order details
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" was not found`);
    }

    return order;
  }

  // 3. Place order (ACID Transaction: Stock check + Stock deduction + StockMovement + Receipt snapshot)
  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);

    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch requested products and their current inventories
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { inventory: true },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('One or more products in the order do not exist');
      }

      // 2. Concurrency & Oversell Check: ensure enough physical stock for all items
      for (const item of dto.items) {
        const product = products.find((p) => p.id === item.productId)!;
        const availableStock = product.inventory?.stockQuantity ?? 0;

        if (availableStock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.name}". Available: ${availableStock}, Requested: ${item.quantity}`,
          );
        }
      }

      // 3. Compute total amount on server & build immutable line item snapshots
      let totalAmount = 0;
      const orderItemsData = [];

      // Generate human-readable unique order number: e.g. ORD-20261028-4821
      const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `ORD-${datePrefix}-${randomSuffix}`;

      for (const item of dto.items) {
        const product = products.find((p) => p.id === item.productId)!;
        const linePrice = Number(product.price);
        totalAmount += linePrice * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price, // Historical price snapshot
        });

        // 4. Deduct physical inventory
        await tx.inventory.update({
          where: { productId: product.id },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });

        // 5. Log immutable StockMovement audit record
        await tx.stockMovement.create({
          data: {
            inventoryId: product.inventory!.id,
            type: MovementType.OUT,
            quantity: item.quantity,
            reason: `Order fulfillment: ${orderNumber} (${item.quantity}x ${product.name})`,
            userId,
          },
        });
      }

      // 6. Create Order record with nested line items
      return tx.order.create({
        data: {
          orderNumber,
          status: OrderStatus.COMPLETED,
          totalAmount,
          createdById: userId,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });
    });
  }

  // 4. Update order status (PENDING -> COMPLETED or CANCELLED)
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
