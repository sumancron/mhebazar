'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  { value: 'old', label: 'Old' },
  { value: 'rental', label: 'Rental' },
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

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/').then((res) => setCategories(res.data))
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
  }, [selectedCategoryId, categories])

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

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData()
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
    if (data.brochure?.[0]) formData.append('brochure', data.brochure[0])
    if (data.images?.length) {
      Array.from(data.images).forEach((img) => formData.append('images', img))
    }

    try {
      setIsSubmitting(true)
      await axios.post('http://localhost:8000/api/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
            placeholder={field.placeholder}
            value={dynamicValues[field.name] || ''}
            onChange={(e) => handleDynamicValueChange(field.name, e.target.value)}
            required={field.required}
          />
        )
      case 'textarea':
        return (
          <Textarea
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
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'radio':
        return (
            <RadioGroup
            onValueChange={(value: string) => handleDynamicValueChange(field.name, value)}
            value={dynamicValues[field.name] || ''}
            required={field.required}
            className="flex flex-col space-y-2"
            >
            {field.options?.map((option: FieldOption) => (
              <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
              <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
            </RadioGroup>
        )
      case 'checkbox':
        return (
          <div className="flex flex-col space-y-2">
            {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  checked={dynamicValues[field.name]?.includes(option.value) || false}
                  onCheckedChange={(checked: boolean | "indeterminate") => {
                  const currentValues: string[] = dynamicValues[field.name]?.split(',') || []
                  const newValues: string[] = checked === true
                    ? [...currentValues, option.value]
                    : currentValues.filter((v: string) => v !== option.value)
                  handleDynamicValueChange(field.name, newValues.join(','))
                  }}
                />
                <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
                </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="max-w-3xl mx-auto p-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Select */}
          <div>
            <Label>Category</Label>
            <Select onValueChange={(val) => setValue('category', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Select */}
          {subcategories.length > 0 && (
            <div>
              <Label>Subcategory</Label>
              <Select onValueChange={(val) => setValue('subcategory', val)}>
                <SelectTrigger>
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

          {/* Standard Product Fields */}
          <div>
            <Label>
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register('name', { required: true })}
              placeholder="Product Name"
            />
            {errors.name && <p className="text-red-500 text-sm">Product name is required</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} placeholder="Description" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Title</Label>
              <Input {...register('meta_title')} placeholder="Meta Title" />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Input {...register('meta_description')} placeholder="Meta Description" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Manufacturer</Label>
              <Input {...register('manufacturer')} placeholder="Manufacturer" />
            </div>
            <div>
              <Label>Model</Label>
              <Input {...register('model')} placeholder="Model" />
            </div>
          </div>

          <div>
            <Label>
              Price <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              {...register('price', { required: true })}
              placeholder="Price"
            />
            {errors.price && <p className="text-red-500 text-sm">Price is required</p>}
          </div>

          {/* Type Select */}
          <div>
            <Label>Type</Label>
            <Select onValueChange={(val) => setValue('type', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
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
          {warning && <p className="text-yellow-500 text-sm">{warning}</p>}
          {dynamicFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderDynamicField(field)}
            </div>
          ))}

          {/* File Uploads */}
          <div>
            <Label>Brochure (PDF)</Label>
            <Input type="file" accept=".pdf" {...register('brochure')} />
          </div>

          <div>
            <Label>Product Images</Label>
            <Input type="file" accept="image/*" {...register('images')} multiple />
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Product'}
          </Button>
          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}