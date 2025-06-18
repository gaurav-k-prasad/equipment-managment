// Core entity hooks
export { useAssets } from "./useAssets";
export { useAssetHolders } from "./useAssetHolders";
export { useAssignments } from "./useAssignments";
export { useMaintenance } from "./useMaintenance";
export { useShipments } from "./useShipments";
export { useReturnRequests } from "./useReturnRequests";

// Business entity hooks
export { useCustomers } from "./useCustomers";
export { useProducts } from "./useProducts";
export { useOrders } from "./useOrders";

// Analytics and integration hooks
export { useAnalytics } from "./useAnalytics";
export { useApiIntegrations } from "./useApiIntegrations";

// Re-export types for convenience
export type {
  Asset,
  AssetFilter,
  AssetSort,
  UseAssetsReturn,
} from "./useAssets";

export type {
  AssetHolder,
  AssetHolderFilter,
  UseAssetHoldersReturn,
} from "./useAssetHolders";

export type { Assignment, UseAssignmentsReturn } from "./useAssignments";

export type { Maintenance, UseMaintenanceReturn } from "./useMaintenance";

export type { Shipment, UseShipmentsReturn } from "./useShipments";

export type {
  ReturnRequest,
  UseReturnRequestsReturn,
} from "./useReturnRequests";

export type { Customer, UseCustomersReturn } from "./useCustomers";

export type { Product, UseProductsReturn } from "./useProducts";

export type { Order, OrderItem, UseOrdersReturn } from "./useOrders";

export type { AnalyticsReport, UseAnalyticsReturn } from "./useAnalytics";

export type {
  ApiIntegration,
  UseApiIntegrationsReturn,
} from "./useApiIntegrations";
