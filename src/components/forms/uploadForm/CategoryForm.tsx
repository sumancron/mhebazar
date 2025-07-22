"use client";

import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { JSX, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Image as ImageIcon } from "lucide-react";
// import Image from "next/image";
import Cookies from "js-cookie";

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
  const [catImageFiles, setCatImageFiles] = useState<File[]>([]);
  const [catBannerFiles, setCatBannerFiles] = useState<File[]>([]);

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

    let token = Cookies.get("access_token");

    if (!token) {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/token/refresh/`,
        {},
        { withCredentials: true } // refresh_token read from HttpOnly cookie
      );

      token = refreshResponse.data?.access;

      if (token) {
        Cookies.set("access_token", token, {
          expires: 1 / 24, // 1 hour
          secure: true,
          sameSite: "Lax",
        });
      } else {
        throw new Error("No new access token returned");
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
      focusName: `product_details.${fieldIndex}.options.${updatedOptions.length - 1
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Create New Category</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("name", { required: true })}
                    placeholder="Enter category name"
                    className="h-10 border-gray-300 text-sm"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Name is required</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Meta Title
                  </Label>
                  <Input
                    {...register("meta_title")}
                    placeholder="Meta title for SEO"
                    className="h-10 border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Description
                </Label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe this category..."
                  className="border-gray-300 min-h-[80px] text-sm resize-none"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Meta Description
                </Label>
                <Input
                  {...register("meta_description")}
                  placeholder="Meta description for SEO"
                  className="h-10 border-gray-300 text-sm"
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4">
              {/* Category Image Upload */}
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Category Image</Label>
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
                  size="sm"
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                  onClick={() => document.getElementById("cat-image-input")?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
                {catImageFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {catImageFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeCatImage(idx)}
                          aria-label="Remove image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Banner Upload */}
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Category Banner</Label>
                <input
                  id="cat-banner-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleCatBannerChange}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                  onClick={() => document.getElementById("cat-banner-input")?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Banner(s)
                </Button>
                {catBannerFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {catBannerFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeCatBanner(idx)}
                          aria-label="Remove image"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Fields */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h2 className="text-md font-semibold text-gray-800">Product Detail Fields</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      label: "",
                      type: "text",
                      required: false,
                      options: [],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>


              <div className="space-y-4">
                {fields.map((field, fieldIndex) => {
                  const fieldType = watch(`product_details.${fieldIndex}.type`);
                  const showOptions = ["select", "radio", "checkbox"].includes(fieldType);

                  return (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">
                            Field Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. 'material'"
                            {...register(`product_details.${fieldIndex}.name`, { required: true })}
                            className="h-10 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">
                            Display Label <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. 'Material Type'"
                            {...register(`product_details.${fieldIndex}.label`, { required: true })}
                            className="h-10 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Field Type</Label>
                          <Select
                            onValueChange={(value: ProductDetailField["type"]) => {
                              const updatedField = {
                                ...watch(`product_details.${fieldIndex}`),
                                type: value,
                              };
                              remove(fieldIndex);
                              append(updatedField);
                            }}
                            value={fieldType}>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
                              <SelectValue placeholder="Select field type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="radio">Radio</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`required-${fieldIndex}`}
                              {...register(`product_details.${fieldIndex}.required`)}
                              className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor={`required-${fieldIndex}`} className="text-sm font-medium">
                              Required
                            </Label>
                          </div>
                        </div>
                      </div>

                      {showOptions && (
                        <div className="space-y-3 pt-2">
                          <Label className="text-sm text-gray-600 block">Options</Label>
                          {watch(`product_details.${fieldIndex}.options`)?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 items-center">
                              <Input
                                placeholder="Label"
                                {...register(`product_details.${fieldIndex}.options.${optionIndex}.label`)}
                                className="h-10 border-gray-300 text-sm"
                              />
                              <Input
                                placeholder="Value"
                                {...register(`product_details.${fieldIndex}.options.${optionIndex}.value`)}
                                className="h-10 border-gray-300 text-sm"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:bg-red-50"
                                onClick={() => removeOption(fieldIndex, optionIndex)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(fieldIndex)}
                          >
                            Add Option
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-end pt-3 border-t">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => remove(fieldIndex)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove Field
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>

              {message && (
                <div className={`p-3 mt-4 rounded text-center text-xs ${message.includes("successfully")
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>{message}</div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}