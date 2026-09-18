// src/features/dashboard/services/dashboardService.ts
import axiosInstance from "@/lib/axiosInstance";

export type TopProductStats = {
  name: string;
  total_sold: number;
};

export type CategoryDistributionStats = {
  category: string;
  count: number;
  total_stock: number;
};

export type LowStockProductStats = {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock_actual: number;
  stock_minimo: number;
  status: string;
};

export type DashboardStats = {
  total_orders: number;
  total_sales: number;
  low_stock_count: number;
  inventory_value: number;
  top_products: TopProductStats[];
  category_distribution: CategoryDistributionStats[];
  low_stock_products: LowStockProductStats[];
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get("/dashboard/stats");
    return response.data;
  },
};