// src/features/dashboard/services/orderService.ts
import axiosInstance from "@/lib/axiosInstance";

export type OrderItemDTO = {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

export type OrderDTO = {
  id: number;
  user_id: number;
  status: string;
  total: number;
  created_at: string;
  items: OrderItemDTO[];
};

export const orderService = {
  getAll: async (): Promise<OrderDTO[]> => {
    const response = await axiosInstance.get("/orders/");
    return response.data;
  },
};