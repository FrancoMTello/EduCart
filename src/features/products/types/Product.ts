export interface Product {
  id: number;
  sku: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  price: number;
  color: string;
  category: string;
  rating: number;
  stock_actual: number;
  stock_minimo: number;
}