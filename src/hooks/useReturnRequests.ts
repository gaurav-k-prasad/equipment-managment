import { useState, useCallback } from "react";
import { ReturnStatus } from "@prisma/client";

export interface ReturnRequest {
  returnId: string;
  holderId?: string;
  customerId?: string;
  assetId?: string;
  orderId?: string;
  requestDate: Date;
  returnStatus: ReturnStatus;
  prepaidLabelGenerated: boolean;
  finalStatusConfirmed: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
  holder?: any;
  customer?: any;
  asset?: any;
  order?: any;
}

export interface UseReturnRequestsReturn {
  returnRequests: ReturnRequest[];
  loading: boolean;
  error: string | null;
  fetchReturnRequests: (
    holderId?: string,
    customerId?: string,
    assetId?: string,
    status?: ReturnStatus
  ) => Promise<void>;
  fetchReturnRequest: (returnId: string) => Promise<ReturnRequest | null>;
  createReturnRequest: (
    returnData: Omit<ReturnRequest, "returnId" | "createdAt" | "updatedAt">
  ) => Promise<ReturnRequest | null>;
  updateReturnRequest: (
    returnId: string,
    returnData: Partial<ReturnRequest>
  ) => Promise<ReturnRequest | null>;
  deleteReturnRequest: (returnId: string) => Promise<boolean>;
  approveReturn: (returnId: string) => Promise<ReturnRequest | null>;
  rejectReturn: (
    returnId: string,
    reason?: string
  ) => Promise<ReturnRequest | null>;
  completeReturn: (returnId: string) => Promise<ReturnRequest | null>;
  cancelReturn: (returnId: string) => Promise<ReturnRequest | null>;
  generatePrepaidLabel: (returnId: string) => Promise<ReturnRequest | null>;
  confirmFinalStatus: (returnId: string) => Promise<ReturnRequest | null>;
}

export const useReturnRequests = (): UseReturnRequestsReturn => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReturnRequests = useCallback(
    async (
      holderId?: string,
      customerId?: string,
      assetId?: string,
      status?: ReturnStatus
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetReturnRequests($holderId: ID, $customerId: ID, $assetId: ID, $status: ReturnStatus) {
              returnRequests(holderId: $holderId, customerId: $customerId, assetId: $assetId, status: $status) {
                returnId
                holderId
                customerId
                assetId
                orderId
                requestDate
                returnStatus
                prepaidLabelGenerated
                finalStatusConfirmed
                reason
                createdAt
                updatedAt
                holder {
                  holderId
                  name
                  department
                  email
                }
                customer {
                  customerId
                  name
                  email
                  phone
                }
                asset {
                  assetId
                  type
                  model
                  serialNumber
                  status
                }
                order {
                  orderId
                  orderDate
                  orderStatus
                  totalAmount
                }
              }
            }
          `,
            variables: { holderId, customerId, assetId, status },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setReturnRequests(result.data.returnRequests);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch return requests"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchReturnRequest = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetReturnRequest($returnId: ID!) {
              returnRequest(returnId: $returnId) {
                returnId
                holderId
                customerId
                assetId
                orderId
                requestDate
                returnStatus
                prepaidLabelGenerated
                finalStatusConfirmed
                reason
                createdAt
                updatedAt
                holder {
                  holderId
                  name
                  department
                  email
                  location
                }
                customer {
                  customerId
                  name
                  email
                  phone
                  address
                }
                asset {
                  assetId
                  type
                  model
                  serialNumber
                  barcode
                  status
                  location
                }
                order {
                  orderId
                  orderDate
                  orderStatus
                  totalAmount
                }
              }
            }
          `,
            variables: { returnId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.returnRequest;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch return request"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createReturnRequest = useCallback(
    async (
      returnData: Omit<ReturnRequest, "returnId" | "createdAt" | "updatedAt">
    ): Promise<ReturnRequest | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateReturnRequest($input: CreateReturnRequestInput!) {
              createReturnRequest(input: $input) {
                returnId
                holderId
                customerId
                assetId
                orderId
                requestDate
                returnStatus
                prepaidLabelGenerated
                finalStatusConfirmed
                reason
                createdAt
                updatedAt
                holder {
                  holderId
                  name
                  department
                  email
                }
                customer {
                  customerId
                  name
                  email
                }
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
                order {
                  orderId
                  orderDate
                  orderStatus
                }
              }
            }
          `,
            variables: { input: returnData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newReturnRequest = result.data.createReturnRequest;
        setReturnRequests((prev) => [...prev, newReturnRequest]);
        return newReturnRequest;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create return request"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateReturnRequest = useCallback(
    async (
      returnId: string,
      returnData: Partial<ReturnRequest>
    ): Promise<ReturnRequest | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateReturnRequest($returnId: ID!, $input: UpdateReturnRequestInput!) {
              updateReturnRequest(returnId: $returnId, input: $input) {
                returnId
                holderId
                customerId
                assetId
                orderId
                requestDate
                returnStatus
                prepaidLabelGenerated
                finalStatusConfirmed
                reason
                createdAt
                updatedAt
                holder {
                  holderId
                  name
                  department
                  email
                }
                customer {
                  customerId
                  name
                  email
                }
                asset {
                  assetId
                  type
                  model
                  serialNumber
                }
                order {
                  orderId
                  orderDate
                  orderStatus
                }
              }
            }
          `,
            variables: { returnId, input: returnData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedReturnRequest = result.data.updateReturnRequest;
        setReturnRequests((prev) =>
          prev.map((request) =>
            request.returnId === returnId ? updatedReturnRequest : request
          )
        );
        return updatedReturnRequest;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update return request"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteReturnRequest = useCallback(
    async (returnId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteReturnRequest($returnId: ID!) {
              deleteReturnRequest(returnId: $returnId)
            }
          `,
            variables: { returnId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteReturnRequest) {
          setReturnRequests((prev) =>
            prev.filter((request) => request.returnId !== returnId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete return request"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const approveReturn = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, {
        returnStatus: ReturnStatus.APPROVED,
      });
    },
    [updateReturnRequest]
  );

  const rejectReturn = useCallback(
    async (
      returnId: string,
      reason?: string
    ): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, {
        returnStatus: ReturnStatus.REJECTED,
        reason: reason || "Return request rejected",
      });
    },
    [updateReturnRequest]
  );

  const completeReturn = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, {
        returnStatus: ReturnStatus.COMPLETED,
      });
    },
    [updateReturnRequest]
  );

  const cancelReturn = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, {
        returnStatus: ReturnStatus.CANCELLED,
      });
    },
    [updateReturnRequest]
  );

  const generatePrepaidLabel = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, { prepaidLabelGenerated: true });
    },
    [updateReturnRequest]
  );

  const confirmFinalStatus = useCallback(
    async (returnId: string): Promise<ReturnRequest | null> => {
      return updateReturnRequest(returnId, { finalStatusConfirmed: true });
    },
    [updateReturnRequest]
  );

  return {
    returnRequests,
    loading,
    error,
    fetchReturnRequests,
    fetchReturnRequest,
    createReturnRequest,
    updateReturnRequest,
    deleteReturnRequest,
    approveReturn,
    rejectReturn,
    completeReturn,
    cancelReturn,
    generatePrepaidLabel,
    confirmFinalStatus,
  };
};
