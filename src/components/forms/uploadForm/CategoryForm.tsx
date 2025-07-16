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
import { X, Plus, Folder, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-2 sm:px-4">
      {/* Header Bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex items-center gap-4 bg-gradient-to-r from-[#5CA131] to-[#47881F] text-white rounded-xl px-8 py-6 shadow-lg">
          <div className="bg-white/20 p-3 rounded-lg">
            <Folder className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Category
            </h1>
            <p className="text-white/90 mt-1">
              Define a new product category with custom fields
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto shadow-2xl rounded-2xl border-0 overflow-hidden">
        <CardContent className="p-8 sm:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="bg-[#5CA131] p-2 rounded-lg">
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("name", { required: true })}
                    placeholder="Enter category name"
                    className="h-12 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">Name is required</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meta Title
                  </Label>
                  <Input
                    {...register("meta_title")}
                    placeholder="Meta title for SEO"
                    className="h-12 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Describe this category..."
                    className="min-h-[100px] border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Meta Description
                  </Label>
                  <Input
                    {...register("meta_description")}
                    placeholder="Meta description for SEO"
                    className="h-12 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="bg-[#5CA131] p-2 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Images</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Category Image
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
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
                        className="h-12 px-6 bg-white border-2 border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white transition-all"
                        onClick={() =>
                          document.getElementById("cat-image-input")?.click()
                        }>
                        <Plus className="w-4 h-4 mr-2" />
                        Select Image
                      </Button>
                      <span className="text-sm text-gray-500">
                        Square format preferred
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {catImageFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                            onClick={() => removeCatImage(idx)}
                            aria-label="Remove image">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Category Banner
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
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
                        className="h-12 px-6 bg-white border-2 border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white transition-all"
                        onClick={() =>
                          document.getElementById("cat-banner-input")?.click()
                        }>
                        <Plus className="w-4 h-4 mr-2" />
                        Select Banner
                      </Button>
                      <span className="text-sm text-gray-500">
                        Wide format optional
                      </span>
                    </div>
                    <div className="flex gap-3">
                      {catBannerFiles.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                            onClick={() => removeCatBanner(idx)}
                            aria-label="Remove image">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Fields */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-[#5CA131] p-2 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Product Detail Fields</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Define custom fields for products in this category
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  className="bg-[#5CA131] hover:bg-[#47881F] text-white px-6 py-3 rounded-lg shadow-lg transition-all"
                  onClick={() =>
                    append({
                      name: "",
                      label: "",
                      type: "text",
                      required: false,
                      options: [],
                    })
                  }>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-6">
                {fields.map((field, fieldIndex) => {
                  const fieldType = watch(`product_details.${fieldIndex}.type`);
                  const showOptions = ["select", "radio", "checkbox"].includes(fieldType);

                  return (
                    <div
                      key={field.id}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Field Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. 'material'"
                            {...register(`product_details.${fieldIndex}.name`, {
                              required: true,
                            })}
                            className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                          />
                          {errors.product_details?.[fieldIndex]?.name && (
                            <p className="text-red-500 text-sm mt-1">
                              Field name is required
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Display Label <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            placeholder="e.g. 'Material Type'"
                            {...register(`product_details.${fieldIndex}.label`, {
                              required: true,
                            })}
                            className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                          />
                          {errors.product_details?.[fieldIndex]?.label && (
                            <p className="text-red-500 text-sm mt-1">
                              Label is required
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Field Type <span className="text-red-500">*</span>
                          </Label>
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
                              <SelectItem value="text">Text Input</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="radio">Radio Buttons</SelectItem>
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
                              className="h-4 w-4 rounded border-gray-300 text-[#5CA131] focus:ring-[#5CA131]"
                            />
                            <Label htmlFor={`required-${fieldIndex}`} className="text-sm font-medium text-gray-700">
                              Required Field
                            </Label>
                          </div>
                        </div>
                      </div>

                      {fieldType === "text" && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Placeholder (optional)
                          </Label>
                          <Input
                            placeholder="e.g. 'Enter material type'"
                            {...register(`product_details.${fieldIndex}.placeholder`)}
                            className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                          />
                        </div>
                      )}

                      {showOptions && (
                        <div className="space-y-4">
                          <Label className="text-sm font-medium text-gray-700 block">
                            Options
                          </Label>
                          <div className="space-y-3">
                            {watch(`product_details.${fieldIndex}.options`)?.map(
                              (option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex gap-3 items-center p-3 bg-white rounded-lg border border-gray-200">
                                  <Input
                                    placeholder="Option label"
                                    {...register(
                                      `product_details.${fieldIndex}.options.${optionIndex}.label`,
                                      { required: true }
                                    )}
                                    className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                                  />
                                  <Input
                                    placeholder="Option value"
                                    {...register(
                                      `product_details.${fieldIndex}.options.${optionIndex}.value`,
                                      { required: true }
                                    )}
                                    className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 px-3 py-2"
                                    onClick={() => removeOption(fieldIndex, optionIndex)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white"
                            onClick={() => addOption(fieldIndex)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                          onClick={() => remove(fieldIndex)}>
                          <X className="w-4 h-4 mr-2" />
                          Remove Field
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-[#5CA131] to-[#47881F] rounded-xl p-6 text-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-[#5CA131] hover:bg-gray-50 font-bold text-lg py-4 px-12 rounded-xl shadow-lg border-2 border-white transition-all disabled:opacity-70">
                {isSubmitting ? "Creating Category..." : "Create Category"}
              </Button>

              {message && (
                <p className={`text-sm mt-4 font-medium ${message.includes("successfully") ? "text-white" : "text-red-100"
                  }`}>
                  {message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}