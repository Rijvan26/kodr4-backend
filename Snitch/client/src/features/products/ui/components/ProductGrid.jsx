import { ProductCard } from "./ProductCard";

export const ProductGrid = ({
  products = [],
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="aspect-[4/5] bg-gray-200 animate-pulse" />

            <div className="mt-3 h-3 w-1/3 bg-gray-200 animate-pulse" />

            <div className="mt-2 h-4 w-3/4 bg-gray-200 animate-pulse" />

            <div className="mt-2 h-4 w-1/4 bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-medium">
          Something went wrong
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {error}
        </p>
      </div>
    );
  }

  console.log(products)

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-lg font-medium">
          No products found
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Try another category or search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};