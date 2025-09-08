import React from "react";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }) => {
  const router = useRouter();

  // Safe fallbacks using your schema
  const imageUrl = product?.mainImg || "/placeholder.png";
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
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden shadow-md">
        <img
          src={imageUrl}
          alt={title}
          className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
        />
      </div>

      {/* Product Info */}
      <p className="md:text-base font-medium pt-2 w-full truncate">{title}</p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {description}
      </p>

      {/* Price & Button */}
      <div className="flex items-end justify-between w-full mt-1">
        <p className="text-base font-medium">
          ${price}
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (product?._id) {
              router.push("/product/" + product._id);
            }
          }}
          className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition shadow-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
