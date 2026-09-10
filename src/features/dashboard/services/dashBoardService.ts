import axiosInstance from "@/lib/axiosInstance"

export type DashboardStats = {
  total_orders: number
  total_sales: number
  low_stock_count: number
  inventory_value: number
  top_products: { name: string; total_sold: number }[]
  category_distribution: { category: string; count: number; total_stock: number }[]
  low_stock_products: {
    id: number
    sku: string
    name: string
    category: string
    stock_actual: number
    stock_minimo: number
    status: string
  }[]
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get("/dashboard/stats")
    return response.data
  }
}