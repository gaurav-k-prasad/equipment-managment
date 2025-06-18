import { useState, useCallback } from "react";
import { IntegrationStatus } from "@prisma/client";

export interface ApiIntegration {
  integrationId: string;
  systemName: string;
  apiType: string;
  endpointUrl: string;
  status: IntegrationStatus;
  lastSyncTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UseApiIntegrationsReturn {
  integrations: ApiIntegration[];
  loading: boolean;
  error: string | null;
  fetchIntegrations: (status?: IntegrationStatus) => Promise<void>;
  fetchIntegration: (integrationId: string) => Promise<ApiIntegration | null>;
  createIntegration: (
    integrationData: Omit<
      ApiIntegration,
      "integrationId" | "createdAt" | "updatedAt"
    >
  ) => Promise<ApiIntegration | null>;
  updateIntegration: (
    integrationId: string,
    integrationData: Partial<ApiIntegration>
  ) => Promise<ApiIntegration | null>;
  deleteIntegration: (integrationId: string) => Promise<boolean>;
  activateIntegration: (
    integrationId: string
  ) => Promise<ApiIntegration | null>;
  deactivateIntegration: (
    integrationId: string
  ) => Promise<ApiIntegration | null>;
  testIntegration: (integrationId: string) => Promise<boolean>;
  syncIntegration: (integrationId: string) => Promise<ApiIntegration | null>;
  getIntegrationStatus: (integrationId: string) => Promise<IntegrationStatus>;
}

export const useApiIntegrations = (): UseApiIntegrationsReturn => {
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async (status?: IntegrationStatus) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetApiIntegrations($status: IntegrationStatus) {
              apiIntegrations(status: $status) {
                integrationId
                systemName
                apiType
                endpointUrl
                status
                lastSyncTime
                createdAt
                updatedAt
              }
            }
          `,
          variables: { status },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setIntegrations(result.data.apiIntegrations);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch integrations"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchIntegration = useCallback(
    async (integrationId: string): Promise<ApiIntegration | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetApiIntegration($integrationId: ID!) {
              apiIntegration(integrationId: $integrationId) {
                integrationId
                systemName
                apiType
                endpointUrl
                status
                lastSyncTime
                createdAt
                updatedAt
              }
            }
          `,
            variables: { integrationId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.apiIntegration;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch integration"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createIntegration = useCallback(
    async (
      integrationData: Omit<
        ApiIntegration,
        "integrationId" | "createdAt" | "updatedAt"
      >
    ): Promise<ApiIntegration | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateApiIntegration($input: CreateApiIntegrationInput!) {
              createApiIntegration(input: $input) {
                integrationId
                systemName
                apiType
                endpointUrl
                status
                lastSyncTime
                createdAt
                updatedAt
              }
            }
          `,
            variables: { input: integrationData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newIntegration = result.data.createApiIntegration;
        setIntegrations((prev) => [...prev, newIntegration]);
        return newIntegration;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create integration"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateIntegration = useCallback(
    async (
      integrationId: string,
      integrationData: Partial<ApiIntegration>
    ): Promise<ApiIntegration | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateApiIntegration($integrationId: ID!, $input: UpdateApiIntegrationInput!) {
              updateApiIntegration(integrationId: $integrationId, input: $input) {
                integrationId
                systemName
                apiType
                endpointUrl
                status
                lastSyncTime
                createdAt
                updatedAt
              }
            }
          `,
            variables: { integrationId, input: integrationData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedIntegration = result.data.updateApiIntegration;
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.integrationId === integrationId
              ? updatedIntegration
              : integration
          )
        );
        return updatedIntegration;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update integration"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteIntegration = useCallback(
    async (integrationId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteApiIntegration($integrationId: ID!) {
              deleteApiIntegration(integrationId: $integrationId)
            }
          `,
            variables: { integrationId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteApiIntegration) {
          setIntegrations((prev) =>
            prev.filter(
              (integration) => integration.integrationId !== integrationId
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete integration"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activateIntegration = useCallback(
    async (integrationId: string): Promise<ApiIntegration | null> => {
      return updateIntegration(integrationId, {
        status: IntegrationStatus.ACTIVE,
      });
    },
    [updateIntegration]
  );

  const deactivateIntegration = useCallback(
    async (integrationId: string): Promise<ApiIntegration | null> => {
      return updateIntegration(integrationId, {
        status: IntegrationStatus.INACTIVE,
      });
    },
    [updateIntegration]
  );

  const testIntegration = useCallback(
    async (integrationId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation TestApiIntegration($integrationId: ID!) {
              testApiIntegration(integrationId: $integrationId)
            }
          `,
            variables: { integrationId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.testApiIntegration;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to test integration"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const syncIntegration = useCallback(
    async (integrationId: string): Promise<ApiIntegration | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation SyncApiIntegration($integrationId: ID!) {
              syncApiIntegration(integrationId: $integrationId) {
                integrationId
                systemName
                apiType
                endpointUrl
                status
                lastSyncTime
                createdAt
                updatedAt
              }
            }
          `,
            variables: { integrationId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedIntegration = result.data.syncApiIntegration;
        setIntegrations((prev) =>
          prev.map((integration) =>
            integration.integrationId === integrationId
              ? updatedIntegration
              : integration
          )
        );
        return updatedIntegration;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to sync integration"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getIntegrationStatus = useCallback(
    async (integrationId: string): Promise<IntegrationStatus> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetIntegrationStatus($integrationId: ID!) {
              apiIntegration(integrationId: $integrationId) {
                status
              }
            }
          `,
            variables: { integrationId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.apiIntegration.status;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to get integration status"
        );
        return IntegrationStatus.ERROR;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    fetchIntegration,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    activateIntegration,
    deactivateIntegration,
    testIntegration,
    syncIntegration,
    getIntegrationStatus,
  };
};
