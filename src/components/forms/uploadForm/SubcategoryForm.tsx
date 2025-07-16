'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, Minus, Settings } from 'lucide-react'
import Image from 'next/image'
import Cookies from 'js-cookie'

type FieldOption = {
  label: string
  value: string
}

type ProductDetailField = {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox'
  required: boolean
  options?: FieldOption[]
  placeholder?: string
}

type SubcategoryFormData = {
  category: string
  name: string
  description?: string
  meta_title?: string
  meta_description?: string
  sub_image?: FileList
  sub_banner?: FileList
  product_details: ProductDetailField[]
}

type Category = {
  id: number
  name: string
}

export default function SubcategoryForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubcategoryFormData>({
    defaultValues: {
      product_details: [],
    },
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'product_details',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Add local state for images
  const [subImageFiles, setSubImageFiles] = useState<File[]>([])
  const [subBannerFiles, setSubBannerFiles] = useState<File[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/categories/`)

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setCategories(response.data)
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated responses
          setCategories(response.data.results)
        } else {
          console.error('Unexpected API response format:', response.data)
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
        setMessage('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Handle file input change
  const handleSubImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubImageFiles(Array.from(e.target.files))
    }
  }
  const handleSubBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSubBannerFiles(Array.from(e.target.files))
    }
  }

  // Remove image by index
  const removeSubImage = (idx: number) => {
    setSubImageFiles((files) => files.filter((_, i) => i !== idx))
  }
  const removeSubBanner = (idx: number) => {
    setSubBannerFiles((files) => files.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data: SubcategoryFormData) => {
    const formData = new FormData()
    formData.append('category', data.category)
    formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.meta_title) formData.append('meta_title', data.meta_title)
    if (data.meta_description) formData.append('meta_description', data.meta_description)
    if (subImageFiles[0]) formData.append('sub_image', subImageFiles[0])
    if (subBannerFiles[0]) formData.append('sub_banner', subBannerFiles[0])
    formData.append('product_details', JSON.stringify(data.product_details))

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
      setIsSubmitting(true)
      await axios.post(`${API_BASE_URL}/subcategories/`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      })
      setMessage('Subcategory created successfully!')
    } catch (error: unknown) {
      console.error(error)
      setMessage('Failed to create subcategory.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addOption = (fieldIndex: number) => {
    const newOption = { label: '', value: '' }
    const currentOptions = watch(`product_details.${fieldIndex}.options`) || []
    const updatedOptions = [...currentOptions, newOption]
    // We need to update the entire field to trigger a re-render
    const updatedField = {
      ...watch(`product_details.${fieldIndex}`),
      options: updatedOptions,
    }
    // Replace the field with the updated version
    remove(fieldIndex)
    append(updatedField, { focusName: `product_details.${fieldIndex}.options.${updatedOptions.length - 1}.label` })
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const currentOptions = watch(`product_details.${fieldIndex}.options`) || []
    const updatedOptions = currentOptions.filter((_, idx) => idx !== optionIndex)
    const updatedField = {
      ...watch(`product_details.${fieldIndex}`),
      options: updatedOptions,
    }
    remove(fieldIndex)
    append(updatedField)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-[#5CA131] to-[#47881F] text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Create Subcategory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#5CA131] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Category *</Label>
                  <Select onValueChange={(val) => setValue('category', val)} disabled={loading}>
                    <SelectTrigger className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
                      <SelectValue placeholder={loading ? "Loading categories..." : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(categories) && categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        !loading && (
                          <div className="px-2 py-1 text-sm text-gray-500">
                            No categories available
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">Category is required</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Name *</Label>
                  <Input
                    {...register('name', { required: true })}
                    className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    placeholder="Enter subcategory name"
                  />
                  {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea
                  {...register('description')}
                  className="min-h-[100px] border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  placeholder="Enter subcategory description"
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#5CA131] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Meta Title</Label>
                  <Input
                    {...register('meta_title')}
                    className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    placeholder="Enter meta title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Meta Description</Label>
                  <Input
                    {...register('meta_description')}
                    className="h-11 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    placeholder="Enter meta description"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#5CA131] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Media Files</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Subcategory Image</Label>
                  <div>
                    <input
                      id="sub-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleSubImageChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('sub-image-input')?.click()}
                      className="w-full h-11 border-2 border-dashed border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Select Image
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {subImageFiles?.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          onClick={() => removeSubImage(idx)}
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Subcategory Banner</Label>
                  <div>
                    <input
                      id="sub-banner-input"
                      type="file"
                      accept="image/*"
                      onChange={handleSubBannerChange}
                      style={{ display: 'none' }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('sub-banner-input')?.click()}
                      className="w-full h-11 border-2 border-dashed border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Select Banner
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {subBannerFiles?.map((file, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                          onClick={() => removeSubBanner(idx)}
                          aria-label="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div className="border-l-4 border-[#5CA131] pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details Fields</h3>
                <p className="text-sm text-gray-600">
                  Define the fields that will appear in the product form for this category
                </p>
              </div>

              <div className="space-y-4">
                {fields?.map((field, fieldIndex) => {
                  const fieldType = watch(`product_details.${fieldIndex}.type`)
                  const showOptions = ['select', 'radio', 'checkbox'].includes(fieldType)

                  return (
                    <Card key={field.id} className="border-2 border-gray-200 hover:border-[#5CA131] transition-colors">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Field Name *</Label>
                              <Input
                                placeholder="e.g. 'material'"
                                {...register(`product_details.${fieldIndex}.name`, { required: true })}
                                className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                              />
                              {errors.product_details?.[fieldIndex]?.name && (
                                <p className="text-red-500 text-sm">Field name is required</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Display Label *</Label>
                              <Input
                                placeholder="e.g. 'Material Type'"
                                {...register(`product_details.${fieldIndex}.label`, { required: true })}
                                className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                              />
                              {errors.product_details?.[fieldIndex]?.label && (
                                <p className="text-red-500 text-sm">Label is required</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Field Type *</Label>
                              <Select
                                onValueChange={(value: ProductDetailField['type']) => {
                                  const updatedField = {
                                    ...watch(`product_details.${fieldIndex}`),
                                    type: value,
                                  }
                                  remove(fieldIndex)
                                  append(updatedField)
                                }}
                                value={fieldType}
                              >
                                <SelectTrigger className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
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
                                  {...register(`product_details.${fieldIndex}.required`)}
                                  className="h-4 w-4 rounded border-gray-300 text-[#5CA131] focus:ring-[#5CA131]"
                                />
                                <Label htmlFor={`required-${fieldIndex}`} className="text-sm font-medium text-gray-700">
                                  Required Field
                                </Label>
                              </div>
                            </div>
                          </div>

                          {fieldType === 'text' && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">Placeholder (optional)</Label>
                              <Input
                                placeholder="e.g. 'Enter material type'"
                                {...register(`product_details.${fieldIndex}.placeholder`)}
                                className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                              />
                            </div>
                          )}

                          {showOptions && (
                            <div className="space-y-3">
                              <Label className="text-sm font-medium text-gray-700">Options</Label>
                              <div className="space-y-2">
                                {watch(`product_details.${fieldIndex}.options`)?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex gap-2 items-center">
                                    <Input
                                      placeholder="Option label"
                                      {...register(`product_details.${fieldIndex}.options.${optionIndex}.label`, {
                                        required: true,
                                      })}
                                      className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                                    />
                                    <Input
                                      placeholder="Option value"
                                      {...register(`product_details.${fieldIndex}.options.${optionIndex}.value`, {
                                        required: true,
                                      })}
                                      className="h-10 border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeOption(fieldIndex, optionIndex)}
                                      className="text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(fieldIndex)}
                                className="border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          )}

                          <div className="flex justify-end pt-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(fieldIndex)}
                              className="text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400"
                            >
                              <Minus className="w-4 h-4 mr-2" />
                              Remove Field
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      name: '',
                      label: '',
                      type: 'text',
                      required: false,
                      options: [],
                    })
                  }
                  className="w-full h-12 border-2 border-dashed border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product Field
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#5CA131] hover:bg-[#47881F] text-white font-medium text-lg transition-colors shadow-md"
              >
                {isSubmitting ? 'Creating Subcategory...' : 'Create Subcategory'}
              </Button>
            </div>

            {message && (
              <div className={`text-center p-4 rounded-lg ${message.includes('success')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}