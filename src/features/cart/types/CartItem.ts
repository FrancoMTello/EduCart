import type { Product } from "@/features/products/types/Product"; 

export interface CartItem {
  product: Product;
  quantity: number;
}