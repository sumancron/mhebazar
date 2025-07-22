'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, ImageIcon } from 'lucide-react'
// import Image from 'next/image'
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Create Subcategory</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(val) => setValue('category', val)} disabled={loading}>
                    <SelectTrigger className="h-10 border-gray-300 text-sm text-gray-500">
                      <SelectValue placeholder={loading ? "Loading..." : "Select a category"} />
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
                            No categories found
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">Category is required</p>}
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('name', { required: true })}
                    className="h-10 border-gray-300 text-sm"
                    placeholder="Enter subcategory name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Description</Label>
                <Textarea
                  {...register('description')}
                  className="min-h-[80px] border-gray-300 text-sm resize-none"
                  placeholder="Enter subcategory description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Meta Title</Label>
                  <Input
                    {...register('meta_title')}
                    className="h-10 border-gray-300 text-sm"
                    placeholder="Enter meta title"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Meta Description</Label>
                  <Input
                    {...register('meta_description')}
                    className="h-10 border-gray-300 text-sm"
                    placeholder="Enter meta description"
                  />
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Subcategory Image</Label>
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
                  size="sm"
                  onClick={() => document.getElementById('sub-image-input')?.click()}
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Image
                </Button>
                {subImageFiles?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {subImageFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeSubImage(idx)}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Subcategory Banner</Label>
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
                  size="sm"
                  onClick={() => document.getElementById('sub-banner-input')?.click()}
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Banner
                </Button>
                {subBannerFiles?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {subBannerFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeSubBanner(idx)}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-md font-semibold text-gray-800">Product Detail Fields</h3>

              <div className="space-y-4">
                {fields?.map((field, fieldIndex) => {
                  const fieldType = watch(`product_details.${fieldIndex}.type`)
                  const showOptions = ['select', 'radio', 'checkbox'].includes(fieldType)

                  return (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Field Name *</Label>
                          <Input
                            placeholder="e.g. 'material'"
                            {...register(`product_details.${fieldIndex}.name`, { required: true })}
                            className="h-10 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Display Label *</Label>
                          <Input
                            placeholder="e.g. 'Material Type'"
                            {...register(`product_details.${fieldIndex}.label`, { required: true })}
                            className="h-10 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
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
                        <div>
                          <Label className="text-sm text-gray-600 mb-1 block">Placeholder (optional)</Label>
                          <Input
                            placeholder="e.g. 'Enter material type'"
                            {...register(`product_details.${fieldIndex}.placeholder`)}
                            className="h-10 border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {showOptions && (
                        <div className="space-y-3 pt-2">
                          <Label className="text-sm text-gray-600 block">Options</Label>
                          <div className="space-y-2">
                            {watch(`product_details.${fieldIndex}.options`)?.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2 items-center">
                                <Input
                                  placeholder="Option label"
                                  {...register(`product_details.${fieldIndex}.options.${optionIndex}.label`, { required: true })}
                                  className="h-10 border-gray-300 text-sm"
                                />
                                <Input
                                  placeholder="Option value"
                                  {...register(`product_details.${fieldIndex}.options.${optionIndex}.value`, { required: true })}
                                  className="h-10 border-gray-300 text-sm"
                                />
                                <Button
                                  type="button"
                                  variant="ghost" size="icon"
                                  onClick={() => removeOption(fieldIndex, optionIndex)}
                                  className="text-red-500 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            type="button" variant="outline" size="sm"
                            onClick={() => addOption(fieldIndex)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}

                      <div className="flex justify-end pt-3 border-t">
                        <Button
                          type="button" variant="ghost" size="sm"
                          onClick={() => remove(fieldIndex)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove Field
                        </Button>
                      </div>
                    </div>
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product Field
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10"
              >
                {isSubmitting ? 'Creating...' : 'Create Subcategory'}
              </Button>
            </div>

            {message && (
              <div className={`p-3 rounded text-center text-xs ${message.includes('success')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}