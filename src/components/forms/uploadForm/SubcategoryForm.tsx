'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'
import Image from 'next/image'

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

    // get access token
  const token = localStorage.getItem('access_token')
  let userData = null;

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

     if (token) {
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            "Authorization": `Bearer ${token}`,
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
    <Card className="max-w-2xl mx-auto p-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Category</Label>
            <Select onValueChange={(val) => setValue('category', val)} disabled={loading}>
              <SelectTrigger>
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

          <div>
            <Label>Name</Label>
            <Input {...register('name', { required: true })} />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Title</Label>
              <Input {...register('meta_title')} />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Input {...register('meta_description')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subcategory Image</Label>
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
                >
                  Select Image
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                {subImageFiles?.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                      onClick={() => removeSubImage(idx)}
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Subcategory Banner</Label>
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
                >
                  Select Banner
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                {subBannerFiles?.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      fill
                      className="object-cover rounded"
                      unoptimized
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                      onClick={() => removeSubBanner(idx)}
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg">Product Details Fields</Label>
            <p className="text-sm text-muted-foreground">
              Define the fields that will appear in the product form for this category
            </p>

            {fields?.map((field, fieldIndex) => {
              const fieldType = watch(`product_details.${fieldIndex}.type`)
              const showOptions = ['select', 'radio', 'checkbox'].includes(fieldType)

              return (
                <div key={field.id} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Field Name*</Label>
                      <Input
                        placeholder="e.g. 'material'"
                        {...register(`product_details.${fieldIndex}.name`, { required: true })}
                      />
                      {errors.product_details?.[fieldIndex]?.name && (
                        <p className="text-red-500 text-sm">Field name is required</p>
                      )}
                    </div>
                    <div>
                      <Label>Display Label*</Label>
                      <Input
                        placeholder="e.g. 'Material Type'"
                        {...register(`product_details.${fieldIndex}.label`, { required: true })}
                      />
                      {errors.product_details?.[fieldIndex]?.label && (
                        <p className="text-red-500 text-sm">Label is required</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Field Type*</Label>
                      <Select
                        onValueChange={(value: ProductDetailField['type']) => {
                          // Update the field type
                          const updatedField = {
                            ...watch(`product_details.${fieldIndex}`),
                            type: value,
                          }
                          remove(fieldIndex)
                          append(updatedField)
                        }}
                        value={fieldType}
                      >
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
                          {...register(`product_details.${fieldIndex}.required`)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor={`required-${fieldIndex}`}>Required Field</Label>
                      </div>
                    </div>
                  </div>

                  {fieldType === 'text' && (
                    <div>
                      <Label>Placeholder (optional)</Label>
                      <Input
                        placeholder="e.g. 'Enter material type'"
                        {...register(`product_details.${fieldIndex}.placeholder`)}
                      />
                    </div>
                  )}

                  {showOptions && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {watch(`product_details.${fieldIndex}.options`)?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2 items-center">
                            <Input
                              placeholder="Option label"
                              {...register(`product_details.${fieldIndex}.options.${optionIndex}.label`, {
                                required: true,
                              })}
                            />
                            <Input
                              placeholder="Option value"
                              {...register(`product_details.${fieldIndex}.options.${optionIndex}.value`, {
                                required: true,
                              })}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeOption(fieldIndex, optionIndex)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
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

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(fieldIndex)}
                    >
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
            >
              Add Product Field
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Subcategory'}
          </Button>

          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}