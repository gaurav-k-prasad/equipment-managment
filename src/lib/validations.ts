import { z } from "zod";

// Enums
export const AssetStatusSchema = z.enum([
  "ASSIGNED",
  "IN_MAINTENANCE",
  "AVAILABLE",
  "RETIRED",
  "LOST",
]);
export const HolderRoleSchema = z.enum([
  "EMPLOYEE",
  "MANAGER",
  "ADMIN",
  "DEPARTMENT",
]);
export const DeliveryStatusSchema = z.enum([
  "PENDING",
  "IN_TRANSIT",
  "DELIVERED",
  "FAILED",
  "RETURNED",
]);
export const AssignmentStatusSchema = z.enum(["ACTIVE", "RETURNED", "EXPIRED"]);
export const ReturnStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);
export const IntegrationStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ERROR"]);
export const ProductStatusSchema = z.enum([
  "AVAILABLE",
  "OUT_OF_STOCK",
  "DISCONTINUED",
]);
export const OrderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
]);

// Asset Schema
export const AssetSchema = z.object({
  assetId: z.string().cuid().optional(),
  type: z.string().min(1, "Asset type is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  barcode: z.string().optional().nullable(),
  status: AssetStatusSchema.default("AVAILABLE"),
  location: z.string().min(1, "Location is required"),
  purchaseDate: z.date(),
  warrantyExpiry: z.date().optional().nullable(),
  ownerHolderId: z.string().cuid().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateAssetSchema = AssetSchema.omit({
  assetId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAssetSchema = AssetSchema.partial().omit({
  assetId: true,
  createdAt: true,
});

// AssetHolder Schema
export const AssetHolderSchema = z.object({
  holderId: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  email: z.string().email("Invalid email format"),
  location: z.string().min(1, "Location is required"),
  role: HolderRoleSchema.default("EMPLOYEE"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateAssetHolderSchema = AssetHolderSchema.omit({
  holderId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAssetHolderSchema = AssetHolderSchema.partial().omit({
  holderId: true,
  createdAt: true,
});

// Shipment Schema
export const ShipmentSchema = z.object({
  shipmentId: z.string().cuid().optional(),
  assetId: z.string().cuid("Invalid asset ID"),
  holderId: z.string().cuid("Invalid holder ID"),
  shipmentDate: z.date(),
  deliveryStatus: DeliveryStatusSchema.default("IN_TRANSIT"),
  carrier: z.string().min(1, "Carrier is required"),
  trackingNumber: z.string().optional().nullable(),
  courierApiResponse: z.any().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateShipmentSchema = ShipmentSchema.omit({
  shipmentId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateShipmentSchema = ShipmentSchema.partial().omit({
  shipmentId: true,
  createdAt: true,
});

// Assignment Schema
export const AssignmentSchema = z.object({
  assignmentId: z.string().cuid().optional(),
  assetId: z.string().cuid("Invalid asset ID"),
  holderId: z.string().cuid("Invalid holder ID"),
  assignedDate: z.date(),
  returnDate: z.date().optional().nullable(),
  status: AssignmentStatusSchema.default("ACTIVE"),
  acknowledgment: z.boolean().default(false),
  chainOfCustodyDoc: z.string().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateAssignmentSchema = AssignmentSchema.omit({
  assignmentId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAssignmentSchema = AssignmentSchema.partial().omit({
  assignmentId: true,
  createdAt: true,
});

// Maintenance Schema
export const MaintenanceSchema = z.object({
  maintenanceId: z.string().cuid().optional(),
  assetId: z.string().cuid("Invalid asset ID"),
  maintenanceDate: z.date(),
  issueReported: z.string().min(1, "Issue description is required"),
  resolution: z.string().optional().nullable(),
  warrantyCovered: z.boolean().default(false),
  reminderScheduled: z.date().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateMaintenanceSchema = MaintenanceSchema.omit({
  maintenanceId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateMaintenanceSchema = MaintenanceSchema.partial().omit({
  maintenanceId: true,
  createdAt: true,
});

// ReturnRequest Schema
export const ReturnRequestSchema = z.object({
  returnId: z.string().cuid().optional(),
  holderId: z.string().cuid().optional().nullable(),
  customerId: z.string().cuid().optional().nullable(),
  assetId: z.string().cuid().optional().nullable(),
  orderId: z.string().cuid().optional().nullable(),
  requestDate: z.date(),
  returnStatus: ReturnStatusSchema.default("PENDING"),
  prepaidLabelGenerated: z.boolean().default(false),
  finalStatusConfirmed: z.boolean().default(false),
  reason: z.string().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateReturnRequestSchema = ReturnRequestSchema.omit({
  returnId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateReturnRequestSchema = ReturnRequestSchema.partial().omit({
  returnId: true,
  createdAt: true,
});

// AnalyticsReport Schema
export const AnalyticsReportSchema = z.object({
  reportId: z.string().cuid().optional(),
  generatedDate: z.date(),
  reportType: z.string().min(1, "Report type is required"),
  details: z.any(),
  lostOrDamagedAssets: z.any().optional().nullable(),
  complianceFlag: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
});

export const CreateAnalyticsReportSchema = AnalyticsReportSchema.omit({
  reportId: true,
  createdAt: true,
});

export const UpdateAnalyticsReportSchema = AnalyticsReportSchema.partial().omit(
  {
    reportId: true,
    createdAt: true,
  }
);

// ApiIntegration Schema
export const ApiIntegrationSchema = z.object({
  integrationId: z.string().cuid().optional(),
  systemName: z.string().min(1, "System name is required"),
  apiType: z.string().min(1, "API type is required"),
  endpointUrl: z.string().url("Invalid endpoint URL"),
  status: IntegrationStatusSchema.default("ACTIVE"),
  lastSyncTime: z.date().optional().nullable(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateApiIntegrationSchema = ApiIntegrationSchema.omit({
  integrationId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateApiIntegrationSchema = ApiIntegrationSchema.partial().omit({
  integrationId: true,
  createdAt: true,
});

// Customer Schema
export const CustomerSchema = z.object({
  customerId: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  address: z.string().min(1, "Address is required"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  customerId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateCustomerSchema = CustomerSchema.partial().omit({
  customerId: true,
  createdAt: true,
});

// Product Schema
export const ProductSchema = z.object({
  productId: z.string().cuid().optional(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  status: ProductStatusSchema.default("AVAILABLE"),
  stockQuantity: z
    .number()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  productId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = ProductSchema.partial().omit({
  productId: true,
  createdAt: true,
});

// Order Schema
export const OrderSchema = z.object({
  orderId: z.string().cuid().optional(),
  customerId: z.string().cuid("Invalid customer ID"),
  orderDate: z.date(),
  orderStatus: OrderStatusSchema.default("PENDING"),
  totalAmount: z.number().positive("Total amount must be positive"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

export const CreateOrderSchema = OrderSchema.omit({
  orderId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateOrderSchema = OrderSchema.partial().omit({
  orderId: true,
  createdAt: true,
});

// OrderItem Schema
export const OrderItemSchema = z.object({
  orderItemId: z.string().cuid().optional(),
  orderId: z.string().cuid("Invalid order ID"),
  productId: z.string().cuid("Invalid product ID"),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  createdAt: z.date().default(() => new Date()),
});

export const CreateOrderItemSchema = OrderItemSchema.omit({
  orderItemId: true,
  createdAt: true,
});

export const UpdateOrderItemSchema = OrderItemSchema.partial().omit({
  orderItemId: true,
  createdAt: true,
});

// Type exports for TypeScript inference
export type Asset = z.infer<typeof AssetSchema>;
export type CreateAsset = z.infer<typeof CreateAssetSchema>;
export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;

export type AssetHolder = z.infer<typeof AssetHolderSchema>;
export type CreateAssetHolder = z.infer<typeof CreateAssetHolderSchema>;
export type UpdateAssetHolder = z.infer<typeof UpdateAssetHolderSchema>;

export type Shipment = z.infer<typeof ShipmentSchema>;
export type CreateShipment = z.infer<typeof CreateShipmentSchema>;
export type UpdateShipment = z.infer<typeof UpdateShipmentSchema>;

export type Assignment = z.infer<typeof AssignmentSchema>;
export type CreateAssignment = z.infer<typeof CreateAssignmentSchema>;
export type UpdateAssignment = z.infer<typeof UpdateAssignmentSchema>;

export type Maintenance = z.infer<typeof MaintenanceSchema>;
export type CreateMaintenance = z.infer<typeof CreateMaintenanceSchema>;
export type UpdateMaintenance = z.infer<typeof UpdateMaintenanceSchema>;

export type ReturnRequest = z.infer<typeof ReturnRequestSchema>;
export type CreateReturnRequest = z.infer<typeof CreateReturnRequestSchema>;
export type UpdateReturnRequest = z.infer<typeof UpdateReturnRequestSchema>;

export type AnalyticsReport = z.infer<typeof AnalyticsReportSchema>;
export type CreateAnalyticsReport = z.infer<typeof CreateAnalyticsReportSchema>;
export type UpdateAnalyticsReport = z.infer<typeof UpdateAnalyticsReportSchema>;

export type ApiIntegration = z.infer<typeof ApiIntegrationSchema>;
export type CreateApiIntegration = z.infer<typeof CreateApiIntegrationSchema>;
export type UpdateApiIntegration = z.infer<typeof UpdateApiIntegrationSchema>;

export type Customer = z.infer<typeof CustomerSchema>;
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>;

export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof UpdateOrderItemSchema>;

// Utility function for validation with better error handling
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(
    (issue: z.ZodIssue) => `${issue.path.join(".")}: ${issue.message}`
  );

  return { success: false, errors };
}
