import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export const ProductCard = ({ product }) => {
  if (!product) return null;

  const id = product._id;

  const image =
    product.images?.[0]?.url ||
    "https://via.placeholder.com/600x750?text=No+Image";

  const price = product.price?.amount ?? 0;
  const currency = product.price?.currency ?? "INR";

  const formattedPrice =
    currency === "INR"
      ? `₹${Number(price).toLocaleString("en-IN")}`
      : `${currency} ${Number(price).toFixed(2)}`;

  const isOutOfStock =
    product.sizes?.length > 0 &&
    product.sizes.every((size) => size.stock <= 0);

  return (
    <article className="group">
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/5]">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          className="
            absolute top-3 right-3
            w-9 h-9
            bg-white/90
            rounded-full
            flex items-center justify-center
            hover:bg-white
            transition
          "
        >
          <Heart size={17} strokeWidth={1.5} />
        </button>

        {/* Stock badge */}
        {isOutOfStock && (
          <span
            className="
              absolute bottom-3 left-3
              bg-black text-white
              px-3 py-1
              text-xs
            "
          >
            Sold Out
          </span>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.categories?.[0]}
        </p>

        <Link to={`/products/${id}`}>
          <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-1">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold">
            {formattedPrice}
          </p>

          {product.sizes?.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.sizes
                .filter((size) => size.stock > 0)
                .map((size) => size.size)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};