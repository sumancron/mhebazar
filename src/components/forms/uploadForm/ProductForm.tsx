'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, FileText, Image as ImageIcon, Package, AlertCircle } from 'lucide-react'
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

  // const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setBrochureFile(e.target.files[0])
  //   }
  // }

  // const removeBrochure = () => {
  //   setBrochureFile(null)
  // }

  // const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setImageFiles(Array.from(e.target.files))
  //   }
  // }

  // const removeImage = (idx: number) => {
  //   setImageFiles(files => files.filter((_, i) => i !== idx))
  // }

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

    // Note: Don't include brochure and images in initial product creation
    // They will be uploaded separately using dedicated endpoints

    try {
      setIsSubmitting(true)

      // Step 1: Create the product first
      const productResponse = await api.post(`/products/`, formData)
      const productId = productResponse.data.id // Assuming the API returns the created product's ID

      setMessage('Product created successfully!')

      // Step 2: Upload brochure if provided
      if (brochureFile) {
        const brochureFormData = new FormData()
        brochureFormData.append('brochure', brochureFile)

        try {
          await api.post(`/products/${productId}/upload_brochure/`, brochureFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          console.log("Brochure uploaded successfully")
        } catch (brochureError) {
          console.error("Failed to upload brochure:", brochureError)
          // Optionally show a warning but don't fail the entire process
          setMessage(prev => prev + ' (Warning: Brochure upload failed)')
        }
      }

      // Step 3: Upload images if provided
      if (imageFiles.length > 0) {
        const imagesFormData = new FormData()
        imageFiles.forEach((img) => imagesFormData.append('images', img))

        try {
          await api.post(`/products/${productId}/upload_images/`, imagesFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          console.log("Images uploaded successfully")
        } catch (imagesError) {
          console.error("Failed to upload images:", imagesError)
          // Optionally show a warning but don't fail the entire process
          setMessage(prev => prev + ' (Warning: Images upload failed)')
        }
      }

      // Step 4: Update success message
      setMessage('Product created successfully with all files uploaded!')

      // Optional: Reset form or redirect
      // resetForm()
      // router.push('/products')

    } catch (error) {
      console.error(error)
      setMessage('Failed to create product.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper functions for file handling
  const handleBrochureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setBrochureFile(file)
    } else {
      alert('Please select a valid PDF file')
    }
  }

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const validImages = Array.from(files).filter(file =>
        file.type.startsWith('image/')
      )
      if (validImages.length !== files.length) {
        alert('Some files were skipped. Please select only image files.')
      }
      setImageFiles(prev => [...prev, ...validImages])
    }
  }

  const removeBrochure = () => {
    setBrochureFile(null)
    // Clear the file input
    const input = document.getElementById('brochure-input') as HTMLInputElement
    if (input) input.value = ''
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, idx) => idx !== index))
  }


  const renderDynamicField = (field: ProductDetailField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            placeholder={field.placeholder}
            value={dynamicValues[field.name] || ''}
            onChange={(e) => handleDynamicValueChange(field.name, e.target.value)}
            required={field.required}
          />
        )
      case 'textarea':
        return (
          <Textarea
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px] text-sm"
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
            <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
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
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Add Product</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Category Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Select category*</Label>
                <Select onValueChange={(val) => setValue('category', val)} disabled={loading}>
                  <SelectTrigger className="h-10 border-gray-300 text-sm text-gray-500">
                    <SelectValue placeholder="Select" />
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

              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Select Product Category</Label>
                {Array.isArray(subcategories) && subcategories.length > 0 ? (
                  <Select onValueChange={(val) => setValue('subcategory', val)}>
                    <SelectTrigger className="h-10 border-gray-300 text-sm text-gray-500">
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select disabled>
                    <SelectTrigger className="h-10 border-gray-300 text-sm text-gray-500">
                      <SelectValue placeholder="Select sub category" />
                    </SelectTrigger>
                  </Select>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name', { required: true })}
                placeholder="Enter product name"
                className="h-10 border-gray-300 text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">Product name is required</p>}
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Description</Label>
              <Textarea
                {...register('description')}
                placeholder="Enter product description"
                className="border-gray-300 min-h-[80px] text-sm resize-none"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Manufacturer</Label>
              <Input
                {...register('manufacturer')}
                placeholder="Manufacturer name"
                className="h-10 border-gray-300 text-sm"
              />
            </div>

            {/* Model and Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Model</Label>
                <Input
                  {...register('model')}
                  placeholder="Model number"
                  className="h-10 border-gray-300 text-sm"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('price', { required: true })}
                  placeholder="0.00"
                  className="h-10 border-gray-300 text-sm"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">Price is required</p>}
              </div>
            </div>

            {/* SEO Information */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Meta Title</Label>
                <Input
                  {...register('meta_title')}
                  placeholder="SEO title"
                  className="h-10 border-gray-300 text-sm"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600 mb-1 block">Meta Description</Label>
                <Input
                  {...register('meta_description')}
                  placeholder="SEO description"
                  className="h-10 border-gray-300 text-sm"
                />
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Type</Label>
              <Select onValueChange={(val) => setValue('type', val)}>
                <SelectTrigger className="h-10 border-gray-300 text-sm text-gray-500">
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

            {/* Dynamic Fields */}
            {warning && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-800 text-xs">{warning}</p>
              </div>
            )}

            {Array.isArray(dynamicFields) && dynamicFields.map((field) => (
              <div key={field.name}>
                <Label className="text-sm text-gray-600 mb-1 block">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderDynamicField(field)}
              </div>
            ))}

            {/* File Upload Section */}
            <div className="space-y-4">
              {/* Brochure Upload */}
              <div>
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
                  size="sm"
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                  onClick={() => document.getElementById('brochure-input')?.click()}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Select Brochure (PDF)
                </Button>
                {brochureFile && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded text-xs">
                    <FileText className="w-3 h-3 text-gray-500" />
                    <span className="text-gray-700 flex-1 truncate">{brochureFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={removeBrochure}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Images Upload */}
              <div>
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
                  size="sm"
                  className="w-full h-10 border-gray-300 text-gray-600 text-sm"
                  onClick={() => document.getElementById('images-input')?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Select Product Images
                </Button>
                {imageFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(idx)}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
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

            {message && (
              <div className={`p-3 rounded text-center text-xs ${message.includes('successfully')
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