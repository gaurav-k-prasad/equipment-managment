import { useState, useCallback } from "react";
import { ProductStatus } from "@prisma/client";

export interface Product {
  productId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  status: ProductStatus;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  orderItems?: any[];
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (
    category?: string,
    status?: ProductStatus,
    limit?: number,
    offset?: number
  ) => Promise<void>;
  fetchProduct: (productId: string) => Promise<Product | null>;
  createProduct: (
    productData: Omit<Product, "productId" | "createdAt" | "updatedAt">
  ) => Promise<Product | null>;
  updateProduct: (
    productId: string,
    productData: Partial<Product>
  ) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateStockQuantity: (
    productId: string,
    quantity: number
  ) => Promise<Product | null>;
  updateProductStatus: (
    productId: string,
    status: ProductStatus
  ) => Promise<Product | null>;
  searchProducts: (searchTerm: string) => Promise<Product[]>;
  getProductsByCategory: (category: string) => Promise<Product[]>;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (
      category?: string,
      status?: ProductStatus,
      limit?: number,
      offset?: number
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetProducts($category: String, $status: ProductStatus, $limit: Int, $offset: Int) {
              products(category: $category, status: $status, limit: $limit, offset: $offset) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
                createdAt
                updatedAt
                orderItems {
                  orderItemId
                  quantity
                  price
                  order {
                    orderId
                    orderDate
                    orderStatus
                  }
                }
              }
            }
          `,
            variables: { category, status, limit, offset },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        setProducts(result.data.products);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProduct = useCallback(
    async (productId: string): Promise<Product | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetProduct($productId: ID!) {
              product(productId: $productId) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
                createdAt
                updatedAt
                orderItems {
                  orderItemId
                  quantity
                  price
                  order {
                    orderId
                    orderDate
                    orderStatus
                    customer {
                      customerId
                      name
                      email
                    }
                  }
                }
              }
            }
          `,
            variables: { productId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.product;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createProduct = useCallback(
    async (
      productData: Omit<Product, "productId" | "createdAt" | "updatedAt">
    ): Promise<Product | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation CreateProduct($input: CreateProductInput!) {
              createProduct(input: $input) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
                createdAt
                updatedAt
              }
            }
          `,
            variables: { input: productData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const newProduct = result.data.createProduct;
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create product"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (
      productId: string,
      productData: Partial<Product>
    ): Promise<Product | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation UpdateProduct($productId: ID!, $input: UpdateProductInput!) {
              updateProduct(productId: $productId, input: $input) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
                createdAt
                updatedAt
              }
            }
          `,
            variables: { productId, input: productData },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const updatedProduct = result.data.updateProduct;
        setProducts((prev) =>
          prev.map((product) =>
            product.productId === productId ? updatedProduct : product
          )
        );
        return updatedProduct;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update product"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(
    async (productId: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            mutation DeleteProduct($productId: ID!) {
              deleteProduct(productId: $productId)
            }
          `,
            variables: { productId },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        if (result.data.deleteProduct) {
          setProducts((prev) =>
            prev.filter((product) => product.productId !== productId)
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete product"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateStockQuantity = useCallback(
    async (productId: string, quantity: number): Promise<Product | null> => {
      return updateProduct(productId, { stockQuantity: quantity });
    },
    [updateProduct]
  );

  const updateProductStatus = useCallback(
    async (
      productId: string,
      status: ProductStatus
    ): Promise<Product | null> => {
      return updateProduct(productId, { status });
    },
    [updateProduct]
  );

  const searchProducts = useCallback(
    async (searchTerm: string): Promise<Product[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query SearchProducts($searchTerm: String!) {
              searchProducts(searchTerm: $searchTerm) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
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

        return result.data.searchProducts;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search products"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProductsByCategory = useCallback(
    async (category: string): Promise<Product[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/graphql`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
            query GetProductsByCategory($category: String!) {
              products(category: $category) {
                productId
                name
                description
                category
                price
                status
                stockQuantity
                createdAt
                updatedAt
              }
            }
          `,
            variables: { category },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        return result.data.products;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch products by category"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStockQuantity,
    updateProductStatus,
    searchProducts,
    getProductsByCategory,
  };
};
