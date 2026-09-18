import axiosInstance from "@/lib/axiosInstance"
import type { Product } from "@/features/products/types/Product"

// Mapea los campos del backend al formato del frontend
const mapProduct = (p: any): Product => ({
  ...p,
  imageSrc: p.image_url,
  imageAlt: p.name,
})

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/")
    return response.data.map(mapProduct)
  },

  getById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`)
    return mapProduct(response.data)
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    // Convierte imageSrc a image_url si fuera necesario actualizar imagen
    const payload: any = { ...data };
    if (data.imageSrc) {
      payload.image_url = data.imageSrc;
      delete payload.imageSrc;
    }
    const response = await axiosInstance.patch(`/products/${id}`, payload);
    return {
      ...response.data,
      imageSrc: response.data.image_url,
      imageAlt: response.data.name,
    };
  },


  create: async (productData: Omit<Product, "id">): Promise<Product> => {
    // Convertimos imageSrc a image_url para enviar al backend en FastAPI
    const payload = {
      ...productData,
      image_url: productData.imageSrc,
    };

    const response = await axiosInstance.post("/products/", payload);
    return {
      ...response.data,
      imageSrc: response.data.image_url,
      imageAlt: response.data.name,
    };
  },
};
