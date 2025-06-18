import { useState, useCallback } from "react";
import { OrderStatus } from "@prisma/client";

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  product?: any;
  order?: any;
}

export interface Order {
  orderId: string;
  customerId: string;
  orderDate: Date;
  orderStatus: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: OrderItem[];
  customer?: any;
  returnRequests?: any[];
}

export interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: (
    customerId?: string,
    status?: OrderStatus,
    dateFrom?: Date,
    dateTo?: Date
  ) => Promise<void>;
  fetchOrder: (orderId: string) => Promise<Order | null>;
  createOrder: (
    orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt"> & {
      items: Omit<OrderItem, "orderItemId" | "orderId" | "createdAt">[];
    }
  ) => Promise<Order | null>;
  updateOrder: (
    orderId: string,
    orderData: Partial<Order>
  ) => Promise<Order | null>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => Promise<Order | null>;
  confirmOrder: (orderId: string) => Promise<Order | null>;
  shipOrder: (orderId: string) => Promise<Order | null>;
  deliverOrder: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<Order | null>;
  addOrderItem: (
    orderId: string,
    item: Omit<OrderItem, "orderItemId" | "orderId" | "createdAt">
  ) => Promise<Order | null>;
  removeOrderItem: (orderItemId: string) => Promise<Order | null>;
  updateOrderItemQuantity: (
    orderItemId: string,
    quantity: number
  ) => Promise<Order | null>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(
    async (
      customerId?: string,
      status?: OrderStatus,
      dateFrom?: Date,
      dateTo?: Date
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetOrders($customerId: ID, $status: OrderStatus, $dateFrom: DateTime, $dateTo: DateTime) {
              orders(customerId: $customerId, status: $status, dateFrom: $dateFrom, dateTo: $dateTo) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                createdAt
                updatedAt
                customer {
                  customerId
                  name
                  email
                  phone
                }
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                    price
                  }
                }
                returnRequests {
                  returnId
                  requestDate
                  returnStatus
                }
              }
            }
          `,
            variables: { customerId, status, dateFrom, dateTo },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setOrders(result.data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetOrder($orderId: ID!) {
              order(orderId: $orderId) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                createdAt
                updatedAt
                customer {
                  customerId
                  name
                  email
                  phone
                  address
                }
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    description
                    category
                    price
                    status
                    stockQuantity
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
            variables: { orderId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.order;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createOrder = useCallback(
    async (
      orderData: Omit<Order, "orderId" | "createdAt" | "updatedAt"> & {
        items: Omit<OrderItem, "orderItemId" | "orderId" | "createdAt">[];
      }
    ): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateOrder($input: CreateOrderInput!) {
              createOrder(input: $input) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                createdAt
                updatedAt
                customer {
                  customerId
                  name
                  email
                }
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                  }
                }
              }
            }
          `,
            variables: { input: orderData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newOrder = result.data.createOrder;
        setOrders((prev) => [...prev, newOrder]);
        return newOrder;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create order");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateOrder = useCallback(
    async (
      orderId: string,
      orderData: Partial<Order>
    ): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateOrder($orderId: ID!, $input: UpdateOrderInput!) {
              updateOrder(orderId: $orderId, input: $input) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                createdAt
                updatedAt
                customer {
                  customerId
                  name
                  email
                }
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                  }
                }
              }
            }
          `,
            variables: { orderId, input: orderData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedOrder = result.data.updateOrder;
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? updatedOrder : order
          )
        );
        return updatedOrder;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update order");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/graphql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation DeleteOrder($orderId: ID!) {
              deleteOrder(orderId: $orderId)
            }
          `,
          variables: { orderId },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.deleteOrder) {
        setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete order");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<Order | null> => {
      return updateOrder(orderId, { orderStatus: status });
    },
    [updateOrder]
  );

  const confirmOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      return updateOrderStatus(orderId, OrderStatus.CONFIRMED);
    },
    [updateOrderStatus]
  );

  const shipOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      return updateOrderStatus(orderId, OrderStatus.SHIPPED);
    },
    [updateOrderStatus]
  );

  const deliverOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      return updateOrderStatus(orderId, OrderStatus.DELIVERED);
    },
    [updateOrderStatus]
  );

  const cancelOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      return updateOrderStatus(orderId, OrderStatus.CANCELLED);
    },
    [updateOrderStatus]
  );

  const addOrderItem = useCallback(
    async (
      orderId: string,
      item: Omit<OrderItem, "orderItemId" | "orderId" | "createdAt">
    ): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation AddOrderItem($orderId: ID!, $input: CreateOrderItemInput!) {
              addOrderItem(orderId: $orderId, input: $input) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                  }
                }
              }
            }
          `,
            variables: { orderId, input: item },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedOrder = result.data.addOrderItem;
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? updatedOrder : order
          )
        );
        return updatedOrder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to add order item"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeOrderItem = useCallback(
    async (orderItemId: string): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation RemoveOrderItem($orderItemId: ID!) {
              removeOrderItem(orderItemId: $orderItemId) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                  }
                }
              }
            }
          `,
            variables: { orderItemId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedOrder = result.data.removeOrderItem;
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          )
        );
        return updatedOrder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to remove order item"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateOrderItemQuantity = useCallback(
    async (orderItemId: string, quantity: number): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateOrderItemQuantity($orderItemId: ID!, $quantity: Int!) {
              updateOrderItemQuantity(orderItemId: $orderItemId, quantity: $quantity) {
                orderId
                customerId
                orderDate
                orderStatus
                totalAmount
                orderItems {
                  orderItemId
                  productId
                  quantity
                  price
                  product {
                    productId
                    name
                    category
                  }
                }
              }
            }
          `,
            variables: { orderItemId, quantity },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedOrder = result.data.updateOrderItemQuantity;
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          )
        );
        return updatedOrder;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update order item quantity"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus,
    confirmOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    addOrderItem,
    removeOrderItem,
    updateOrderItemQuantity,
  };
};
