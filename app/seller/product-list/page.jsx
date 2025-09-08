'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/v1/product/productlist?limit=100"
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const getCategoryName = (categoryId) => {
    // This is a placeholder - you might want to fetch categories or map IDs to names
    if (typeof categoryId === 'object' && categoryId.name) {
      return categoryId.name;
    }
    return "Uncategorized";
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <Loading />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen flex flex-col justify-between">
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium">All Products</h2>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products ({products.length})</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                  <th className="px-4 py-3 font-medium truncate">Price</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Stock</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Status</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={product._id || index} className="border-t border-gray-500/20 hover:bg-gray-50">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-2">
                        <img
                          src={product.mainImg || "/placeholder.png"}
                          alt="product Image"
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <span className="truncate w-full">
                        {product.title || "Untitled Product"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {getCategoryName(product.category)}
                    </td>
                    <td className="px-4 py-3">${product.price || "N/A"}</td>
                    <td className="px-4 py-3 max-sm:hidden">
                      {product.stock || 0}
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : product.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">
                      <button 
                        onClick={() => router.push(`/seller/product/${product._id}`)}
                        className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                      >
                        <span className="hidden md:block">View</span>
                        <Image
                          className="h-3.5"
                          src={assets.redirect_icon}
                          alt="redirect_icon"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;