import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group">
      <div className="overflow-hidden rounded-xl bg-gray-200">
        <img
          src={product.imageSrc}
          alt={product.imageAlt}
          className="h-80 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500">
            {product.color}
          </p>
        </div>

        <p className="font-semibold text-gray-900">
          ${product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;