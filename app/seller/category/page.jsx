"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const CategoryManager = () => {
  const [categoryImage, setCategoryImage] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/category/getcategories"
      );
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        setError(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch categories. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!name.trim()) {
        setError("Category name is required");
        setLoading(false);
        return;
      }

      if (!categoryImage) {
        setError("Category image is required");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("image", categoryImage);

      const response = await fetch(
        "http://localhost:5000/api/v1/category/createcategory",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Category created successfully!");
        // Reset form
        setName("");
        setCategoryImage(null);
        // Refresh categories list
        fetchCategories();
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Category Form */}
        <div className="border rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Category Name */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="category-name">
                Category Name *
              </label>
              <input
                id="category-name"
                type="text"
                placeholder="Enter category name"
                className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>

            {/* Category Image Upload */}
            <div>
              <p className="text-base font-medium mb-2">
                Category Image (Required)
              </p>
              <label htmlFor="categoryImage" className="cursor-pointer">
                <input
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  type="file"
                  id="categoryImage"
                  className="hidden"
                  required
                />
                <div className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg">
                  {categoryImage ? (
                    <Image
                      src={URL.createObjectURL(categoryImage)}
                      alt="Category preview"
                      width={150}
                      height={150}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="block text-4xl mb-1">+</span>
                      <span className="text-sm text-gray-500">
                        Upload Image
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg disabled:bg-orange-400 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating Category..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* Categories List */}
        <div className="border rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>

          {categories.length === 0 ? (
            <p className="text-gray-500">
              No categories found. Create your first category!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border rounded p-3 flex items-center gap-3"
                >
                  <div className="w-12 h-12 relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
