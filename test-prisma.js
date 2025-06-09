// test-prisma.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPrismaSchema() {
  try {
    console.log('🔍 Testing Prisma Schema...\n');

    // Test 1: Create an AssetHolder
    console.log('1. Creating an AssetHolder...');
    const assetHolder = await prisma.assetHolder.create({
      data: {
        name: 'John Doe',
        department: 'IT',
        email: 'john.doe@company.com',
        location: 'Building A, Floor 2',
        role: 'EMPLOYEE'
      }
    });
    console.log('✅ AssetHolder created:', assetHolder.name);

    // Test 2: Create an Asset
    console.log('\n2. Creating an Asset...');
    const asset = await prisma.asset.create({
      data: {
        type: 'Laptop',
        model: 'MacBook Pro M3',
        serialNumber: 'MBP2024001',
        barcode: 'BAR123456789',
        status: 'AVAILABLE',
        location: 'IT Storage Room',
        purchaseDate: new Date('2024-01-15'),
        warrantyExpiry: new Date('2027-01-15'),
        ownerHolderId: assetHolder.holderId
      }
    });
    console.log('✅ Asset created:', asset.model);

    // Test 3: Create an Assignment
    console.log('\n3. Creating an Assignment...');
    const assignment = await prisma.assignment.create({
      data: {
        assetId: asset.assetId,
        holderId: assetHolder.holderId,
        assignedDate: new Date(),
        status: 'ACTIVE',
        acknowledgment: true
      }
    });
    console.log('✅ Assignment created:', assignment.assignmentId);

    // Test 4: Create a Customer and Order
    console.log('\n4. Creating a Customer...');
    const customer = await prisma.customer.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        phone: '+1234567890',
        address: '123 Main St, City, State 12345'
      }
    });
    console.log('✅ Customer created:', customer.name);

    console.log('\n5. Creating a Product...');
    const product = await prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with USB receiver',
        category: 'Accessories',
        price: 29.99,
        status: 'AVAILABLE',
        stockQuantity: 50
      }
    });
    console.log('✅ Product created:', product.name);

    console.log('\n6. Creating an Order...');
    const order = await prisma.order.create({
      data: {
        customerId: customer.customerId,
        orderDate: new Date(),
        orderStatus: 'PENDING',
        totalAmount: 59.98,
        orderItems: {
          create: [
            {
              productId: product.productId,
              quantity: 2,
              price: 29.99
            }
          ]
        }
      },
      include: {
        orderItems: true
      }
    });
    console.log('✅ Order created with items:', order.orderItems.length);

    // Test 5: Query with relations
    console.log('\n7. Testing complex queries...');
    const assetWithRelations = await prisma.asset.findUnique({
      where: { assetId: asset.assetId },
      include: {
        owner: true,
        assignments: {
          include: {
            holder: true
          }
        }
      }
    });
    console.log('✅ Asset with relations:', {
      asset: assetWithRelations.model,
      owner: assetWithRelations.owner?.name,
      assignments: assetWithRelations.assignments.length
    });

    // Test 6: Test enums
    console.log('\n8. Testing enum values...');
    const assetsCount = await prisma.asset.count({
      where: {
        status: 'AVAILABLE'
      }
    });
    console.log('✅ Available assets count:', assetsCount);

    console.log('\n🎉 All Prisma tests passed successfully!');

  } catch (error) {
    console.error('❌ Error testing Prisma schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testPrismaSchema();