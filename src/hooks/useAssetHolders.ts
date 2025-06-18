import { useState, useCallback } from "react";
import { HolderRole } from "@prisma/client";

export interface AssetHolder {
  holderId: string;
  name: string;
  department: string;
  email: string;
  location: string;
  role: HolderRole;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  ownedAssets?: any[];
  assignments?: any[];
  shipments?: any[];
  returnRequests?: any[];
}

export interface AssetHolderFilter {
  department?: string;
  role?: HolderRole;
  location?: string;
}

export interface UseAssetHoldersReturn {
  assetHolders: AssetHolder[];
  loading: boolean;
  error: string | null;
  fetchAssetHolders: (
    filter?: AssetHolderFilter,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  fetchAssetHolder: (holderId: string) => Promise<AssetHolder | null>;
  createAssetHolder: (
    holderData: Omit<AssetHolder, "holderId" | "createdAt" | "updatedAt">
  ) => Promise<AssetHolder | null>;
  updateAssetHolder: (
    holderId: string,
    holderData: Partial<AssetHolder>
  ) => Promise<AssetHolder | null>;
  deleteAssetHolder: (holderId: string) => Promise<boolean>;
  assignUserToHolder: (
    holderId: string,
    userId: string
  ) => Promise<AssetHolder | null>;
  unassignUserFromHolder: (holderId: string) => Promise<AssetHolder | null>;
}

export const useAssetHolders = (): UseAssetHoldersReturn => {
  const [assetHolders, setAssetHolders] = useState<AssetHolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetHolders = useCallback(
    async (filter?: AssetHolderFilter, limit?: number, offset?: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssetHolders($filter: AssetHolderFilter, $limit: Int, $offset: Int) {
              assetHolders(filter: $filter, limit: $limit, offset: $offset) {
                holderId
                name
                department
                email
                location
                role
                createdAt
                updatedAt
                userId
                ownedAssets {
                  assetId
                  type
                  model
                  serialNumber
                  status
                }
                assignments {
                  assignmentId
                  assignedDate
                  returnDate
                  status
                }
                shipments {
                  shipmentId
                  shipmentDate
                  deliveryStatus
                }
                returnRequests {
                  returnId
                  requestDate
                  returnStatus
                }
              }
            }
          `,
            variables: { filter, limit, offset },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setAssetHolders(result.data.assetHolders);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch asset holders"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAssetHolder = useCallback(
    async (holderId: string): Promise<AssetHolder | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssetHolder($holderId: ID!) {
              assetHolder(holderId: $holderId) {
                holderId
                name
                department
                email
                location
                role
                createdAt
                updatedAt
                userId
                ownedAssets {
                  assetId
                  type
                  model
                  serialNumber
                  status
                  location
                  purchaseDate
                }
                assignments {
                  assignmentId
                  assignedDate
                  returnDate
                  status
                  asset {
                    assetId
                    type
                    model
                    serialNumber
                  }
                }
                shipments {
                  shipmentId
                  shipmentDate
                  deliveryStatus
                  carrier
                  trackingNumber
                  asset {
                    assetId
                    type
                    model
                  }
                }
                returnRequests {
                  returnId
                  requestDate
                  returnStatus
                  reason
                  asset {
                    assetId
                    type
                    model
                  }
                }
              }
            }
          `,
            variables: { holderId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.assetHolder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch asset holder"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createAssetHolder = useCallback(
    async (
      holderData: Omit<AssetHolder, "holderId" | "createdAt" | "updatedAt">
    ): Promise<AssetHolder | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateAssetHolder($input: CreateAssetHolderInput!) {
              createAssetHolder(input: $input) {
                holderId
                name
                department
                email
                location
                role
                createdAt
                updatedAt
                userId
              }
            }
          `,
            variables: { input: holderData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newHolder = result.data.createAssetHolder;
        setAssetHolders((prev) => [...prev, newHolder]);
        return newHolder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create asset holder"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAssetHolder = useCallback(
    async (
      holderId: string,
      holderData: Partial<AssetHolder>
    ): Promise<AssetHolder | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateAssetHolder($holderId: ID!, $input: UpdateAssetHolderInput!) {
              updateAssetHolder(holderId: $holderId, input: $input) {
                holderId
                name
                department
                email
                location
                role
                createdAt
                updatedAt
                userId
              }
            }
          `,
            variables: { holderId, input: holderData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedHolder = result.data.updateAssetHolder;
        setAssetHolders((prev) =>
          prev.map((holder) =>
            holder.holderId === holderId ? updatedHolder : holder
          )
        );
        return updatedHolder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update asset holder"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAssetHolder = useCallback(
    async (holderId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteAssetHolder($holderId: ID!) {
              deleteAssetHolder(holderId: $holderId)
            }
          `,
            variables: { holderId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteAssetHolder) {
          setAssetHolders((prev) =>
            prev.filter((holder) => holder.holderId !== holderId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete asset holder"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const assignUserToHolder = useCallback(
    async (holderId: string, userId: string): Promise<AssetHolder | null> => {
      return updateAssetHolder(holderId, { userId });
    },
    [updateAssetHolder]
  );

  const unassignUserFromHolder = useCallback(
    async (holderId: string): Promise<AssetHolder | null> => {
      return updateAssetHolder(holderId, { userId: undefined });
    },
    [updateAssetHolder]
  );

  return {
    assetHolders,
    loading,
    error,
    fetchAssetHolders,
    fetchAssetHolder,
    createAssetHolder,
    updateAssetHolder,
    deleteAssetHolder,
    assignUserToHolder,
    unassignUserFromHolder,
  };
};
