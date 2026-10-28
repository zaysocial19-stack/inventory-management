import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Fetch all products with relational joins
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        supplier: true,
        inventory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Fetch all product categories
  async getCategories() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Fetch all suppliers
  async getSuppliers() {
    return this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 2. Fetch a single product by ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        inventory: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" was not found`);
    }

    return product;
  }

  // 3. Create product + inventory atomically inside a transaction
  async create(dto: CreateProductDto) {
    const normalizedSku = dto.sku.trim().toUpperCase();

    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID "${dto.categoryId}" not found`);
    }

    // Verify supplier exists (if provided)
    if (dto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: dto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID "${dto.supplierId}" not found`);
      }
    }

    // Check SKU uniqueness
    const existing = await this.prisma.product.findUnique({
      where: { sku: normalizedSku },
    });
    if (existing) {
      throw new ConflictException(`Product with SKU "${normalizedSku}" already exists`);
    }

    // Execute atomic transaction: product + inventory + initial stock movement
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          sku: normalizedSku,
          name: dto.name.trim(),
          description: dto.description?.trim(),
          price: dto.price,
          categoryId: dto.categoryId,
          supplierId: dto.supplierId,
        },
      });

      const initialStock = dto.initialStock ?? 0;
      const minStockThreshold = dto.minStockThreshold ?? 5;

      const inventory = await tx.inventory.create({
        data: {
          productId: product.id,
          stockQuantity: initialStock,
          minStockThreshold: minStockThreshold,
        },
      });

      // Audit trail: Log initial stock intake if greater than 0
      if (initialStock > 0) {
        await tx.stockMovement.create({
          data: {
            inventoryId: inventory.id,
            type: MovementType.IN,
            quantity: initialStock,
            reason: 'Initial stock on product creation',
          },
        });
      }

      return {
        ...product,
        inventory,
      };
    });
  }

    // 4. Update product details
  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" was not found`);
    }

    // If updating SKU, check for uniqueness conflicts
    if (dto.sku) {
      const normalizedSku = dto.sku.trim().toUpperCase();
      if (normalizedSku !== existing.sku) {
        const skuConflict = await this.prisma.product.findUnique({
          where: { sku: normalizedSku },
        });
        if (skuConflict) {
          throw new ConflictException(`Product with SKU "${normalizedSku}" already exists`);
        }
      }
    }

    // If updating categoryId, check existence
    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID "${dto.categoryId}" not found`);
      }
    }

    // If updating supplierId, check existence
    if (dto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: dto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException(`Supplier with ID "${dto.supplierId}" not found`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...(dto.sku && { sku: dto.sku.trim().toUpperCase() }),
          ...(dto.name && { name: dto.name.trim() }),
          ...(dto.description !== undefined && { description: dto.description?.trim() }),
          ...(dto.price !== undefined && { price: dto.price }),
          ...(dto.categoryId && { categoryId: dto.categoryId }),
          ...(dto.supplierId !== undefined && { supplierId: dto.supplierId }),
        },
        include: {
          category: true,
          supplier: true,
          inventory: true,
        },
      });

      if (dto.minStockThreshold !== undefined) {
        await tx.inventory.update({
          where: { productId: id },
          data: { minStockThreshold: dto.minStockThreshold },
        });
      }

      return updatedProduct;
    });
  }

  // 5. Delete product with historical ledger protection
  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" was not found`);
    }

    // Integrity constraint: cannot delete a product with existing customer order receipts
    if (existing.orderItems.length > 0) {
      throw new ConflictException(
        `Cannot delete product "${existing.name}" because it is referenced in ${existing.orderItems.length} historical order(s).`
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: `Product "${existing.name}" (${existing.sku}) deleted successfully`,
    };
  }

}
