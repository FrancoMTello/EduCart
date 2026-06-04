





import type { Product } from "../types/Product";


export const products: Product[] = [
  {
    id: 1,
    sku: "BOOK-001",
    name: "Clean Code",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg",
    imageAlt: "Libro Clean Code",
    price: 35000,
    color: "Negro",
    category: "Study Materials",
    rating: 5,
    stock_actual: 15,
    stock_minimo: 5,
  },
  {
    id: 2,
    sku: "CALC-001",
    name: "Calculadora Científica",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg",
    imageAlt: "Calculadora científica",
    price: 25000,
    color: "Negro",
    category: "Tech Tools",
    rating: 4,
    stock_actual: 8,
    stock_minimo: 10,
  },
  {
    id: 3,
    sku: "TAB-001",
    name: "Tablet Educativa",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg",
    imageAlt: "Tablet educativa",
    price: 180000,
    color: "Gris",
    category: "Tech Tools",
    rating: 5,
    stock_actual: 3,
    stock_minimo: 5,
  },
  {
    id: 4,
    sku: "ROBO-001",
    name: "Kit de Robótica",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg",
    imageAlt: "Kit de robótica",
    price: 95000,
    color: "Multicolor",
    category: "Tech Tools",
    rating: 4,
    stock_actual: 0,
    stock_minimo: 5,
  },
];