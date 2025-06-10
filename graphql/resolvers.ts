import { GraphQLResolveInfo } from "graphql";
import {
  PrismaClient,
  AssignmentStatus,
  DeliveryStatus,
  ReturnStatus,
  OrderStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  // Query Resolvers
  Query: {
    // Asset queries
    asset: async (_: any, { assetId }: { assetId: string }) => {
      return prisma.asset.findUnique({
        where: { assetId },
        include: {
          owner: true,
          assignments: true,
          shipments: true,
          maintenances: true,
          returnRequests: true,
        },
      });
    },

    assets: async (_: any, { filter, sort, limit, offset }: any) => {
      return prisma.asset.findMany({
        where: filter,
        orderBy: sort
          ? { [sort.field.toLowerCase()]: sort.order.toLowerCase() }
          : undefined,
        take: limit,
        skip: offset,
        include: {
          owner: true,
          assignments: true,
          shipments: true,
          maintenances: true,
          returnRequests: true,
        },
      });
    },

    // AssetHolder queries
    assetHolder: async (_: any, { holderId }: { holderId: string }) => {
      return prisma.assetHolder.findUnique({
        where: { holderId },
        include: {
          ownedAssets: true,
          assignments: true,
          shipments: true,
          returnRequests: true,
        },
      });
    },

    assetHolders: async (_: any, { filter, limit, offset }: any) => {
      return prisma.assetHolder.findMany({
        where: filter,
        take: limit,
        skip: offset,
        include: {
          ownedAssets: true,
          assignments: true,
          shipments: true,
          returnRequests: true,
        },
      });
    },

    // Assignment queries
    assignment: async (_: any, { assignmentId }: { assignmentId: string }) => {
      return prisma.assignment.findUnique({
        where: { assignmentId },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    assignments: async (_: any, { assetId, holderId, status }: any) => {
      return prisma.assignment.findMany({
        where: {
          ...(assetId && { assetId }),
          ...(holderId && { holderId }),
          ...(status && { status }),
        },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    // Maintenance queries
    maintenance: async (
      _: any,
      { maintenanceId }: { maintenanceId: string }
    ) => {
      return prisma.maintenance.findUnique({
        where: { maintenanceId },
        include: {
          asset: true,
        },
      });
    },

    maintenances: async (_: any, { assetId, dateFrom, dateTo }: any) => {
      return prisma.maintenance.findMany({
        where: {
          ...(assetId && { assetId }),
          ...(dateFrom &&
            dateTo && {
              maintenanceDate: {
                gte: dateFrom,
                lte: dateTo,
              },
            }),
        },
        include: {
          asset: true,
        },
      });
    },

    // Shipment queries
    shipment: async (_: any, { shipmentId }: { shipmentId: string }) => {
      return prisma.shipment.findUnique({
        where: { shipmentId },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    shipments: async (_: any, { assetId, holderId, status }: any) => {
      return prisma.shipment.findMany({
        where: {
          ...(assetId && { assetId }),
          ...(holderId && { holderId }),
          ...(status && { deliveryStatus: status }),
        },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    // Return Request queries
    returnRequest: async (_: any, { returnId }: { returnId: string }) => {
      return prisma.returnRequest.findUnique({
        where: { returnId },
        include: {
          holder: true,
          customer: true,
          asset: true,
          order: true,
        },
      });
    },

    returnRequests: async (_: any, { holderId, customerId, status }: any) => {
      return prisma.returnRequest.findMany({
        where: {
          ...(holderId && { holderId }),
          ...(customerId && { customerId }),
          ...(status && { returnStatus: status }),
        },
        include: {
          holder: true,
          customer: true,
          asset: true,
          order: true,
        },
      });
    },

    // Customer queries
    customer: async (_: any, { customerId }: { customerId: string }) => {
      return prisma.customer.findUnique({
        where: { customerId },
        include: {
          orders: true,
          returnRequests: true,
        },
      });
    },

    customers: async (_: any, { limit, offset }: any) => {
      return prisma.customer.findMany({
        take: limit,
        skip: offset,
        include: {
          orders: true,
          returnRequests: true,
        },
      });
    },

    // Product queries
    product: async (_: any, { productId }: { productId: string }) => {
      return prisma.product.findUnique({
        where: { productId },
        include: {
          orderItems: true,
        },
      });
    },

    products: async (_: any, { category, status, limit, offset }: any) => {
      return prisma.product.findMany({
        where: {
          ...(category && { category }),
          ...(status && { status }),
        },
        take: limit,
        skip: offset,
        include: {
          orderItems: true,
        },
      });
    },

    // Order queries
    order: async (_: any, { orderId }: { orderId: string }) => {
      return prisma.order.findUnique({
        where: { orderId },
        include: {
          customer: true,
          orderItems: true,
          returnRequests: true,
        },
      });
    },

    orders: async (_: any, { filter, limit, offset }: any) => {
      return prisma.order.findMany({
        where: {
          ...(filter?.customerId && { customerId: filter.customerId }),
          ...(filter?.orderStatus && { orderStatus: filter.orderStatus }),
          ...(filter?.dateFrom &&
            filter?.dateTo && {
              orderDate: {
                gte: filter.dateFrom,
                lte: filter.dateTo,
              },
            }),
        },
        take: limit,
        skip: offset,
        include: {
          customer: true,
          orderItems: true,
          returnRequests: true,
        },
      });
    },
  },

  // Mutation Resolvers
  Mutation: {
    // Asset mutations
    createAsset: async (_: any, { input }: { input: any }) => {
      return prisma.asset.create({
        data: input,
        include: {
          owner: true,
          assignments: true,
          shipments: true,
          maintenances: true,
          returnRequests: true,
        },
      });
    },

    updateAsset: async (
      _: any,
      { assetId, input }: { assetId: string; input: any }
    ) => {
      return prisma.asset.update({
        where: { assetId },
        data: input,
        include: {
          owner: true,
          assignments: true,
          shipments: true,
          maintenances: true,
          returnRequests: true,
        },
      });
    },

    deleteAsset: async (_: any, { assetId }: { assetId: string }) => {
      await prisma.asset.delete({
        where: { assetId },
      });
      return true;
    },

    // AssetHolder mutations
    createAssetHolder: async (_: any, { input }: { input: any }) => {
      return prisma.assetHolder.create({
        data: input,
        include: {
          ownedAssets: true,
          assignments: true,
          shipments: true,
          returnRequests: true,
        },
      });
    },

    updateAssetHolder: async (
      _: any,
      { holderId, input }: { holderId: string; input: any }
    ) => {
      return prisma.assetHolder.update({
        where: { holderId },
        data: input,
        include: {
          ownedAssets: true,
          assignments: true,
          shipments: true,
          returnRequests: true,
        },
      });
    },

    deleteAssetHolder: async (_: any, { holderId }: { holderId: string }) => {
      await prisma.assetHolder.delete({
        where: { holderId },
      });
      return true;
    },

    // Assignment mutations
    createAssignment: async (_: any, { input }: { input: any }) => {
      return prisma.assignment.create({
        data: input,
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    updateAssignmentStatus: async (
      _: any,
      {
        assignmentId,
        status,
      }: { assignmentId: string; status: AssignmentStatus }
    ) => {
      return prisma.assignment.update({
        where: { assignmentId },
        data: { status: status as AssignmentStatus },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    acknowledgeAssignment: async (
      _: any,
      { assignmentId }: { assignmentId: string }
    ) => {
      return prisma.assignment.update({
        where: { assignmentId },
        data: { acknowledgment: true },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    // Maintenance mutations
    createMaintenance: async (_: any, { input }: { input: any }) => {
      return prisma.maintenance.create({
        data: input,
        include: {
          asset: true,
        },
      });
    },

    updateMaintenanceResolution: async (
      _: any,
      {
        maintenanceId,
        resolution,
      }: { maintenanceId: string; resolution: string }
    ) => {
      return prisma.maintenance.update({
        where: { maintenanceId },
        data: { resolution },
        include: {
          asset: true,
        },
      });
    },

    // Shipment mutations
    createShipment: async (_: any, { input }: { input: any }) => {
      return prisma.shipment.create({
        data: input,
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    updateShipmentStatus: async (
      _: any,
      { shipmentId, status }: { shipmentId: string; status: DeliveryStatus }
    ) => {
      return prisma.shipment.update({
        where: { shipmentId },
        data: { deliveryStatus: status as DeliveryStatus },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    updateTrackingNumber: async (
      _: any,
      {
        shipmentId,
        trackingNumber,
      }: { shipmentId: string; trackingNumber: string }
    ) => {
      return prisma.shipment.update({
        where: { shipmentId },
        data: { trackingNumber },
        include: {
          asset: true,
          holder: true,
        },
      });
    },

    // Return Request mutations
    createReturnRequest: async (_: any, { input }: { input: any }) => {
      return prisma.returnRequest.create({
        data: input,
        include: {
          holder: true,
          customer: true,
          asset: true,
          order: true,
        },
      });
    },

    updateReturnRequestStatus: async (
      _: any,
      { returnId, status }: { returnId: string; status: ReturnStatus }
    ) => {
      return prisma.returnRequest.update({
        where: { returnId },
        data: { returnStatus: status as ReturnStatus },
        include: {
          holder: true,
          customer: true,
          asset: true,
          order: true,
        },
      });
    },

    generatePrepaidLabel: async (
      _: any,
      { returnId }: { returnId: string }
    ) => {
      return prisma.returnRequest.update({
        where: { returnId },
        data: { prepaidLabelGenerated: true },
        include: {
          holder: true,
          customer: true,
          asset: true,
          order: true,
        },
      });
    },

    // Customer mutations
    createCustomer: async (_: any, { input }: { input: any }) => {
      return prisma.customer.create({
        data: input,
        include: {
          orders: true,
          returnRequests: true,
        },
      });
    },

    updateCustomer: async (
      _: any,
      { customerId, input }: { customerId: string; input: any }
    ) => {
      return prisma.customer.update({
        where: { customerId },
        data: input,
        include: {
          orders: true,
          returnRequests: true,
        },
      });
    },

    deleteCustomer: async (_: any, { customerId }: { customerId: string }) => {
      await prisma.customer.delete({
        where: { customerId },
      });
      return true;
    },

    // Product mutations
    createProduct: async (_: any, { input }: { input: any }) => {
      return prisma.product.create({
        data: input,
        include: {
          orderItems: true,
        },
      });
    },

    updateProduct: async (
      _: any,
      { productId, input }: { productId: string; input: any }
    ) => {
      return prisma.product.update({
        where: { productId },
        data: input,
        include: {
          orderItems: true,
        },
      });
    },

    updateProductStock: async (
      _: any,
      { productId, quantity }: { productId: string; quantity: number }
    ) => {
      return prisma.product.update({
        where: { productId },
        data: { stockQuantity: quantity },
        include: {
          orderItems: true,
        },
      });
    },

    deleteProduct: async (_: any, { productId }: { productId: string }) => {
      await prisma.product.delete({
        where: { productId },
      });
      return true;
    },

    // Order mutations
    createOrder: async (_: any, { input }: { input: any }) => {
      const { orderItems, ...orderData } = input;
      return prisma.order.create({
        data: {
          ...orderData,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          customer: true,
          orderItems: true,
          returnRequests: true,
        },
      });
    },

    updateOrderStatus: async (
      _: any,
      { orderId, status }: { orderId: string; status: OrderStatus }
    ) => {
      return prisma.order.update({
        where: { orderId },
        data: { orderStatus: status as OrderStatus },
        include: {
          customer: true,
          orderItems: true,
          returnRequests: true,
        },
      });
    },

    cancelOrder: async (_: any, { orderId }: { orderId: string }) => {
      return prisma.order.update({
        where: { orderId },
        data: { orderStatus: "CANCELLED" },
        include: {
          customer: true,
          orderItems: true,
          returnRequests: true,
        },
      });
    },
  },

  // Subscription Resolvers
  Subscription: {
    assetStatusChanged: {
      subscribe: (_: any, { assetId }: { assetId?: string }) => {
        // Implement pubsub logic here
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      },
    },
    shipmentStatusChanged: {
      subscribe: (_: any, { shipmentId }: { shipmentId?: string }) => {
        // Implement pubsub logic here
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      },
    },
    orderStatusChanged: {
      subscribe: (_: any, { orderId }: { orderId?: string }) => {
        // Implement pubsub logic here
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      },
    },
    returnRequestStatusChanged: {
      subscribe: (_: any, { returnId }: { returnId?: string }) => {
        // Implement pubsub logic here
        return {
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      },
    },
  },
};

export default resolvers;
