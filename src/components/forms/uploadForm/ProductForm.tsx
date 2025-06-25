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

type Category = { id: number; name: string; subcategories: Subcategory[]; product_details: Record<string, string> }
type Subcategory = { id: number; name: string; product_details: Record<string, string> }

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
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({})
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
      const catDetails = selectedCat.product_details || {}
      if (Object.keys(catDetails).length > 0) {
        setDynamicFields(catDetails)
        setWarning('')
      } else {
        setDynamicFields({})
        setWarning('No product details defined in this category.')
      }
    } else {
      setDynamicFields({})
      setWarning('Select a subcategory to load product details.')
    }
  }, [selectedCategoryId])

  useEffect(() => {
    if (!selectedSubcategoryId) return

    const sub = subcategories.find((s) => String(s.id) === selectedSubcategoryId)
    if (!sub) return

    const subDetails = sub.product_details || {}
    if (Object.keys(subDetails).length > 0) {
      setDynamicFields(subDetails)
      setWarning('')
    } else {
      setDynamicFields({})
      setWarning('No product details defined in this subcategory. Please add fields from admin panel.')
    }
  }, [selectedSubcategoryId])

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
    formData.append('product_details', JSON.stringify(dynamicFields))
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

          {/* Dynamic Fields */}
          {warning && <p className="text-yellow-500 text-sm">{warning}</p>}
          {Object.entries(dynamicFields).map(([key, value]) => (
            <div key={key}>
              <Label>{key}</Label>
              <Input
                defaultValue={value}
                onChange={(e) => setDynamicFields((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </div>
          ))}

          {/* Other Inputs */}
          <Input {...register('name', { required: true })} placeholder="Product Name" />
          <Textarea {...register('description')} placeholder="Description" />
          <Input {...register('meta_title')} placeholder="Meta Title" />
          <Input {...register('meta_description')} placeholder="Meta Description" />
          <Input {...register('manufacturer')} placeholder="Manufacturer" />
          <Input {...register('model')} placeholder="Model" />
          <Input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" />

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

          {/* File Uploads */}
          <Input type="file" {...register('brochure')} />
          <Input type="file" {...register('images')} multiple />

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
