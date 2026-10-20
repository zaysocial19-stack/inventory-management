import { PrismaClient, MovementType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Roles (RBAC)
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'System Administrator with full access to all resources',
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      description: 'Store Manager with inventory and order management access',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: 'STAFF' },
    update: {},
    create: {
      name: 'STAFF',
      description: 'Staff member with order entry and viewing access',
    },
  });

  console.log('✅ Roles seeded:', adminRole.name, managerRole.name, staffRole.name);

  // 2. Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@inventory.local' },
    update: {},
    create: {
      email: 'admin@inventory.local',
      fullName: 'System Administrator',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdFsTGprddBRQPeq', // placeholder hash for initial admin
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin user seeded:', adminUser.email);

  // 3. Categories
  const coffeeCat = await prisma.category.upsert({
    where: { name: 'Coffee Beans' },
    update: {},
    create: {
      name: 'Coffee Beans',
      description: 'Single origin and espresso blend roasted coffee beans',
    },
  });

  const dairyCat = await prisma.category.upsert({
    where: { name: 'Dairy & Alternatives' },
    update: {},
    create: {
      name: 'Dairy & Alternatives',
      description: 'Fresh dairy milk, oat milk, almond milk, and creamers',
    },
  });

  const bakeryCat = await prisma.category.upsert({
    where: { name: 'Pastries & Bakery' },
    update: {},
    create: {
      name: 'Pastries & Bakery',
      description: 'Fresh baked pastries, croissants, and treats',
    },
  });

  console.log('✅ Categories seeded');

  // 4. Suppliers
  const artisanSupplier = await prisma.supplier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Artisan Roasters Co.',
      contactEmail: 'orders@artisanroasters.local',
      phone: '+65 6123 4567',
      address: '12 Roastery Lane, Singapore',
    },
  });

  const greenValleySupplier = await prisma.supplier.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Green Valley Dairy Ltd.',
      contactEmail: 'supply@greenvalleydairy.local',
      phone: '+65 6789 0123',
      address: '8 Dairy Crescent, Singapore',
    },
  });

  console.log('✅ Suppliers seeded');

  // 5. Products & 1:1 Inventories
  const seedProducts = [
    {
      sku: 'COF-ETH-001',
      name: 'Ethiopian Yirgacheffe (1kg)',
      description: 'Light roast with floral notes of jasmine, bergamot, and peach.',
      price: 34.5,
      categoryId: coffeeCat.id,
      supplierId: artisanSupplier.id,
      stockQuantity: 25,
      minStockThreshold: 10,
    },
    {
      sku: 'COF-COL-002',
      name: 'Colombian Supremo (1kg)',
      description: 'Medium roast featuring rich caramel, hazelnut, and cocoa aroma.',
      price: 28.0,
      categoryId: coffeeCat.id,
      supplierId: artisanSupplier.id,
      stockQuantity: 4, // Intentionally low stock for testing alerts!
      minStockThreshold: 10,
    },
    {
      sku: 'DAI-OAT-001',
      name: 'Barista Edition Oat Milk (1L)',
      description: 'Premium oat milk formulated specifically for latte art microfoam.',
      price: 4.8,
      categoryId: dairyCat.id,
      supplierId: greenValleySupplier.id,
      stockQuantity: 48,
      minStockThreshold: 15,
    },
    {
      sku: 'BAK-CRO-001',
      name: 'French Butter Croissant',
      description: 'Flaky all-butter croissant baked fresh daily.',
      price: 3.5,
      categoryId: bakeryCat.id,
      supplierId: null,
      stockQuantity: 3, // Intentionally low stock for testing alerts!
      minStockThreshold: 8,
    },
  ];

  for (const item of seedProducts) {
    const product = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {},
      create: {
        sku: item.sku,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId,
        supplierId: item.supplierId,
      },
    });

    const inventory = await prisma.inventory.upsert({
      where: { productId: product.id },
      update: {
        stockQuantity: item.stockQuantity,
        minStockThreshold: item.minStockThreshold,
      },
      create: {
        productId: product.id,
        stockQuantity: item.stockQuantity,
        minStockThreshold: item.minStockThreshold,
      },
    });

    // Log initial StockMovement audit record if none exists
    const existingMovement = await prisma.stockMovement.findFirst({
      where: { inventoryId: inventory.id },
    });

    if (!existingMovement && item.stockQuantity > 0) {
      await prisma.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: MovementType.IN,
          quantity: item.stockQuantity,
          reason: 'Initial stock intake from inventory setup',
          userId: adminUser.id,
        },
      });
    }
  }

  console.log('✅ Products, Inventories, and Stock Movements seeded');
  console.log('🚀 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
