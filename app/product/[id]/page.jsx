"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams, useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import axios from "axios";
import React from "react";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
  const { id } = useParams();
  const router = useRouter();
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, cartLoading } = useAppContext();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // 1️⃣ Fetch the specific product
        const productResponse = await axios.get(
          `http://localhost:5000/api/v1/product/${id}`
        );
        
        if (productResponse.data.product) {
          const product = productResponse.data.product;
          setProductData(product);
          setMainImage(
            product.mainImg || product.images?.[0] || "/placeholder.png"
          );
          
          // 2️⃣ Fetch related products (products from the same category)
          const relatedResponse = await axios.get(
            `http://localhost:5000/api/v1/product/productlist?category=${product.category}&limit=5`
          );
          setRelatedProducts(relatedResponse.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        
        // Fallback: try to fetch from productlist API
        try {
          const res = await axios.get(
            `http://localhost:5000/api/v1/product/productlist?limit=1000`
          );
          const product = res.data.products.find((p) => p._id === id);
          if (product) {
            setProductData(product);
            setMainImage(
              product.mainImg || product.images?.[0] || "/placeholder.png"
            );
            
            // Get some random products as fallback
            setRelatedProducts(res.data.products.slice(0, 5));
          }
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleAddToCart = async () => {
    const success = await addToCart(productData._id, 1);
    if (success) {
      alert('Product added to cart successfully!');
    } else {
      alert('Please login to add items to cart');
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(productData._id, 1);
    if (success) {
      router.push("/cart");
    } else {
      alert('Please login to purchase items');
    }
  };

  if (loading) return <Loading />;
  if (!productData) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Images */}
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <img
                src={mainImage}
                alt={productData.title}
                className="w-full h-auto object-cover mix-blend-multiply"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.images?.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <img
                    src={image}
                    alt={`${productData.title} ${index + 1}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.title}
            </h1>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">${productData.price}</p>
            
            {/* Stock Information */}
            <p className="text-sm text-gray-500 mt-2">
              {productData.stock > 0 ? `${productData.stock} in stock` : 'Out of stock'}
            </p>
            
            <hr className="bg-gray-600 my-6" />

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || productData.stock <= 0}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={cartLoading || productData.stock <= 0}
                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cartLoading ? 'Adding...' : 'Buy now'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Related{" "}
              <span className="font-medium text-orange-600">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
          </div>
          
          {relatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                {relatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <button 
                onClick={() => router.push("/all-products")}
                className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
              >
                See more
              </button>
            </>
          ) : (
            <p className="text-gray-500 py-8">No related products found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
