import { useState, useCallback } from "react";
import { AssignmentStatus } from "@prisma/client";

export interface Assignment {
  assignmentId: string;
  assetId: string;
  holderId: string;
  assignedDate: Date;
  returnDate?: Date;
  status: AssignmentStatus;
  acknowledgment: boolean;
  chainOfCustodyDoc?: string;
  createdAt: Date;
  updatedAt: Date;
  asset?: any;
  holder?: any;
}

export interface UseAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  fetchAssignments: (
    assetId?: string,
    holderId?: string,
    status?: AssignmentStatus
  ) => Promise<void>;
  fetchAssignment: (assignmentId: string) => Promise<Assignment | null>;
  createAssignment: (
    assignmentData: Omit<Assignment, "assignmentId" | "createdAt" | "updatedAt">
  ) => Promise<Assignment | null>;
  updateAssignment: (
    assignmentId: string,
    assignmentData: Partial<Assignment>
  ) => Promise<Assignment | null>;
  deleteAssignment: (assignmentId: string) => Promise<boolean>;
  acknowledgeAssignment: (assignmentId: string) => Promise<Assignment | null>;
  returnAssignment: (
    assignmentId: string,
    returnDate: Date
  ) => Promise<Assignment | null>;
  extendAssignment: (
    assignmentId: string,
    newReturnDate: Date
  ) => Promise<Assignment | null>;
}

export const useAssignments = (): UseAssignmentsReturn => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(
    async (assetId?: string, holderId?: string, status?: AssignmentStatus) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssignments($assetId: ID, $holderId: ID, $status: AssignmentStatus) {
              assignments(assetId: $assetId, holderId: $holderId, status: $status) {
                assignmentId
                assetId
                holderId
                assignedDate
                returnDate
                status
                acknowledgment
                chainOfCustodyDoc
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

        setAssignments(result.data.assignments);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch assignments"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAssignment = useCallback(
    async (assignmentId: string): Promise<Assignment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetAssignment($assignmentId: ID!) {
              assignment(assignmentId: $assignmentId) {
                assignmentId
                assetId
                holderId
                assignedDate
                returnDate
                status
                acknowledgment
                chainOfCustodyDoc
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
                holder {
                  holderId
                  name
                  department
                  email
                  location
                  role
                }
              }
            }
          `,
            variables: { assignmentId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.assignment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch assignment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createAssignment = useCallback(
    async (
      assignmentData: Omit<
        Assignment,
        "assignmentId" | "createdAt" | "updatedAt"
      >
    ): Promise<Assignment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateAssignment($input: CreateAssignmentInput!) {
              createAssignment(input: $input) {
                assignmentId
                assetId
                holderId
                assignedDate
                returnDate
                status
                acknowledgment
                chainOfCustodyDoc
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
            variables: { input: assignmentData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newAssignment = result.data.createAssignment;
        setAssignments((prev) => [...prev, newAssignment]);
        return newAssignment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create assignment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAssignment = useCallback(
    async (
      assignmentId: string,
      assignmentData: Partial<Assignment>
    ): Promise<Assignment | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateAssignment($assignmentId: ID!, $input: UpdateAssignmentInput!) {
              updateAssignment(assignmentId: $assignmentId, input: $input) {
                assignmentId
                assetId
                holderId
                assignedDate
                returnDate
                status
                acknowledgment
                chainOfCustodyDoc
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
            variables: { assignmentId, input: assignmentData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedAssignment = result.data.updateAssignment;
        setAssignments((prev) =>
          prev.map((assignment) =>
            assignment.assignmentId === assignmentId
              ? updatedAssignment
              : assignment
          )
        );
        return updatedAssignment;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update assignment"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAssignment = useCallback(
    async (assignmentId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteAssignment($assignmentId: ID!) {
              deleteAssignment(assignmentId: $assignmentId)
            }
          `,
            variables: { assignmentId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteAssignment) {
          setAssignments((prev) =>
            prev.filter(
              (assignment) => assignment.assignmentId !== assignmentId
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete assignment"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const acknowledgeAssignment = useCallback(
    async (assignmentId: string): Promise<Assignment | null> => {
      return updateAssignment(assignmentId, { acknowledgment: true });
    },
    [updateAssignment]
  );

  const returnAssignment = useCallback(
    async (
      assignmentId: string,
      returnDate: Date
    ): Promise<Assignment | null> => {
      return updateAssignment(assignmentId, {
        returnDate,
        status: AssignmentStatus.RETURNED,
      });
    },
    [updateAssignment]
  );

  const extendAssignment = useCallback(
    async (
      assignmentId: string,
      newReturnDate: Date
    ): Promise<Assignment | null> => {
      return updateAssignment(assignmentId, { returnDate: newReturnDate });
    },
    [updateAssignment]
  );

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    acknowledgeAssignment,
    returnAssignment,
    extendAssignment,
  };
};
