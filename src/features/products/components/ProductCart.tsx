interface ProductCartProps {
  name: string;
  imageSrc: string;
  price: string;
  color: string;
}

const ProductCard = ({
  name,
  imageSrc,
  price,
  color,
}: ProductCartProps) => {
  return (
    <div className="group relative">
      <div className="overflow-hidden rounded-xl bg-gray-200">
        <img
          src={imageSrc}
          alt={name}
          className="h-80 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {color}
          </p>
        </div>

        <p className="text-sm font-semibold text-gray-900">
          {price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;