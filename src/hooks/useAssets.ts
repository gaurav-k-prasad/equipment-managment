import { useState, useCallback } from "react";
import { AssetStatus } from "@prisma/client";

export interface Asset {
  assetId: string;
  type: string;
  model: string;
  serialNumber: string;
  barcode?: string;
  status: AssetStatus;
  location: string;
  purchaseDate: Date;
  warrantyExpiry?: Date;
  ownerHolderId?: string;
  createdAt: Date;
  updatedAt: Date;
  owner?: any;
  assignments?: any[];
  shipments?: any[];
  maintenances?: any[];
  returnRequests?: any[];
}

export interface AssetFilter {
  type?: string;
  status?: AssetStatus;
  location?: string;
  ownerHolderId?: string;
}

export interface AssetSort {
  field: string;
  order: "asc" | "desc";
}

export interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  fetchAssets: (
    filter?: AssetFilter,
    sort?: AssetSort,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  fetchAsset: (assetId: string) => Promise<Asset | null>;
  createAsset: (
    assetData: Omit<Asset, "assetId" | "createdAt" | "updatedAt">
  ) => Promise<Asset | null>;
  updateAsset: (
    assetId: string,
    assetData: Partial<Asset>
  ) => Promise<Asset | null>;
  deleteAsset: (assetId: string) => Promise<boolean>;
  updateAssetStatus: (
    assetId: string,
    status: AssetStatus
  ) => Promise<Asset | null>;
  assignAsset: (assetId: string, holderId: string) => Promise<Asset | null>;
  unassignAsset: (assetId: string) => Promise<Asset | null>;
}

export const useAssets = (): UseAssetsReturn => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(
    async (
      filter?: AssetFilter,
      sort?: AssetSort,
      limit?: number,
      offset?: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filter) {
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined) queryParams.append(key, value.toString());
          });
        }
        if (sort) {
          queryParams.append("sortField", sort.field);
          queryParams.append("sortOrder", sort.order);
        }
        if (limit) queryParams.append("limit", limit.toString());
        if (offset) queryParams.append("offset", offset.toString());

        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssets($filter: AssetFilter, $sort: AssetSort, $limit: Int, $offset: Int) {
              assets(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
                assetId
                type
                model
                serialNumber
                barcode
                status
                location
                purchaseDate
                warrantyExpiry
                ownerHolderId
                createdAt
                updatedAt
                owner {
                  holderId
                  name
                  department
                  email
                }
                assignments {
                  assignmentId
                  assignedDate
                  returnDate
                  status
                }
                maintenances {
                  maintenanceId
                  maintenanceDate
                  issueReported
                  resolution
                }
              }
            }
          `,
            variables: { filter, sort, limit, offset },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setAssets(result.data.assets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAsset = useCallback(
    async (assetId: string): Promise<Asset | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAsset($assetId: ID!) {
              asset(assetId: $assetId) {
                assetId
                type
                model
                serialNumber
                barcode
                status
                location
                purchaseDate
                warrantyExpiry
                ownerHolderId
                createdAt
                updatedAt
                owner {
                  holderId
                  name
                  department
                  email
                }
                assignments {
                  assignmentId
                  assignedDate
                  returnDate
                  status
                }
                maintenances {
                  maintenanceId
                  maintenanceDate
                  issueReported
                  resolution
                }
                shipments {
                  shipmentId
                  shipmentDate
                  deliveryStatus
                  carrier
                  trackingNumber
                }
                returnRequests {
                  returnId
                  requestDate
                  returnStatus
                  reason
                }
              }
            }
          `,
            variables: { assetId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.asset;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch asset");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createAsset = useCallback(
    async (
      assetData: Omit<Asset, "assetId" | "createdAt" | "updatedAt">
    ): Promise<Asset | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateAsset($input: CreateAssetInput!) {
              createAsset(input: $input) {
                assetId
                type
                model
                serialNumber
                barcode
                status
                location
                purchaseDate
                warrantyExpiry
                ownerHolderId
                createdAt
                updatedAt
              }
            }
          `,
            variables: { input: assetData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newAsset = result.data.createAsset;
        setAssets((prev) => [...prev, newAsset]);
        return newAsset;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create asset");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAsset = useCallback(
    async (
      assetId: string,
      assetData: Partial<Asset>
    ): Promise<Asset | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateAsset($assetId: ID!, $input: UpdateAssetInput!) {
              updateAsset(assetId: $assetId, input: $input) {
                assetId
                type
                model
                serialNumber
                barcode
                status
                location
                purchaseDate
                warrantyExpiry
                ownerHolderId
                createdAt
                updatedAt
              }
            }
          `,
            variables: { assetId, input: assetData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedAsset = result.data.updateAsset;
        setAssets((prev) =>
          prev.map((asset) =>
            asset.assetId === assetId ? updatedAsset : asset
          )
        );
        return updatedAsset;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update asset");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAsset = useCallback(async (assetId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation DeleteAsset($assetId: ID!) {
              deleteAsset(assetId: $assetId)
            }
          `,
          variables: { assetId },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.deleteAsset) {
        setAssets((prev) => prev.filter((asset) => asset.assetId !== assetId));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete asset");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAssetStatus = useCallback(
    async (assetId: string, status: AssetStatus): Promise<Asset | null> => {
      return updateAsset(assetId, { status });
    },
    [updateAsset]
  );

  const assignAsset = useCallback(
    async (assetId: string, holderId: string): Promise<Asset | null> => {
      return updateAsset(assetId, {
        ownerHolderId: holderId,
        status: AssetStatus.ASSIGNED,
      });
    },
    [updateAsset]
  );

  const unassignAsset = useCallback(
    async (assetId: string): Promise<Asset | null> => {
      return updateAsset(assetId, {
        ownerHolderId: undefined,
        status: AssetStatus.AVAILABLE,
      });
    },
    [updateAsset]
  );

  return {
    assets,
    loading,
    error,
    fetchAssets,
    fetchAsset,
    createAsset,
    updateAsset,
    deleteAsset,
    updateAssetStatus,
    assignAsset,
    unassignAsset,
  };
};
