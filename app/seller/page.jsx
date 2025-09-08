'use client';
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const AddProduct = () => {
  const [files, setFiles] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [variants, setVariants] = useState([
    { name: "color", options: [{ value: "", additionalPrice: 0 }] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/category/getcategory"
      );
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
        if (data.categories && data.categories.length > 0) {
          setSelectedCategory(data.categories[0]._id);
        }
      } else {
        setError(data.error || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleVariantChange = (variantIndex, optionIndex, field, value) => {
    const updatedVariants = [...variants];
    if (field === "name") {
      // Ensure the variant name is lowercase to match backend validation
      updatedVariants[variantIndex].name = value.toLowerCase();
    } else {
      updatedVariants[variantIndex].options[optionIndex][field] =
        field === "additionalPrice" ? Number(value) : value;
    }
    setVariants(updatedVariants);
  };

  const addVariantOption = (variantIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options.push({
      value: "",
      additionalPrice: 0,
    });
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { name: "color", options: [{ value: "", additionalPrice: 0 }] },
    ]);
  };

  const removeVariantOption = (variantIndex, optionIndex) => {
    const updatedVariants = [...variants];
    if (updatedVariants[variantIndex].options.length > 1) {
      updatedVariants[variantIndex].options.splice(optionIndex, 1);
      setVariants(updatedVariants);
    }
  };

  const removeVariant = (variantIndex) => {
    if (variants.length > 1) {
      const updatedVariants = [...variants];
      updatedVariants.splice(variantIndex, 1);
      setVariants(updatedVariants);
    }
  };

  const validateVariants = () => {
    // Check if at least one variant exists
    if (variants.length === 0) {
      setError("Add at least one variant");
      return false;
    }

    for (const variant of variants) {
      // Check if variant name is valid
      if (!["color", "size"].includes(variant.name.toLowerCase())) {
        setError('Variant name must be either "color" or "size"');
        return false;
      }

      // Check if variant has at least one option
      if (!variant.options || variant.options.length === 0) {
        setError(`Variant '${variant.name}' must include at least one option`);
        return false;
      }

      for (const option of variant.options) {
        // Check if option value is valid
        if (
          !option.value ||
          typeof option.value !== "string" ||
          option.value.trim() === ""
        ) {
          setError("Each option must have a valid value");
          return false;
        }

        // Check if additionalPrice is valid
        if (
          option.additionalPrice !== undefined &&
          (typeof option.additionalPrice !== "number" ||
            option.additionalPrice < 0)
        ) {
          setError("Option additionalPrice must be a non-negative number");
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!mainImage) {
        setError("Main image is required");
        setLoading(false);
        return;
      }

      if (!selectedCategory) {
        setError("Please select a category");
        setLoading(false);
        return;
      }

      // Validate variants before submitting
      if (!validateVariants()) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", selectedCategory);
      formData.append("stock", stock);

      // Stringify the variants array to send as JSON
      formData.append("variants", JSON.stringify(variants));

      // Append main image
      formData.append("mainImg", mainImage);

      // Append additional images
      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      const response = await fetch(
        "http://localhost:5000/api/v1/product/creatproduct",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Product created successfully!");
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setVariants([
          { name: "color", options: [{ value: "", additionalPrice: 0 }] },
        ]);
        setMainImage(null);
        setFiles([]);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess("");
        }, 5000);
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Main Image Upload */}
        <div className="border rounded p-4">
          <p className="text-base font-medium mb-2">Main Image (Required)</p>
          <label htmlFor="mainImg" className="cursor-pointer">
            <input
              onChange={(e) => setMainImage(e.target.files[0])}
              type="file"
              id="mainImg"
              className="hidden"
              required
            />
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg">
              {mainImage ? (
                <Image
                  src={URL.createObjectURL(mainImage)}
                  alt="Main product preview"
                  width={120}
                  height={120}
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="text-center">
                  <span className="block text-4xl mb-1">+</span>
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Additional Images Upload */}
        <div className="border rounded p-4">
          <p className="text-base font-medium mb-2">
            Additional Images (Optional)
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {[...Array(4)].map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="cursor-pointer"
              >
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  className="hidden"
                />
                <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg">
                  {files[index] ? (
                    <Image
                      src={URL.createObjectURL(files[index])}
                      alt={`Additional image ${index + 1}`}
                      width={90}
                      height={90}
                      className="object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-center">
                      <span className="block text-2xl">+</span>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="product-name">
              Product Name *
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Product name"
              className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          {/* Category Selection */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="category">
              Category *
            </label>
            <select
              id="category"
              className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500"
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory}
              required
            >
              {categories.length === 0 ? (
                <option value="">No categories available</option>
              ) : (
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Product Price */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="product-price">
              Price *
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0.00"
              min="1"
              step="0.01"
              className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-medium" htmlFor="stock">
              Stock *
            </label>
            <input
              id="stock"
              type="number"
              placeholder="0"
              min="1"
              className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              required
            />
          </div>
        </div>

        {/* Product Description */}
        <div className="flex flex-col gap-1">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Description *
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none py-2.5 px-3 rounded border border-gray-300 focus:border-orange-500 resize-none"
            placeholder="Product description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        {/* Variants */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-base font-medium">Variants *</p>
            <button
              type="button"
              onClick={addVariant}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm"
            >
              + Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-red-500 text-sm">
              Please add at least one variant
            </p>
          ) : (
            variants.map((variant, variantIndex) => (
              <div
                key={variantIndex}
                className="mb-4 p-3 border rounded bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-medium whitespace-nowrap">
                    Variant Type:
                  </label>
                  <select
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(
                        variantIndex,
                        0,
                        "name",
                        e.target.value
                      )
                    }
                    className="outline-none py-1.5 px-2 rounded border border-gray-300"
                  >
                    <option value="color">Color</option>
                    <option value="size">Size</option>
                  </select>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(variantIndex)}
                      className="ml-auto px-2 py-1 bg-red-100 text-red-600 rounded text-sm"
                    >
                      Remove Variant
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {variant.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`${variant.name} option`}
                        value={option.value}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            optionIndex,
                            "value",
                            e.target.value
                          )
                        }
                        className="outline-none py-1.5 px-2 rounded border border-gray-300 flex-1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Addl. price"
                        value={option.additionalPrice}
                        onChange={(e) =>
                          handleVariantChange(
                            variantIndex,
                            optionIndex,
                            "additionalPrice",
                            e.target.value
                          )
                        }
                        className="outline-none py-1.5 px-2 rounded border border-gray-300 w-24"
                        min="0"
                        step="0.01"
                      />
                      {variant.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeVariantOption(variantIndex, optionIndex)
                          }
                          className="px-2 py-1.5 bg-red-100 text-red-600 rounded"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addVariantOption(variantIndex)}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                >
                  + Add Option
                </button>
              </div>
            ))
          )}
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg disabled:bg-orange-400 transition-colors"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
