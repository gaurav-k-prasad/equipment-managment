import { useState, useCallback } from "react";

export interface Maintenance {
  maintenanceId: string;
  assetId: string;
  maintenanceDate: Date;
  issueReported: string;
  resolution?: string;
  warrantyCovered: boolean;
  reminderScheduled?: Date;
  createdAt: Date;
  updatedAt: Date;
  asset?: any;
}

export interface UseMaintenanceReturn {
  maintenances: Maintenance[];
  loading: boolean;
  error: string | null;
  fetchMaintenances: (
    assetId?: string,
    dateFrom?: Date,
    dateTo?: Date
  ) => Promise<void>;
  fetchMaintenance: (maintenanceId: string) => Promise<Maintenance | null>;
  createMaintenance: (
    maintenanceData: Omit<
      Maintenance,
      "maintenanceId" | "createdAt" | "updatedAt"
    >
  ) => Promise<Maintenance | null>;
  updateMaintenance: (
    maintenanceId: string,
    maintenanceData: Partial<Maintenance>
  ) => Promise<Maintenance | null>;
  deleteMaintenance: (maintenanceId: string) => Promise<boolean>;
  resolveMaintenance: (
    maintenanceId: string,
    resolution: string
  ) => Promise<Maintenance | null>;
  scheduleReminder: (
    maintenanceId: string,
    reminderDate: Date
  ) => Promise<Maintenance | null>;
  markWarrantyCovered: (
    maintenanceId: string,
    covered: boolean
  ) => Promise<Maintenance | null>;
}

export const useMaintenance = (): UseMaintenanceReturn => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenances = useCallback(
    async (assetId?: string, dateFrom?: Date, dateTo?: Date) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetMaintenances($assetId: ID, $dateFrom: DateTime, $dateTo: DateTime) {
              maintenances(assetId: $assetId, dateFrom: $dateFrom, dateTo: $dateTo) {
                maintenanceId
                assetId
                maintenanceDate
                issueReported
                resolution
                warrantyCovered
                reminderScheduled
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                  status
                }
              }
            }
          `,
            variables: { assetId, dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setMaintenances(result.data.maintenances);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch maintenances"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchMaintenance = useCallback(
    async (maintenanceId: string): Promise<Maintenance | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetMaintenance($maintenanceId: ID!) {
              maintenance(maintenanceId: $maintenanceId) {
                maintenanceId
                assetId
                maintenanceDate
                issueReported
                resolution
                warrantyCovered
                reminderScheduled
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
                  purchaseDate
                  warrantyExpiry
                }
              }
            }
          `,
            variables: { maintenanceId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.maintenance;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch maintenance"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createMaintenance = useCallback(
    async (
      maintenanceData: Omit<
        Maintenance,
        "maintenanceId" | "createdAt" | "updatedAt"
      >
    ): Promise<Maintenance | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateMaintenance($input: CreateMaintenanceInput!) {
              createMaintenance(input: $input) {
                maintenanceId
                assetId
                maintenanceDate
                issueReported
                resolution
                warrantyCovered
                reminderScheduled
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
              }
            }
          `,
            variables: { input: maintenanceData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newMaintenance = result.data.createMaintenance;
        setMaintenances((prev) => [...prev, newMaintenance]);
        return newMaintenance;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create maintenance"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateMaintenance = useCallback(
    async (
      maintenanceId: string,
      maintenanceData: Partial<Maintenance>
    ): Promise<Maintenance | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateMaintenance($maintenanceId: ID!, $input: UpdateMaintenanceInput!) {
              updateMaintenance(maintenanceId: $maintenanceId, input: $input) {
                maintenanceId
                assetId
                maintenanceDate
                issueReported
                resolution
                warrantyCovered
                reminderScheduled
                createdAt
                updatedAt
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
              }
            }
          `,
            variables: { maintenanceId, input: maintenanceData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedMaintenance = result.data.updateMaintenance;
        setMaintenances((prev) =>
          prev.map((maintenance) =>
            maintenance.maintenanceId === maintenanceId
              ? updatedMaintenance
              : maintenance
          )
        );
        return updatedMaintenance;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update maintenance"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteMaintenance = useCallback(
    async (maintenanceId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteMaintenance($maintenanceId: ID!) {
              deleteMaintenance(maintenanceId: $maintenanceId)
            }
          `,
            variables: { maintenanceId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteMaintenance) {
          setMaintenances((prev) =>
            prev.filter(
              (maintenance) => maintenance.maintenanceId !== maintenanceId
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete maintenance"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const resolveMaintenance = useCallback(
    async (
      maintenanceId: string,
      resolution: string
    ): Promise<Maintenance | null> => {
      return updateMaintenance(maintenanceId, { resolution });
    },
    [updateMaintenance]
  );

  const scheduleReminder = useCallback(
    async (
      maintenanceId: string,
      reminderDate: Date
    ): Promise<Maintenance | null> => {
      return updateMaintenance(maintenanceId, {
        reminderScheduled: reminderDate,
      });
    },
    [updateMaintenance]
  );

  const markWarrantyCovered = useCallback(
    async (
      maintenanceId: string,
      covered: boolean
    ): Promise<Maintenance | null> => {
      return updateMaintenance(maintenanceId, { warrantyCovered: covered });
    },
    [updateMaintenance]
  );

  return {
    maintenances,
    loading,
    error,
    fetchMaintenances,
    fetchMaintenance,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    resolveMaintenance,
    scheduleReminder,
    markWarrantyCovered,
  };
};
