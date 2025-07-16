"use client";

import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { JSX, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react"; // Add this for a delete icon (optional)
import Image from "next/image";

type FieldOption = {
  label: string;
  value: string;
};

type ProductDetailField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox";
  required: boolean;
  options?: FieldOption[];
  placeholder?: string;
};

type CategoryFormData = {
  name: string;
  description?: string;
  meta_title?: string;
  meta_description?: string;
  cat_image?: FileList;
  cat_banner?: FileList;
  product_details: ProductDetailField[];
};

export default function CategoryForm(): JSX.Element {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      product_details: [],
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "product_details",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Add local state for images
  const [catImageFiles, setCatImageFiles] = useState<File[]>([]);
  const [catBannerFiles, setCatBannerFiles] = useState<File[]>([]);

  // get access token
  const token = localStorage?.getItem("access_token");
  let userData = null;

  // Handle file input change
  const handleCatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCatImageFiles(Array.from(e.target.files));
    }
  };
  const handleCatBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCatBannerFiles(Array.from(e.target.files));
    }
  };

  // Remove image by index
  const removeCatImage = (idx: number) => {
    setCatImageFiles(files => files.filter((_, i) => i !== idx));
  };
  const removeCatBanner = (idx: number) => {
    setCatBannerFiles(files => files.filter((_, i) => i !== idx));
  };

  const onSubmit = async (data: CategoryFormData): Promise<void> => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.meta_title) formData.append("meta_title", data.meta_title);
    if (data.meta_description)
      formData.append("meta_description", data.meta_description);
    if (catImageFiles[0]) formData.append("cat_image", catImageFiles[0]);
    if (catBannerFiles[0]) formData.append("cat_banner", catBannerFiles[0]);
    formData.append("product_details", JSON.stringify(data.product_details));

    if (token) {
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            // "X-API-KEY": API_KEY,
          },
        });
        userData = userResponse.data;
        console.log("User data fetched successfully:", userData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/categories/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Category created successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating category:", error.message);
        setMessage(`Failed to create category: ${error.message}`);
      } else {
        console.error("Unknown error occurred");
        setMessage("Failed to create category due to an unknown error.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = (fieldIndex: number) => {
    const newOption = { label: "", value: "" };
    const currentOptions = watch(`product_details.${fieldIndex}.options`) || [];
    const updatedOptions = [...currentOptions, newOption];
    const updatedField = {
      ...watch(`product_details.${fieldIndex}`),
      options: updatedOptions,
    };
    remove(fieldIndex);
    append(updatedField, {
      focusName: `product_details.${fieldIndex}.options.${
        updatedOptions.length - 1
      }.label`,
    });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = watch(`product_details.${fieldIndex}.options`) || [];
    const updatedOptions = currentOptions.filter(
      (_, idx) => idx !== optionIndex
    );
    const updatedField = {
      ...watch(`product_details.${fieldIndex}`),
      options: updatedOptions,
    };
    remove(fieldIndex);
    append(updatedField);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 py-8 px-2 sm:px-4">
      {/* Header Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex items-center gap-3 bg-green-600 text-white rounded-t-xl px-6 py-4 shadow-md">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Category
          </h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto p-0 shadow-xl rounded-2xl border border-gray-100">
        <CardContent className="p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("name", { required: true })}
                  placeholder="Category name"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">Name is required</p>
                )}
              </div>
              <div>
                <Label>Meta Title</Label>
                <Input
                  {...register("meta_title")}
                  placeholder="Meta title for SEO"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe this category"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Input
                  {...register("meta_description")}
                  placeholder="Meta description for SEO"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Category Image</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    id="cat-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleCatImageChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() =>
                      document.getElementById("cat-image-input")?.click()
                    }>
                    Select Image
                  </Button>
                  <span className="text-xs text-gray-500">
                    (1 image, square preferred)
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {catImageFiles.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-red-100"
                        onClick={() => removeCatImage(idx)}
                        aria-label="Remove image">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Category Banner</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    id="cat-banner-input"
                    type="file"
                    accept="image/*"
                    onChange={handleCatBannerChange}
                    style={{ display: "none" }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-600 text-green-700 hover:bg-green-50"
                    onClick={() =>
                      document.getElementById("cat-banner-input")?.click()
                    }>
                    Select Banner
                  </Button>
                  <span className="text-xs text-gray-500">
                    (Wide banner, optional)
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {catBannerFiles.map((file, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg border border-gray-200"
                        unoptimized
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow hover:bg-red-100"
                        onClick={() => removeCatBanner(idx)}
                        aria-label="Remove image">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Fields */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Label className="text-lg">Product Details Fields</Label>
                <span className="text-xs text-muted-foreground">
                  (Custom fields for products in this category)
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Define the fields that will appear in the product form for this
                category.
              </p>

              {fields.map((field, fieldIndex) => {
                const fieldType = watch(`product_details.${fieldIndex}.type`);
                const showOptions = ["select", "radio", "checkbox"].includes(
                  fieldType
                );
                return (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-100 rounded-xl bg-gray-50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>
                          Field Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g. 'material'"
                          {...register(`product_details.${fieldIndex}.name`, {
                            required: true,
                          })}
                          className="mt-1"
                        />
                        {errors.product_details?.[fieldIndex]?.name && (
                          <p className="text-red-500 text-xs mt-1">
                            Field name is required
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>
                          Display Label <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g. 'Material Type'"
                          {...register(`product_details.${fieldIndex}.label`, {
                            required: true,
                          })}
                          className="mt-1"
                        />
                        {errors.product_details?.[fieldIndex]?.label && (
                          <p className="text-red-500 text-xs mt-1">
                            Label is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>
                          Field Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(
                            value: ProductDetailField["type"]
                          ) => {
                            const updatedField = {
                              ...watch(`product_details.${fieldIndex}`),
                              type: value,
                            };
                            remove(fieldIndex);
                            append(updatedField);
                          }}
                          value={fieldType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                            <SelectItem value="select">Dropdown</SelectItem>
                            <SelectItem value="radio">Radio Buttons</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${fieldIndex}`}
                            {...register(
                              `product_details.${fieldIndex}.required`
                            )}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <Label htmlFor={`required-${fieldIndex}`}>
                            Required Field
                          </Label>
                        </div>
                      </div>
                    </div>
                    {fieldType === "text" && (
                      <div>
                        <Label>Placeholder (optional)</Label>
                        <Input
                          placeholder="e.g. 'Enter material type'"
                          {...register(
                            `product_details.${fieldIndex}.placeholder`
                          )}
                          className="mt-1"
                        />
                      </div>
                    )}
                    {showOptions && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="space-y-2">
                          {watch(`product_details.${fieldIndex}.options`)?.map(
                            (option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex gap-2 items-center">
                                <Input
                                  placeholder="Option label"
                                  {...register(
                                    `product_details.${fieldIndex}.options.${optionIndex}.label`,
                                    {
                                      required: true,
                                    }
                                  )}
                                  className="mt-1"
                                />
                                <Input
                                  placeholder="Option value"
                                  {...register(
                                    `product_details.${fieldIndex}.options.${optionIndex}.value`,
                                    {
                                      required: true,
                                    }
                                  )}
                                  className="mt-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50"
                                  onClick={() =>
                                    removeOption(fieldIndex, optionIndex)
                                  }>
                                  Remove
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-700 hover:bg-green-50"
                          onClick={() => addOption(fieldIndex)}>
                          Add Option
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="hover:bg-red-100"
                        onClick={() => remove(fieldIndex)}>
                        Remove Field
                      </Button>
                    </div>
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={() =>
                  append({
                    name: "",
                    label: "",
                    type: "text",
                    required: false,
                    options: [],
                  })
                }>
                Add Product Field
              </Button>
            </div>

            {/* Sticky Submit Bar for Mobile */}
            <div className="sticky bottom-0 left-0 w-full bg-gradient-to-r from-green-600 to-green-500 px-0 py-4 rounded-b-xl flex justify-center shadow-lg z-10 mt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-xs bg-white text-green-700 font-bold text-lg py-3 rounded-xl shadow hover:bg-green-50 border-2 border-green-600 transition-all">
                {isSubmitting ? "Submitting..." : "Create Category"}
              </Button>
            </div>

            {message && (
              <p className="text-sm text-center mt-4 font-semibold text-green-700">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
