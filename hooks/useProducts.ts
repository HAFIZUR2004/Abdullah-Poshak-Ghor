"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  images?: string[];
  image?: string;
  category: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  discount?: number;
  tags?: string[];
  createdAt?: string;
  stock?: number;
  status?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data: ApiProduct[] = await response.json();

        const formattedProducts: Product[] = data.map((product) => ({
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          description: product.description,
          images: product.images,
          image: product.image,
          category: product.category,
          brand: product.brand,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.inStock,
          discount: product.discount,
          tags: product.tags,
          createdAt: product.createdAt,
          stock: product.stock,
          status: product.status,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}
