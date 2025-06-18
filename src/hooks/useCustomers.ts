import { useState, useCallback } from "react";

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: any[];
  returnRequests?: any[];
}

export interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  fetchCustomers: (limit?: number, offset?: number) => Promise<void>;
  fetchCustomer: (customerId: string) => Promise<Customer | null>;
  createCustomer: (
    customerData: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
  ) => Promise<Customer | null>;
  updateCustomer: (
    customerId: string,
    customerData: Partial<Customer>
  ) => Promise<Customer | null>;
  deleteCustomer: (customerId: string) => Promise<boolean>;
  searchCustomers: (searchTerm: string) => Promise<Customer[]>;
}

export const useCustomers = (): UseCustomersReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (limit?: number, offset?: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetCustomers($limit: Int, $offset: Int) {
              customers(limit: $limit, offset: $offset) {
                customerId
                name
                email
                phone
                address
                createdAt
                updatedAt
                orders {
                  orderId
                  orderDate
                  orderStatus
                  totalAmount
                }
                returnRequests {
                  returnId
                  requestDate
                  returnStatus
                }
              }
            }
          `,
            variables: { limit, offset },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setCustomers(result.data.customers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch customers"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCustomer = useCallback(
    async (customerId: string): Promise<Customer | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetCustomer($customerId: ID!) {
              customer(customerId: $customerId) {
                customerId
                name
                email
                phone
                address
                createdAt
                updatedAt
                orders {
                  orderId
                  orderDate
                  orderStatus
                  totalAmount
                  orderItems {
                    orderItemId
                    quantity
                    price
                    product {
                      productId
                      name
                      category
                    }
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
            variables: { customerId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.customer;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch customer"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCustomer = useCallback(
    async (
      customerData: Omit<Customer, "customerId" | "createdAt" | "updatedAt">
    ): Promise<Customer | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateCustomer($input: CreateCustomerInput!) {
              createCustomer(input: $input) {
                customerId
                name
                email
                phone
                address
                createdAt
                updatedAt
              }
            }
          `,
            variables: { input: customerData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newCustomer = result.data.createCustomer;
        setCustomers((prev) => [...prev, newCustomer]);
        return newCustomer;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create customer"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCustomer = useCallback(
    async (
      customerId: string,
      customerData: Partial<Customer>
    ): Promise<Customer | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateCustomer($customerId: ID!, $input: UpdateCustomerInput!) {
              updateCustomer(customerId: $customerId, input: $input) {
                customerId
                name
                email
                phone
                address
                createdAt
                updatedAt
              }
            }
          `,
            variables: { customerId, input: customerData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedCustomer = result.data.updateCustomer;
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.customerId === customerId ? updatedCustomer : customer
          )
        );
        return updatedCustomer;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update customer"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCustomer = useCallback(
    async (customerId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteCustomer($customerId: ID!) {
              deleteCustomer(customerId: $customerId)
            }
          `,
            variables: { customerId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteCustomer) {
          setCustomers((prev) =>
            prev.filter((customer) => customer.customerId !== customerId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete customer"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchCustomers = useCallback(
    async (searchTerm: string): Promise<Customer[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query SearchCustomers($searchTerm: String!) {
              searchCustomers(searchTerm: $searchTerm) {
                customerId
                name
                email
                phone
                address
                createdAt
                updatedAt
              }
            }
          `,
            variables: { searchTerm },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.searchCustomers;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search customers"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
  };
};
