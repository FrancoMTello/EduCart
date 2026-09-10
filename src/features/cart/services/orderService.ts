import axiosInstance from "@/lib/axiosInstance"

type OrderItemCreate = {
  product_id: number
  quantity: number
}

type OrderCreate = {
  items: OrderItemCreate[]
}

export type OrderRead = {
  id: number
  user_id: number
  status: string
  total: number
  created_at: string
  items: {
    id: number
    product_id: number
    product_name: string
    product_price: number
    quantity: number
    subtotal: number
  }[]
}

export const orderService = {
  create: async (data: OrderCreate): Promise<OrderRead> => {
    const response = await axiosInstance.post("/orders/", data)
    return response.data
  },

  getMyOrders: async (): Promise<OrderRead[]> => {
    const response = await axiosInstance.get("/orders/my-orders")
    return response.data
  }
}