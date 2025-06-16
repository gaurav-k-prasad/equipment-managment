import {
  PrismaClient,
  AssetStatus,
  HolderRole,
  AssignmentStatus,
  DeliveryStatus,
  ReturnStatus,
  OrderStatus,
  ProductStatus,
} from "@prisma/client";
import { withErrorHandling, GraphQLError } from "./utils";

const prisma = new PrismaClient();

interface AssetFilter {
  type?: string;
  status?: AssetStatus;
  location?: string;
  ownerHolderId?: string;
}

interface AssetSort {
  field: string;
  order: string;
}

interface AssetHolderFilter {
  department?: string;
  role?: HolderRole;
  location?: string;
}

interface OrderFilter {
  customerId?: string;
  orderStatus?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

type ResolverFn<TArgs, TResult> = (_: unknown, args: TArgs) => Promise<TResult>;

const resolvers = {
  // Query Resolvers
  Query: {
    // Asset queries
    asset: withErrorHandling<{ assetId: string }, any>(
      async (_, { assetId }) => {
        const asset = await prisma.asset.findUnique({
          where: { assetId },
          include: {
            owner: true,
            assignments: true,
            shipments: true,
            maintenances: true,
            returnRequests: true,
          },
        });

        if (!asset) {
          throw new GraphQLError("Asset not found", "NOT_FOUND", 404);
        }

        return asset;
      }
    ),

    assets: withErrorHandling<
      {
        filter?: AssetFilter;
        sort?: AssetSort;
        limit?: number;
        offset?: number;
      },
      any[]
    >(async (_, { filter, sort, limit, offset }) => {
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
    }),

    // AssetHolder queries
    assetHolder: withErrorHandling<{ holderId: string }, any>(
      async (_, { holderId }) => {
        const holder = await prisma.assetHolder.findUnique({
          where: { holderId },
          include: {
            ownedAssets: true,
            assignments: true,
            shipments: true,
            returnRequests: true,
          },
        });

        if (!holder) {
          throw new GraphQLError("Asset holder not found", "NOT_FOUND", 404);
        }

        return holder;
      }
    ),

    assetHolders: withErrorHandling<
      {
        filter?: AssetHolderFilter;
        limit?: number;
        offset?: number;
      },
      any[]
    >(async (_, { filter, limit, offset }) => {
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
    }),

    // Assignment queries
    assignment: withErrorHandling<{ assignmentId: string }, any>(
      async (_, { assignmentId }) => {
        const assignment = await prisma.assignment.findUnique({
          where: { assignmentId },
          include: {
            asset: true,
            holder: true,
          },
        });

        if (!assignment) {
          throw new GraphQLError("Assignment not found", "NOT_FOUND", 404);
        }

        return assignment;
      }
    ),

    assignments: withErrorHandling<
      {
        assetId?: string;
        holderId?: string;
        status?: AssignmentStatus;
      },
      any[]
    >(async (_, { assetId, holderId, status }) => {
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
    }),

    // Maintenance queries
    maintenance: withErrorHandling<{ maintenanceId: string }, any>(
      async (_, { maintenanceId }) => {
        const maintenance = await prisma.maintenance.findUnique({
          where: { maintenanceId },
          include: {
            asset: true,
          },
        });

        if (!maintenance) {
          throw new GraphQLError(
            "Maintenance record not found",
            "NOT_FOUND",
            404
          );
        }

        return maintenance;
      }
    ),

    maintenances: withErrorHandling<
      {
        assetId?: string;
        dateFrom?: Date;
        dateTo?: Date;
      },
      any[]
    >(async (_, { assetId, dateFrom, dateTo }) => {
      return prisma.maintenance.findMany({
        where: {
          ...(assetId && { assetId }),
          ...(dateFrom && { date: { gte: dateFrom } }),
          ...(dateTo && { date: { lte: dateTo } }),
        },
        include: {
          asset: true,
        },
      });
    }),

    // Shipment queries
    shipment: withErrorHandling<{ shipmentId: string }, any>(
      async (_, { shipmentId }) => {
        const shipment = await prisma.shipment.findUnique({
          where: { shipmentId },
          include: {
            asset: true,
            holder: true,
          },
        });

        if (!shipment) {
          throw new GraphQLError("Shipment not found", "NOT_FOUND", 404);
        }

        return shipment;
      }
    ),

    shipments: withErrorHandling<
      {
        assetId?: string;
        holderId?: string;
        status?: DeliveryStatus;
      },
      any[]
    >(async (_, { assetId, holderId, status }) => {
      return prisma.shipment.findMany({
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
    }),

    // Return Request queries
    returnRequest: withErrorHandling<{ returnId: string }, any>(
      async (_, { returnId }) => {
        const returnRequest = await prisma.returnRequest.findUnique({
          where: { returnId },
          include: {
            asset: true,
            holder: true,
          },
        });

        if (!returnRequest) {
          throw new GraphQLError("Return request not found", "NOT_FOUND", 404);
        }

        return returnRequest;
      }
    ),

    returnRequests: withErrorHandling<
      {
        assetId?: string;
        holderId?: string;
        status?: ReturnStatus;
      },
      any[]
    >(async (_, { assetId, holderId, status }) => {
      return prisma.returnRequest.findMany({
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
    }),

    // Customer queries
    customer: withErrorHandling(
      async (_: unknown, { customerId }: { customerId: string }) => {
        const customer = await prisma.customer.findUnique({
          where: { customerId },
          include: {
            orders: true,
            returnRequests: true,
          },
        });

        if (!customer) {
          throw new GraphQLError("Customer not found", "NOT_FOUND", 404);
        }

        return customer;
      }
    ),

    customers: withErrorHandling(
      async (
        _: unknown,
        { limit, offset }: { limit?: number; offset?: number }
      ) => {
        return prisma.customer.findMany({
          take: limit,
          skip: offset,
          include: {
            orders: true,
            returnRequests: true,
          },
        });
      }
    ),

    // Product queries
    product: withErrorHandling<{ productId: string }, any>(
      async (_, { productId }) => {
        const product = await prisma.product.findUnique({
          where: { productId },
          include: {
            orderItems: true,
          },
        });

        if (!product) {
          throw new GraphQLError("Product not found", "NOT_FOUND", 404);
        }

        return product;
      }
    ),

    products: withErrorHandling<
      {
        category?: string;
        status?: ProductStatus;
        limit?: number;
        offset?: number;
      },
      any[]
    >(async (_, { category, status, limit, offset }) => {
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
    }),

    // Order queries
    order: withErrorHandling<{ orderId: string }, any>(
      async (_, { orderId }) => {
        const order = await prisma.order.findUnique({
          where: { orderId },
          include: {
            customer: true,
            orderItems: true,
            returnRequests: true,
          },
        });

        if (!order) {
          throw new GraphQLError("Order not found", "NOT_FOUND", 404);
        }

        return order;
      }
    ),

    orders: withErrorHandling<
      {
        filter?: OrderFilter;
        limit?: number;
        offset?: number;
      },
      any[]
    >(async (_, { filter, limit, offset }) => {
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
    }),
  },

  // Mutation Resolvers
  Mutation: {
    // Asset mutations
    createAsset: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
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
      }
    ),

    updateAsset: withErrorHandling(
      async (
        _: unknown,
        { assetId, input }: { assetId: string; input: any }
      ) => {
        const asset = await prisma.asset.findUnique({
          where: { assetId },
        });

        if (!asset) {
          throw new GraphQLError("Asset not found", "NOT_FOUND", 404);
        }

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
      }
    ),

    deleteAsset: withErrorHandling(
      async (_: unknown, { assetId }: { assetId: string }) => {
        const asset = await prisma.asset.findUnique({
          where: { assetId },
        });

        if (!asset) {
          throw new GraphQLError("Asset not found", "NOT_FOUND", 404);
        }

        await prisma.asset.delete({
          where: { assetId },
        });
        return true;
      }
    ),

    // AssetHolder mutations
    createAssetHolder: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.assetHolder.create({
          data: input,
          include: {
            ownedAssets: true,
            assignments: true,
            shipments: true,
            returnRequests: true,
          },
        });
      }
    ),

    updateAssetHolder: withErrorHandling(
      async (
        _: unknown,
        { holderId, input }: { holderId: string; input: any }
      ) => {
        const holder = await prisma.assetHolder.findUnique({
          where: { holderId },
        });

        if (!holder) {
          throw new GraphQLError("Asset holder not found", "NOT_FOUND", 404);
        }

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
      }
    ),

    deleteAssetHolder: withErrorHandling(
      async (_: unknown, { holderId }: { holderId: string }) => {
        const holder = await prisma.assetHolder.findUnique({
          where: { holderId },
        });

        if (!holder) {
          throw new GraphQLError("Asset holder not found", "NOT_FOUND", 404);
        }

        await prisma.assetHolder.delete({
          where: { holderId },
        });
        return true;
      }
    ),

    // Assignment mutations
    createAssignment: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.assignment.create({
          data: input,
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    updateAssignmentStatus: withErrorHandling(
      async (
        _: unknown,
        {
          assignmentId,
          status,
        }: { assignmentId: string; status: AssignmentStatus }
      ) => {
        return prisma.assignment.update({
          where: { assignmentId },
          data: { status },
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    acknowledgeAssignment: withErrorHandling(
      async (_: unknown, { assignmentId }: { assignmentId: string }) => {
        const assignment = await prisma.assignment.findUnique({
          where: { assignmentId },
        });

        if (!assignment) {
          throw new GraphQLError("Assignment not found", "NOT_FOUND", 404);
        }

        return prisma.assignment.update({
          where: { assignmentId },
          data: { acknowledgment: true },
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    // Maintenance mutations
    createMaintenance: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.maintenance.create({
          data: input,
          include: {
            asset: true,
          },
        });
      }
    ),

    updateMaintenanceResolution: withErrorHandling(
      async (
        _: unknown,
        {
          maintenanceId,
          resolution,
        }: { maintenanceId: string; resolution: string }
      ) => {
        const maintenance = await prisma.maintenance.findUnique({
          where: { maintenanceId },
        });

        if (!maintenance) {
          throw new GraphQLError(
            "Maintenance record not found",
            "NOT_FOUND",
            404
          );
        }

        return prisma.maintenance.update({
          where: { maintenanceId },
          data: { resolution },
          include: {
            asset: true,
          },
        });
      }
    ),

    // Shipment mutations
    createShipment: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.shipment.create({
          data: input,
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    updateShipmentStatus: withErrorHandling(
      async (
        _: unknown,
        { shipmentId, status }: { shipmentId: string; status: DeliveryStatus }
      ) => {
        return prisma.shipment.update({
          where: { shipmentId },
          data: { deliveryStatus: status },
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    updateTrackingNumber: withErrorHandling(
      async (
        _: unknown,
        {
          shipmentId,
          trackingNumber,
        }: { shipmentId: string; trackingNumber: string }
      ) => {
        const shipment = await prisma.shipment.findUnique({
          where: { shipmentId },
        });

        if (!shipment) {
          throw new GraphQLError("Shipment not found", "NOT_FOUND", 404);
        }

        return prisma.shipment.update({
          where: { shipmentId },
          data: { trackingNumber },
          include: {
            asset: true,
            holder: true,
          },
        });
      }
    ),

    // Return Request mutations
    createReturnRequest: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.returnRequest.create({
          data: input,
          include: {
            holder: true,
            customer: true,
            asset: true,
            order: true,
          },
        });
      }
    ),

    updateReturnRequestStatus: withErrorHandling(
      async (
        _: unknown,
        { returnId, status }: { returnId: string; status: ReturnStatus }
      ) => {
        return prisma.returnRequest.update({
          where: { returnId },
          data: { returnStatus: status },
          include: {
            holder: true,
            customer: true,
            asset: true,
            order: true,
          },
        });
      }
    ),

    generatePrepaidLabel: withErrorHandling(
      async (_: unknown, { returnId }: { returnId: string }) => {
        const returnRequest = await prisma.returnRequest.findUnique({
          where: { returnId },
        });

        if (!returnRequest) {
          throw new GraphQLError("Return request not found", "NOT_FOUND", 404);
        }

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
      }
    ),

    // Customer mutations
    createCustomer: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.customer.create({
          data: input,
          include: {
            orders: true,
            returnRequests: true,
          },
        });
      }
    ),

    updateCustomer: withErrorHandling(
      async (
        _: unknown,
        { customerId, input }: { customerId: string; input: any }
      ) => {
        const customer = await prisma.customer.findUnique({
          where: { customerId },
        });

        if (!customer) {
          throw new GraphQLError("Customer not found", "NOT_FOUND", 404);
        }

        return prisma.customer.update({
          where: { customerId },
          data: input,
          include: {
            orders: true,
            returnRequests: true,
          },
        });
      }
    ),

    deleteCustomer: withErrorHandling(
      async (_: unknown, { customerId }: { customerId: string }) => {
        const customer = await prisma.customer.findUnique({
          where: { customerId },
        });

        if (!customer) {
          throw new GraphQLError("Customer not found", "NOT_FOUND", 404);
        }

        await prisma.customer.delete({
          where: { customerId },
        });
        return true;
      }
    ),

    // Product mutations
    createProduct: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
        return prisma.product.create({
          data: input,
          include: {
            orderItems: true,
          },
        });
      }
    ),

    updateProduct: withErrorHandling(
      async (
        _: unknown,
        { productId, input }: { productId: string; input: any }
      ) => {
        const product = await prisma.product.findUnique({
          where: { productId },
        });

        if (!product) {
          throw new GraphQLError("Product not found", "NOT_FOUND", 404);
        }

        return prisma.product.update({
          where: { productId },
          data: input,
          include: {
            orderItems: true,
          },
        });
      }
    ),

    updateProductStock: withErrorHandling(
      async (
        _: unknown,
        { productId, quantity }: { productId: string; quantity: number }
      ) => {
        const product = await prisma.product.findUnique({
          where: { productId },
        });

        if (!product) {
          throw new GraphQLError("Product not found", "NOT_FOUND", 404);
        }

        return prisma.product.update({
          where: { productId },
          data: { stockQuantity: quantity },
          include: {
            orderItems: true,
          },
        });
      }
    ),

    deleteProduct: withErrorHandling(
      async (_: unknown, { productId }: { productId: string }) => {
        const product = await prisma.product.findUnique({
          where: { productId },
        });

        if (!product) {
          throw new GraphQLError("Product not found", "NOT_FOUND", 404);
        }

        await prisma.product.delete({
          where: { productId },
        });
        return true;
      }
    ),

    // Order mutations
    createOrder: withErrorHandling(
      async (_: unknown, { input }: { input: any }) => {
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
      }
    ),

    updateOrderStatus: withErrorHandling(
      async (
        _: unknown,
        { orderId, status }: { orderId: string; status: OrderStatus }
      ) => {
        return prisma.order.update({
          where: { orderId },
          data: { orderStatus: status },
          include: {
            customer: true,
            orderItems: true,
            returnRequests: true,
          },
        });
      }
    ),

    cancelOrder: withErrorHandling(
      async (_: unknown, { orderId }: { orderId: string }) => {
        const order = await prisma.order.findUnique({
          where: { orderId },
        });

        if (!order) {
          throw new GraphQLError("Order not found", "NOT_FOUND", 404);
        }

        return prisma.order.update({
          where: { orderId },
          data: { orderStatus: OrderStatus.CANCELLED },
          include: {
            customer: true,
            orderItems: true,
            returnRequests: true,
          },
        });
      }
    ),
  },

  // Subscription Resolvers
  Subscription: {
    assetStatusChanged: {
      subscribe: withErrorHandling(
        async (_: unknown, { assetId }: { assetId?: string }) => {
          // Implement pubsub logic here
          return {
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      ),
    },
    shipmentStatusChanged: {
      subscribe: withErrorHandling(
        async (_: unknown, { shipmentId }: { shipmentId?: string }) => {
          // Implement pubsub logic here
          return {
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      ),
    },
    orderStatusChanged: {
      subscribe: withErrorHandling(
        async (_: unknown, { orderId }: { orderId?: string }) => {
          // Implement pubsub logic here
          return {
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      ),
    },
    returnRequestStatusChanged: {
      subscribe: withErrorHandling(
        async (_: unknown, { returnId }: { returnId?: string }) => {
          // Implement pubsub logic here
          return {
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      ),
    },
  },
};

export default resolvers;
