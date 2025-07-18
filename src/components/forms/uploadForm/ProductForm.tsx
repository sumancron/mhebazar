'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, FileText, Image as ImageIcon, Package, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Cookies from 'js-cookie'
import api from '@/lib/api'
import { useUser } from '@/context/UserContext'

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

type Category = {
  id: number
  name: string
  subcategories: Subcategory[]
  product_details: ProductDetailField[]
}

type Subcategory = {
  id: number
  name: string
  product_details: ProductDetailField[]
}

type ProductFormData = {
  category: string
  subcategory: string
  name: string
  description?: string
  meta_title?: string
  meta_description?: string
  manufacturer?: string
  model?: string
  price: number
  type: string
  brochure?: FileList
  images?: FileList
  product_details: Record<string, string>
}

const TYPE_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'rental', label: 'Rental' },
  { value: 'attachments', label: 'Attachments' },
]

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm<ProductFormData>()

  const selectedCategoryId = watch('category')
  const selectedSubcategoryId = watch('subcategory')

  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [dynamicFields, setDynamicFields] = useState<ProductDetailField[]>([])
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({})
  const [warning, setWarning] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // categories fetch
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

  useEffect(() => {
    if (!selectedCategoryId) return

    const selectedCat = categories.find((cat) => String(cat.id) === selectedCategoryId)
    if (!selectedCat) return

    const subs = selectedCat.subcategories || []
    setSubcategories(subs)
    resetField('subcategory')

    if (subs.length === 0) {
      const catDetails = selectedCat.product_details || []
      if (catDetails.length > 0) {
        setDynamicFields(catDetails)
        setWarning('')
      } else {
        setDynamicFields([])
        setWarning('No product details defined in this category.')
      }
    } else {
      setDynamicFields([])
      setWarning('Select a subcategory to load product details.')
    }
  }, [selectedCategoryId, categories, resetField])

  useEffect(() => {
    if (!selectedSubcategoryId) return

    const sub = subcategories.find((s) => String(s.id) === selectedSubcategoryId)
    if (!sub) return

    const subDetails = sub.product_details || []
    if (subDetails.length > 0) {
      setDynamicFields(subDetails)
      setWarning('')
    } else {
      setDynamicFields([])
      setWarning('No product details defined in this subcategory.')
    }
  }, [selectedSubcategoryId, subcategories])

  const handleDynamicValueChange = (fieldName: string, value: string) => {
    setDynamicValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrochureFile(e.target.files[0])
    }
  }

  const removeBrochure = () => {
    setBrochureFile(null)
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files))
    }
  }

  const removeImage = (idx: number) => {
    setImageFiles(files => files.filter((_, i) => i !== idx))
  }

  // user
  const { user } = useUser();

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData()
    if (user?.id !== undefined) {
      formData.append("user", String(user.id));
    }
    formData.append('category', data.category)
    if (data.subcategory) formData.append('subcategory', data.subcategory)
    formData.append('name', data.name)
    formData.append('description', data.description || '')
    formData.append('meta_title', data.meta_title || '')
    formData.append('meta_description', data.meta_description || '')
    formData.append('manufacturer', data.manufacturer || '')
    formData.append('model', data.model || '')
    formData.append('price', data.price.toString())
    formData.append('type', data.type)
    formData.append('product_details', JSON.stringify(dynamicValues))
    if (brochureFile) formData.append('brochure', brochureFile)
    imageFiles.forEach((img) => formData.append('images', img))
  
    let token = Cookies.get("access_token");
    const refresh = Cookies.get("refresh_token");

    if (!token) {
      const refreshResponse = await axios.post(
        `${API_BASE_URL}/token/refresh/`,
        {refresh},
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
      await api.post(`${API_BASE_URL}/products/`, formData, {
        headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Product created successfully!')
    } catch (error) {
      console.error(error)
      setMessage('Failed to create product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderDynamicField = (field: ProductDetailField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
            placeholder={field.placeholder}
            value={dynamicValues[field.name] || ''}
            onChange={(e) => handleDynamicValueChange(field.name, e.target.value)}
            required={field.required}
          />
        )
      case 'textarea':
        return (
          <Textarea
            className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131] min-h-[100px]"
            placeholder={field.placeholder}
            value={dynamicValues[field.name] || ''}
            onChange={(e) => handleDynamicValueChange(field.name, e.target.value)}
            required={field.required}
          />
        )
      case 'select':
        return (
          <Select
            onValueChange={(value) => handleDynamicValueChange(field.name, value)}
            value={dynamicValues[field.name] || ''}
            required={field.required}
          >
            <SelectTrigger className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(field.options) && field.options.length > 0 ? (
                field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </SelectContent>
          </Select>
        )
      case 'radio':
        return (
          <RadioGroup
            onValueChange={(value: string) => handleDynamicValueChange(field.name, value)}
            value={dynamicValues[field.name] || ''}
            required={field.required}
            className="flex flex-col space-y-3"
          >
            {Array.isArray(field.options) && field.options.length > 0 ? (
              field.options.map((option: FieldOption) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.name}-${option.value}`}
                    className="border-gray-300 text-[#5CA131] focus:ring-[#5CA131]"
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm font-medium">
                    {option.label}
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No options available</div>
            )}
          </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="flex flex-col space-y-3">
            {Array.isArray(field.options) && field.options.length > 0 ? (
              field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    checked={dynamicValues[field.name]?.includes(option.value) || false}
                    onCheckedChange={(checked: boolean | "indeterminate") => {
                      const currentValues: string[] = dynamicValues[field.name]?.split(',').filter(Boolean) || []
                      const newValues: string[] = checked === true
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: string) => v !== option.value)
                      handleDynamicValueChange(field.name, newValues.join(','))
                    }}
                    className="border-gray-300 data-[state=checked]:bg-[#5CA131] data-[state=checked]:border-[#5CA131]"
                  />
                  <Label htmlFor={`${field.name}-${option.value}`} className="text-sm font-medium">
                    {option.label}
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No options available</div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Card className="max-w-4xl mx-auto shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-[#5CA131] to-[#47881F] text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6" />
            Create New Product
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Category Selection Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category & Classification</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Category</Label>
                  <Select onValueChange={(val) => setValue('category', val)} disabled={loading}>
                    <SelectTrigger className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
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
                </div>

                {Array.isArray(subcategories) && subcategories.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Subcategory</Label>
                    <Select onValueChange={(val) => setValue('subcategory', val)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={String(sub.id)}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('name', { required: true })}
                    placeholder="Enter product name"
                    className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">Product name is required</p>}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Description</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Enter product description"
                    className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131] min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Manufacturer</Label>
                    <Input
                      {...register('manufacturer')}
                      placeholder="Manufacturer name"
                      className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Model</Label>
                    <Input
                      {...register('model')}
                      placeholder="Model number"
                      className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('price', { required: true })}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">Price is required</p>}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Type</Label>
                    <Select onValueChange={(val) => setValue('type', val)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Meta Title</Label>
                  <Input
                    {...register('meta_title')}
                    placeholder="SEO title"
                    className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Meta Description</Label>
                  <Input
                    {...register('meta_description')}
                    placeholder="SEO description"
                    className="border-gray-300 focus:border-[#5CA131] focus:ring-[#5CA131]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Fields Section */}
            {(Array.isArray(dynamicFields) && dynamicFields.length > 0) || warning ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>

                {warning && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800 text-sm">{warning}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {Array.isArray(dynamicFields) && dynamicFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderDynamicField(field)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* File Upload Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Files & Media</h3>

              <div className="space-y-6">
                {/* Brochure Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Brochure (PDF)</Label>
                  <input
                    id="brochure-input"
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={handleBrochureChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white"
                    onClick={() => document.getElementById('brochure-input')?.click()}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Select Brochure
                  </Button>
                  {brochureFile && (
                    <div className="flex items-center gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1">{brochureFile.name}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={removeBrochure}
                        aria-label="Remove brochure"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Images Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Product Images</Label>
                  <input
                    id="images-input"
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImagesChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#5CA131] text-[#5CA131] hover:bg-[#5CA131] hover:text-white"
                    onClick={() => document.getElementById('images-input')?.click()}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Select Images
                  </Button>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          onClick={() => removeImage(idx)}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5CA131] hover:bg-[#47881F] text-white px-8 py-3 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-center ${message.includes('successfully')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
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