import { useState, useCallback } from "react";
import { DeliveryStatus } from "@prisma/client";

export interface Shipment {
  shipmentId: string;
  assetId: string;
  holderId: string;
  shipmentDate: Date;
  deliveryStatus: DeliveryStatus;
  carrier: string;
  trackingNumber?: string;
  courierApiResponse?: any;
  createdAt: Date;
  updatedAt: Date;
  asset?: any;
  holder?: any;
}

export interface UseShipmentsReturn {
  shipments: Shipment[];
  loading: boolean;
  error: string | null;
  fetchShipments: (
    assetId?: string,
    holderId?: string,
    status?: DeliveryStatus
  ) => Promise<void>;
  fetchShipment: (shipmentId: string) => Promise<Shipment | null>;
  createShipment: (
    shipmentData: Omit<Shipment, "shipmentId" | "createdAt" | "updatedAt">
  ) => Promise<Shipment | null>;
  updateShipment: (
    shipmentId: string,
    shipmentData: Partial<Shipment>
  ) => Promise<Shipment | null>;
  deleteShipment: (shipmentId: string) => Promise<boolean>;
  updateDeliveryStatus: (
    shipmentId: string,
    status: DeliveryStatus
  ) => Promise<Shipment | null>;
  addTrackingNumber: (
    shipmentId: string,
    trackingNumber: string
  ) => Promise<Shipment | null>;
  markAsDelivered: (shipmentId: string) => Promise<Shipment | null>;
  markAsFailed: (shipmentId: string) => Promise<Shipment | null>;
  markAsReturned: (shipmentId: string) => Promise<Shipment | null>;
}

export const useShipments = (): UseShipmentsReturn => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShipments = useCallback(
    async (assetId?: string, holderId?: string, status?: DeliveryStatus) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetShipments($assetId: ID, $holderId: ID, $status: DeliveryStatus) {
              shipments(assetId: $assetId, holderId: $holderId, status: $status) {
                shipmentId
                assetId
                holderId
                shipmentDate
                deliveryStatus
                carrier
                trackingNumber
                courierApiResponse
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                  status
                }
                holder {
                  holderId
                  name
                  department
                  email
                }
              }
            }
          `,
            variables: { assetId, holderId, status },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setShipments(result.data.shipments);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch shipments"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchShipment = useCallback(
    async (shipmentId: string): Promise<Shipment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetShipment($shipmentId: ID!) {
              shipment(shipmentId: $shipmentId) {
                shipmentId
                assetId
                holderId
                shipmentDate
                deliveryStatus
                carrier
                trackingNumber
                courierApiResponse
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                  barcode
                  status
                  location
                }
                holder {
                  holderId
                  name
                  department
                  email
                  location
                }
              }
            }
          `,
            variables: { shipmentId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.shipment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch shipment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createShipment = useCallback(
    async (
      shipmentData: Omit<Shipment, "shipmentId" | "createdAt" | "updatedAt">
    ): Promise<Shipment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateShipment($input: CreateShipmentInput!) {
              createShipment(input: $input) {
                shipmentId
                assetId
                holderId
                shipmentDate
                deliveryStatus
                carrier
                trackingNumber
                courierApiResponse
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
                holder {
                  holderId
                  name
                  department
                  email
                }
              }
            }
          `,
            variables: { input: shipmentData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newShipment = result.data.createShipment;
        setShipments((prev) => [...prev, newShipment]);
        return newShipment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create shipment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateShipment = useCallback(
    async (
      shipmentId: string,
      shipmentData: Partial<Shipment>
    ): Promise<Shipment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateShipment($shipmentId: ID!, $input: UpdateShipmentInput!) {
              updateShipment(shipmentId: $shipmentId, input: $input) {
                shipmentId
                assetId
                holderId
                shipmentDate
                deliveryStatus
                carrier
                trackingNumber
                courierApiResponse
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
                holder {
                  holderId
                  name
                  department
                  email
                }
              }
            }
          `,
            variables: { shipmentId, input: shipmentData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedShipment = result.data.updateShipment;
        setShipments((prev) =>
          prev.map((shipment) =>
            shipment.shipmentId === shipmentId ? updatedShipment : shipment
          )
        );
        return updatedShipment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update shipment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteShipment = useCallback(
    async (shipmentId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteShipment($shipmentId: ID!) {
              deleteShipment(shipmentId: $shipmentId)
            }
          `,
            variables: { shipmentId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteShipment) {
          setShipments((prev) =>
            prev.filter((shipment) => shipment.shipmentId !== shipmentId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete shipment"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateDeliveryStatus = useCallback(
    async (
      shipmentId: string,
      status: DeliveryStatus
    ): Promise<Shipment | null> => {
      return updateShipment(shipmentId, { deliveryStatus: status });
    },
    [updateShipment]
  );

  const addTrackingNumber = useCallback(
    async (
      shipmentId: string,
      trackingNumber: string
    ): Promise<Shipment | null> => {
      return updateShipment(shipmentId, { trackingNumber });
    },
    [updateShipment]
  );

  const markAsDelivered = useCallback(
    async (shipmentId: string): Promise<Shipment | null> => {
      return updateDeliveryStatus(shipmentId, DeliveryStatus.DELIVERED);
    },
    [updateDeliveryStatus]
  );

  const markAsFailed = useCallback(
    async (shipmentId: string): Promise<Shipment | null> => {
      return updateDeliveryStatus(shipmentId, DeliveryStatus.FAILED);
    },
    [updateDeliveryStatus]
  );

  const markAsReturned = useCallback(
    async (shipmentId: string): Promise<Shipment | null> => {
      return updateDeliveryStatus(shipmentId, DeliveryStatus.RETURNED);
    },
    [updateDeliveryStatus]
  );

  return {
    shipments,
    loading,
    error,
    fetchShipments,
    fetchShipment,
    createShipment,
    updateShipment,
    deleteShipment,
    updateDeliveryStatus,
    addTrackingNumber,
    markAsDelivered,
    markAsFailed,
    markAsReturned,
  };
};
