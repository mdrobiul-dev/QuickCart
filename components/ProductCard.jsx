import React from "react";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  // safe fallbacks using your schema
  const imageUrl =
    product?.mainImg || product?.images?.[0] || "/placeholder.png";
  const title = product?.title || "Untitled";
  const description = product?.description || "No description available";
  const price = product?.price ?? "N/A";

  return (
    <div
      onClick={() => {
        if (product?._id) {
          router.push("/product/" + product._id);
          scrollTo(0, 0);
        }
      }}
      className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
    >
      {/* Product Image */}
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          <img className="h-3 w-3" src={assets.heart_icon} alt="heart_icon" />
        </button>
      </div>

      {/* Product Info */}
      <p className="md:text-base font-medium pt-2 w-full truncate">{title}</p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {description}
      </p>

      {/* Rating (currently static, backend doesn’t provide rating field) */}
      <div className="flex items-center gap-2">
        <p className="text-xs">4.5</p>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              className="h-3 w-3"
              src={
                index < Math.floor(4) ? assets.star_icon : assets.star_dull_icon
              }
              alt="star_icon"
            />
          ))}
        </div>
      </div>

      {/* Price & Button */}
      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency}
          {price}
        </p>
        <button className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
